'use server';

import { MercadoPagoConfig, Preference } from 'mercadopago';
import { getServerSession } from 'next-auth';
import { auth } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';
import { createHmac, createHash } from 'crypto';

type ShippingSelection = {
  serviceId: string;
  price: number;
  sig: string;
  ts: number;
  toPostalCode: string;
  cartId: string;
  cartHash: string;
};

function verifyQuoteSignature(sel: ShippingSelection): boolean {
  const secret = process.env.SHIPPING_SIGNING_SECRET || process.env.MELHOR_ENVIO_TOKEN || '';
  if (!secret) return false;
  const cleanCep = String(sel.toPostalCode).replace(/\D/g, '');
  const data = {
    serviceId: String(sel.serviceId),
    price: Number(sel.price),
    toPostalCode: String(cleanCep),
    timestamp: Number(sel.ts),
    cartId: String(sel.cartId),
    cartHash: String(sel.cartHash),
  };
  const h = createHmac('sha256', secret);
  h.update(JSON.stringify(data));
  const expected = h.digest('hex');
  const maxAgeMs = 15 * 60 * 1000;
  const fresh = Date.now() - Number(sel.ts) <= maxAgeMs;
  return expected === sel.sig && fresh;
}

export async function calculateShippingAndCreatePayment(selection: ShippingSelection) {
  try {
    const session = await getServerSession(auth);
    if (!session?.user) {
      throw new Error('Usuário não autenticado');
    }

    if (!selection.cartId) {
      throw new Error('Carrinho não informado na cotação');
    }

    const cart = await prisma.cart.findUnique({
      where: { id: selection.cartId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imagePrimary: true,
                width: true,
                height: true,
                length: true,
                weight: true,
              },
            },
            productVariant: {
              include: {
                color: {
                  select: {
                    name: true,
                    hexCode: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error('Carrinho vazio ou não encontrado');
    }
    // Valida se o carrinho pertence ao usuário logado quando aplicável
    if (cart.userId && cart.userId !== session.user.id) {
      throw new Error('Carrinho não pertence ao usuário');
    }

    const subtotal = cart.items.reduce((acc, item) => {
      return acc + (item.product.price * item.quantity);
    }, 0);
    // Verify the signed quote instead of calling Melhor Envio novamente
    if (!selection?.sig || !selection?.serviceId || selection.price == null || !selection.toPostalCode) {
      throw new Error('Seleção de frete inválida');
    }
    // Recalcular hash do carrinho no servidor
    const parts = cart.items
      .map((it: any) => [
        String(it.product.id),
        Number(it.quantity || 0),
        Number(it.product.width || 0),
        Number(it.product.height || 0),
        Number(it.product.length || 0),
        Number(it.product.weight || 0),
      ].join(':'))
      .sort()
      .join('|');
    const ch = createHash('sha256');
    ch.update(parts);
    const serverCartHash = ch.digest('hex');

    if (!selection.cartId || !selection.cartHash || selection.cartId !== cart.id) {
      throw new Error('Carrinho da cotação não corresponde');
    }
    if (selection.cartHash !== serverCartHash) {
      throw new Error('O carrinho foi alterado. Recalcule o frete.');
    }

    const isValid = verifyQuoteSignature(selection);
    if (!isValid) {
      throw new Error('Cotação de frete expirada ou inválida');
    }
    const shippingPrice = Number(selection.price);

    const preference = await createMercadoPagoPreference(
      cart,
      subtotal,
      shippingPrice,
      session.user.id
    );

    console.log('✅ Pagamento criado:', preference.id);

    return {
      success: true,
      init_point: preference.init_point,
      preference_id: preference.id,
      subtotal,
      shippingPrice,
      total: subtotal + shippingPrice
    };
  } catch (error) {
    console.error('Erro no cálculo de frete:', error);
    throw new Error(error instanceof Error ? error.message : 'Erro interno');
  }
}

async function createMercadoPagoPreference(
  cart: any,
  subtotal: number,
  shippingPrice: number,
  userId: string
) {
  const MERCADOPAGO_ACCESS_TOKEN = process.env.NEXT_ACCESS_TOKEN;
  if (!MERCADOPAGO_ACCESS_TOKEN) {
    throw new Error('Token do Mercado Pago não configurado');
  }

  const client = new MercadoPagoConfig({ 
    accessToken: MERCADOPAGO_ACCESS_TOKEN,
    options: { timeout: 5000 }
  });
  
  const preferenceClient = new Preference(client);

  const items = cart.items.map((item: any) => {
    const productName = item.product.name;
    const variantInfo = item.productVariant?.color?.name ? 
      ` - ${item.productVariant.color.name}` : '';
    
    return {
      id: item.product.id,
      title: `${productName}${variantInfo}`.substring(0, 127), 
      description: `Produto: ${productName}${variantInfo} | Preço unitário: R$ ${Number(item.product.price).toFixed(2)}`,
      picture_url: item.product.imagePrimary ? `${item.product.imagePrimary}` : undefined,
      quantity: Number(item.quantity),
      unit_price: Number(item.product.price),
      currency_id: 'BRL'
    };
  });

  // Adicionar frete como item separado
  if (shippingPrice > 0) {
    items.push({ 
      id: 'frete',
      title: 'Frete',
      description: `Entrega - Valor: R$ ${Number(shippingPrice).toFixed(2)}`,
      category_id: 'shipping',
      quantity: 1,
      unit_price: Number(shippingPrice),
      currency_id: 'BRL'
    });
  }

  const preferenceData = {
    items
  };

  const preference = await preferenceClient.create({ body: preferenceData });
  console.log('✅ MercadoPago OK:', preference.id);

  return preference;
}