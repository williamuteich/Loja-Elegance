import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const brands = await prisma.brand.findMany();
        
        return NextResponse.json({ message: 'Brands fetched successfully', data: brands });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const brand = await prisma.brand.create({
            data: {
                name: body.name,
                description: body.description,
                logo: body.logo,
            },
        });

        return NextResponse.json({ message: 'Brand created successfully', data: brand });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        const brand = await prisma.brand.update({
            where: { id: body.id },
            data: {
                name: body.name,
                description: body.description,
                logo: body.logo,
            },
        });

        return NextResponse.json({ message: 'Brand updated successfully', data: brand });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        const brand = await prisma.brand.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Brand deleted successfully', data: brand });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}