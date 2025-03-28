import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(request: Request) {
  try {
    const client = new MercadoPagoConfig({
      accessToken: 'TEST-5124500625791001-022117-4cb7e8408f99b562bb7f68cc6490e3ba-311762271',
    });

    const preference = new Preference(client);

    const body = {
      items: [
        {
          id: '1234',
          title: 'Example Product',
          description: 'This is a sample product',
          picture_url: 'https://example.com/product-image.jpg',
          category_id: 'electronics',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 100.0
        }
      ],
      payer: {
        email: 'user@example.com',
      },
      back_urls: {
        success: 'https://example.com/success',
        failure: 'https://example.com/failure',
        pending: 'https://example.com/pending',
      },
      auto_return: 'all',
      notification_url: 'https://example.com/notification',
    };

    const response = await preference.create({ body });

    // Retorno da resposta de forma simplificada
    return new NextResponse(JSON.stringify(response), { status: 200 });

  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error }), { status: 500 });
  }
}
