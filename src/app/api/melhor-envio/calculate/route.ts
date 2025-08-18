import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { products, to_postal_code } = body;

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
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error('Error calling Melhor Envio', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
