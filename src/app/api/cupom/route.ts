import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const search = url.searchParams.get('search');
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const status = url.searchParams.get('status');
        const pageSize = 10;

        const skip = (page - 1) * pageSize;
        console.log("recebendo search", search)
        const where: any = search
            ? {
                OR: [
                    { code: { contains: search, mode: 'insensitive' } }
                ],
            }
            : {};

        if (status !== null) {
            where.active = status === "true";
        }

        const cupons = await prisma.cupom.findMany({
            skip,
            take: pageSize,
            where,
            select: {
                id: true,
                code: true,
                type: true,
                value: true,
                min_purchase: true,
                active: true,
                expires_at: true,
                category_ids: true
            }
        });

        const totalRecords = await prisma.cupom.count({
            where,
        });

        return NextResponse.json({ cupons, totalRecords }, { status: 200 });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: "An error occurred." }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("recebendo os dados", body);

        if (!body.code || !body.type || !body.value || !body.min_purchase || !body.expires_at || !body.category_ids) {
            return new NextResponse(
                JSON.stringify({ message: 'Code, type, value, min_purchase, expires_at, and category_ids are required' }),
                { status: 400 }
            );
        }

        const existingCoupon = await prisma.cupom.findUnique({
            where: { code: body.code },
        });

        if (existingCoupon) {
            return new NextResponse(JSON.stringify({ message: 'Coupon code already in use' }), { status: 400 });
        }

        const cleanAndConvertToFloat = (value: string): number => {
            const cleanedValue = value.replace("R$", "").replace(",", ".");
            return parseFloat(cleanedValue);
        };

        const value = cleanAndConvertToFloat(body.value);
        const min_purchase = cleanAndConvertToFloat(body.min_purchase);

        if (isNaN(value) || isNaN(min_purchase)) {
            return new NextResponse(
                JSON.stringify({ message: 'Value and Min Purchase must be valid numbers' }),
                { status: 400 }
            );
        }

        const expires_at = new Date(body.expires_at);
        if (isNaN(expires_at.getTime())) {
            return new NextResponse(
                JSON.stringify({ message: 'Expires_at must be a valid date' }),
                { status: 400 }
            );
        }

        const active = body.active === 'true';

        const newCupom = await prisma.cupom.create({
            data: {
                code: body.code,
                type: body.type,
                value: value,
                min_purchase: min_purchase,
                expires_at: expires_at,
                active: active,
                category_ids: body.category_ids.map((id: number) => id.toString()), 
            },
        });

        return new NextResponse(
            JSON.stringify({ message: 'Coupon created successfully', coupon: newCupom }),
            { status: 201 }
        );
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "An error occurred." }, { status: 500 });
    }
}


export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
       
        if (!id) {
            return new NextResponse(JSON.stringify({ message: 'ID is required' }), { status: 400 });
        }

        const cupom = await prisma.cupom.delete({
            where: { id },
        });

        return new NextResponse(
            JSON.stringify({ message: 'Coupon deleted successfully', cupom }),
            { status: 200 }
        );
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: "An error occurred." }, { status: 500 });
    }
}
