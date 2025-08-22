'use server';

import { MercadoPagoConfig, Preference } from 'mercadopago';
import { getServerSession } from 'next-auth';
import { auth } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';
import { RateLimit } from '@/lib/rateLimit';
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
    const userId = (session?.user as any)?.id || (session?.user as any)?.userID;
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    const rl = await RateLimit.check(userId, { windowMs: 60_000, maxRequests: 5, keyPrefix: 'mp:pref' });
    if (!rl.allowed) {
      throw new Error('Muitas tentativas. Tente novamente em instantes.');
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

    if (cart.userId && cart.userId !== userId) {
      throw new Error('Carrinho não pertence ao usuário');
    }

    const subtotal = cart.items.reduce((acc, item) => {
      return acc + (item.product.price * item.quantity);
    }, 0);

    if (!selection?.sig || !selection?.serviceId || selection.price == null || !selection.toPostalCode) {
      throw new Error('Seleção de frete inválida');
    }

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
      userId
    );

    let order = await prisma.order.findFirst({ where: { preferenceId: String(preference.id) } });
    if (!order) {
      order = await prisma.order.create({
        data: {
          user: { connect: { id: userId } },
          cartId: cart.id,
          subtotal,
          shippingPrice,
          total: subtotal + shippingPrice,
          status: 'pending',
          preferenceId: String(preference.id),
          shippingServiceId: String(selection.serviceId),
          shippingPostalCode: String(selection.toPostalCode).replace(/\D/g, ''),
          shippingSig: String(selection.sig),
          items: {
            create: cart.items.map((item: any) => ({
              productId: item.product.id,
              productVariantId: item.productVariant?.id || undefined,
              name: `${item.product.name}${item.productVariant?.color?.name ? ` - ${item.productVariant.color.name}` : ''}`.substring(0, 255),
              unitPrice: Number(item.product.price),
              quantity: Number(item.quantity),
              imageUrl: item.product.imagePrimary || undefined,
            })),
          },
        },
      });
    }

    return {
      success: true,
      init_point: preference.init_point,
      preference_id: preference.id,
      order_id: order?.id,
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

  const baseUrl = process.env.MP_BASE_URL || 'https://77a30cef26fd.ngrok-free.app/';
  const whSecret = process.env.MP_WEBHOOK_SECRET;
  const hookUrl = whSecret
    ? `${baseUrl}/api/mercadopago/webhook?t=${encodeURIComponent(whSecret)}`
    : `${baseUrl}/api/mercadopago/webhook`;

  const preferenceData = {
    items,
    notification_url: hookUrl,
    external_reference: userId, 
    back_urls: {
      success: `${baseUrl}/checkout/retorno?status=success`,
      pending: `${baseUrl}/checkout/retorno?status=pending`,
      failure: `${baseUrl}/checkout/retorno?status=failure`,
    },
    auto_return: 'approved',
  } as any;

  const preference = await preferenceClient.create({ body: preferenceData });

  return preference;
}