import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.code || !body.total || !body.product_ids) {
            return new NextResponse(
                JSON.stringify({ message: 'Code, total, and product_ids are required' }),
                { status: 400 }
            );
        }

        const cupom = await prisma.cupom.findUnique({
            where: { code: body.code },
        });

        if (!cupom) {
            return new NextResponse(JSON.stringify({ message: 'Coupon not found' }), { status: 404 });
        }

        if (!cupom.active) {
            return new NextResponse(JSON.stringify({ message: 'This coupon is inactive' }), { status: 400 });
        }

        if (new Date(cupom.expires_at) < new Date()) {
            return new NextResponse(JSON.stringify({ message: 'This coupon has expired' }), { status: 400 });
        }

        if (body.total < cupom.min_purchase) {
            return new NextResponse(
                JSON.stringify({ message: `The minimum purchase for this coupon is R$${cupom.min_purchase}` }),
                { status: 400 }
            );
        }

        const produtoValido = body.product_ids.every((id: string) => cupom.category_ids.includes(id));
        if (!produtoValido) {
            return new NextResponse(JSON.stringify({ message: 'This coupon cannot be used for the selected products' }), { status: 400 });
        }

        return new NextResponse(JSON.stringify({ message: 'Coupon is valid!', coupon: cupom }), { status: 200 });
    } catch (err) {
        console.error("Error validating coupon:", err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        return new NextResponse(
            JSON.stringify({ error: 'Internal server error', details: errorMessage }),
            { status: 500 }
        );
    }
}
