import { NextResponse } from 'next/server';
import { createHmac, createHash } from 'crypto';
import { prisma } from '@/lib/prisma';

function signQuote(payload: {
  serviceId: string | number;
  price: number;
  toPostalCode: string;
  timestamp: number;
  cartId: string;
  cartHash: string;
}): string {
  const secret = process.env.SHIPPING_SIGNING_SECRET || process.env.MELHOR_ENVIO_TOKEN || '';
  const h = createHmac('sha256', secret);

  const data = {
    serviceId: String(payload.serviceId),
    price: Number(payload.price),
    toPostalCode: String(payload.toPostalCode),
    timestamp: Number(payload.timestamp),
    cartId: String(payload.cartId),
    cartHash: String(payload.cartHash),
  };
  h.update(JSON.stringify(data));
  return h.digest('hex');
}

function computeCartHash(cart: any): string {
  const h = createHash('sha256');
  const parts: string[] = [];
  for (const it of (cart?.items || [])) {
    const p = it.product || {};
    parts.push([
      String(p.id),
      Number(it.quantity || 0),
      Number(p.width || 0),
      Number(p.height || 0),
      Number(p.length || 0),
      Number(p.weight || 0),
    ].join(':'));
  }
  // stable order
  parts.sort();
  h.update(parts.join('|'));
  return h.digest('hex');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
  const { to_postal_code, cartId } = body;

    if (!cartId) {
      return NextResponse.json({ error: 'cartId é obrigatório' }, { status: 400 });
    }

    const MELHOR_ENVIO_URL = process.env.MELHOR_ENVIO_URL || 'https://melhorenvio.com.br/api/v2/me/shipment/calculate';
    const MELHOR_ENVIO_TOKEN = process.env.MELHOR_ENVIO_TOKEN;
    if (!MELHOR_ENVIO_TOKEN) {
      return NextResponse.json({ error: 'MELHOR_ENVIO_TOKEN not configured' }, { status: 500 });
    }

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, width: true, height: true, length: true, weight: true, price: true },
            },
          },
        },
      },
    });
    if (!cart) {
      return NextResponse.json({ error: 'Carrinho não encontrado' }, { status: 404 });
    }

    const products = (cart.items || []).map((it: any) => ({
      id: String(it.product?.id),
      width: it.product?.width || 11,
      height: it.product?.height || 11,
      length: it.product?.length || 17,
      weight: it.product?.weight || 3,
      insurance_value: 0,
      quantity: it.quantity || 1,
    }));

    const payload = {
      from: { postal_code: '97538000' },
      to: { postal_code: String(to_postal_code).replace(/\D/g, '') },
      products,
    };

    const res = await fetch(MELHOR_ENVIO_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${MELHOR_ENVIO_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

  const ts = Date.now();
  const toCep = payload.to.postal_code;
  const cartHash = computeCartHash(cart);

    const shippingOptions = Array.isArray(data)
      ? data.map((opt: any) => {
          const price = Number(opt?.price ?? 0);
          const serviceId = opt?.id ?? opt?.service_id ?? '';
          const sig = signQuote({ serviceId, price, toPostalCode: toCep, timestamp: ts, cartId, cartHash });
          return { ...opt, meta: { sig, ts, cartId, cartHash } };
        })
      : data;

    let subtotal = 0;
    try {
      if (cart && Array.isArray(cart.items)) {
        subtotal = cart.items.reduce((acc: number, it: any) => acc + (it.product?.price || 0) * (it.quantity || 0), 0);
      }
    } catch (e) {
      console.warn('Could not calculate subtotal on server', e);
    }

  return NextResponse.json({ shippingOptions, subtotal }, { status: res.status });
  } catch (err: any) {
    console.error('Error calling Melhor Envio', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
