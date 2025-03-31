import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const client = new MercadoPagoConfig({
            accessToken: process.env.NEXT_TOKEN_MERCADO_PAGO,
        });
    
        const payment = new Payment(client);
    
        payment.get({
            id: '1322835558',
        }).then(console.log).catch(console.log);
    
        NextResponse.json({ message: "Payment details retrieved successfully", payment });
    } catch (error) {
        console.error("Error retrieving payment details:", error);
        return NextResponse.json({ error: "Error retrieving payment details" }, { status: 500 });
    }
}