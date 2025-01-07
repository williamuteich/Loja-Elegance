import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const search = url.searchParams.get('search');
        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!, 10) : 1;
        const pageSize = 10;

        const skip = (page - 1) * pageSize;

        const brands = await prisma.brand.findMany({
            skip,
            take: pageSize,
            where: search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } }
                    ]
                }
                : {},
        });

        const totalRecords = await prisma.brand.count({
            where: search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } }
                    ]
                }
                : {},
        });

        return NextResponse.json({ marcas: brands, totalRecords }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
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

        return NextResponse.json({ message: 'Brand created successfully', data: brand }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
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

        return NextResponse.json({ message: 'Brand updated successfully', data: brand }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        const brand = await prisma.brand.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Brand deleted successfully', data: brand }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 });
    }
}
