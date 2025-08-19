import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
  const { products, to_postal_code, cartId } = body;

    const MELHOR_ENVIO_URL = process.env.MELHOR_ENVIO_URL || 'https://melhorenvio.com.br/api/v2/me/shipment/calculate';
    const MELHOR_ENVIO_TOKEN = process.env.MELHOR_ENVIO_TOKEN;
    if (!MELHOR_ENVIO_TOKEN) {
      return NextResponse.json({ error: 'MELHOR_ENVIO_TOKEN not configured' }, { status: 500 });
    }

    const payload = {
      from: { postal_code: '97538000' },
      to: { postal_code: to_postal_code.replace(/\D/g, '') },
      products: products.map((p: any) => ({
        id: String(p.id),
        width: p.width || 11,
        height: p.height || 11,
        length: p.length || 17,
        weight: p.weight || 3,
        insurance_value: p.insurance_value || 5,
        quantity: p.quantity || 1,
      })),
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

    // Calculate subtotal on backend if cartId provided
    let subtotal = 0;
    try {
      if (cartId) {
        // Lazy require prisma to avoid top-level dependency in edge/runtime mismatches
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { prisma } = require('@/lib/prisma');
        const cart = await prisma.cart.findUnique({
          where: { id: cartId },
          include: {
            items: {
              include: { product: { select: { price: true } } },
            },
          },
        });
        if (cart && Array.isArray(cart.items)) {
          subtotal = cart.items.reduce((acc: number, it: any) => acc + (it.product?.price || 0) * (it.quantity || 0), 0);
        }
      }
    } catch (e) {
      console.warn('Could not calculate subtotal on server', e);
    }

    return NextResponse.json({ shippingOptions: data, subtotal }, { status: res.status });
  } catch (err: any) {
    console.error('Error calling Melhor Envio', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
