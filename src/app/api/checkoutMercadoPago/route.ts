import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json(); 

    const client = new MercadoPagoConfig({
      accessToken: process.env.NEXT_TOKEN_MERCADO_PAGO,
    });

    const preference = new Preference(client);

    interface Item {
      unit_price: number;
      quantity: number;
    }

    const total = data.items.reduce((acc: number, item: Item) => {
      return acc + (item.unit_price * item.quantity); 
    }, 0);

    const order = await prisma.orders.create({
      data: {
        userId: data.items[0].userID, 
        total: total,
        status: "pending",
        items: {
          create: data.items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.unit_price,
            total: item.unit_price * item.quantity,
          })),
        },
      },
    });

    const externalReference = uuidv4();

    const body = {
      items: data.items.map((item: any) => ({
        id: item.id,  
        title: item.title,  
        description: item.description,  
        picture_url: item.picture_url,  
        category_id: item.category_id,  
        quantity: item.quantity,  
        currency_id: 'ARG',
        unit_price: item.unit_price,  
      })),
      payer: {
        email: data.payer.email,
        identification: {
          type: 'CI',  
          number: data.payer.identification_number,  
        },
      },
      back_urls: {
        success: 'https://example.com/success',  
        failure: 'https://example.com/failure',  
        pending: 'https://example.com/pending',  
      },
      auto_return: 'all', 
      notification_url: 'https://example.com/notification', 
      external_reference: externalReference, 
    };

    const response = await preference.create({ body });

    console.log("FIM >>>>", response);

    return new NextResponse(JSON.stringify(response), { status: 200 });

  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return new NextResponse(JSON.stringify({ error: error }), { status: 500 });
  }
}
