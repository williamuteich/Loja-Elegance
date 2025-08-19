import { NextResponse } from 'next/server';
import { RateLimit, getClientIP } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    // ✅ SEGURANÇA: Rate limiting para pagamentos
    const clientIP = getClientIP(req);
    const rateLimitResult = await RateLimit.check(
      clientIP,
      RateLimit.configs.payment
    );
    
    if (!rateLimitResult.allowed) {
      console.warn(`🚨 RATE LIMIT: Payment API blocked for ${clientIP}`);
      return NextResponse.json(
        { 
          error: 'Muitas tentativas de pagamento. Aguarde um momento.',
          remainingRequests: rateLimitResult.remainingRequests,
          resetTime: rateLimitResult.resetTime
        },
        { status: 429 }
      );
    }
    
    const body = await req.json();
    const { cartId, shippingId, shippingPrice, total: totalReceived, subtotal: subtotalReceived } = body;
    
    console.log('💳 CREATE PAYMENT - Dados recebidos:', {
      cartId,
      shippingId, 
      shippingPrice,
      total: totalReceived,
      subtotal: subtotalReceived,
      totalType: typeof totalReceived,
      subtotalType: typeof subtotalReceived
    });

    const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!MERCADOPAGO_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'MERCADOPAGO_ACCESS_TOKEN not configured' }, { status: 501 });
    }

    // Se recebemos o total já calculado, usar ele
    if (totalReceived && subtotalReceived) {
      console.log('✅ Usando totais já calculados do frontend:', { total: totalReceived, subtotal: subtotalReceived, frete: shippingPrice });
      
      const items = [
        { title: 'Produtos', quantity: 1, unit_price: Number(subtotalReceived) }
      ];
      
      if (shippingPrice && Number(shippingPrice) > 0) {
        items.push({ title: 'Frete', quantity: 1, unit_price: Number(shippingPrice) });
      }
      
      console.log('📋 Items simplificados para MP:', items);
      console.log('🎯 TOTAL FINAL confirmado:', totalReceived);
      
      const mercadopago = require('mercadopago');
      mercadopago.configure({ access_token: MERCADOPAGO_ACCESS_TOKEN });

      const preference = {
        items,
        back_urls: {
          success: `${process.env.NEXTAUTH_URL || ''}/checkout/sucesso`,
          failure: `${process.env.NEXTAUTH_URL || ''}/checkout/falha`,
          pending: `${process.env.NEXTAUTH_URL || ''}/checkout/pending`,
        },
        auto_return: 'approved',
      };

      const response = await mercadopago.preferences.create(preference);
      return NextResponse.json({ init_point: response.body.init_point, preference_id: response.body.id });
    }

    // Fallback: buscar do banco (método antigo)
    console.log('⚠️ Totais não recebidos, buscando do banco...');

    const { prisma } = require('@/lib/prisma');
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: { select: { name: true, price: true } } } } },
    });

    if (!cart) {
      console.log('❌ Carrinho não encontrado para ID:', cartId);
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    console.log('🛒 Carrinho encontrado:', {
      id: cart.id,
      itemsCount: cart.items.length,
      items: cart.items.map((it: any) => ({
        name: it.product?.name,
        price: it.product?.price,
        quantity: it.quantity
      }))
    });

    const items = cart.items.map((it: any) => ({
      title: it.product?.name || 'Produto',
      quantity: Number(it.quantity || 1),
      unit_price: Number(it.product?.price || 0),
    }));

    console.log('📦 Items do carrinho para MP:', items);

    // Calcular subtotal dos produtos
    const subtotal = items.reduce((acc: number, item: any) => acc + (item.unit_price * item.quantity), 0);
    console.log('💰 Subtotal dos produtos:', subtotal);

    // include shipping as an extra item
    const shippingValue = Number(shippingPrice || 0);
    console.log('🚚 Valor do frete:', shippingValue);
    
    if (shippingValue > 0) {
      items.push({ title: 'Frete', quantity: 1, unit_price: shippingValue });
      console.log('✅ Frete adicionado aos items');
    }

    // Calcular total final
    const total = items.reduce((acc: number, item: any) => acc + (item.unit_price * item.quantity), 0);
    console.log('🎯 TOTAL FINAL para pagamento:', total, '(subtotal:', subtotal, '+ frete:', shippingValue, ')');

    console.log('📋 Items finais para Mercado Pago:', items);

    const mercadopago = require('mercadopago');
    mercadopago.configure({ access_token: MERCADOPAGO_ACCESS_TOKEN });

    const preference = {
      items,
      back_urls: {
        success: `${process.env.NEXTAUTH_URL || ''}/checkout/sucesso`,
        failure: `${process.env.NEXTAUTH_URL || ''}/checkout/falha`,
        pending: `${process.env.NEXTAUTH_URL || ''}/checkout/pending`,
      },
      auto_return: 'approved',
    };

    const response = await mercadopago.preferences.create(preference);
    return NextResponse.json({ init_point: response.body.init_point, preference_id: response.body.id });
  } catch (err: any) {
    console.error('Error creating Mercado Pago preference', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
