import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';
import { requireAdmin } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const search = url.searchParams.get('search');
        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!, 10) : 1;
        const pageSize = 10;
        const fetchAll = url.searchParams.get("fetchAll") === "true";

        const where: Prisma.BrandWhereInput = search
            ? {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive' as Prisma.QueryMode
                        }
                    },
                    {
                        description: {
                            contains: search,
                            mode: 'insensitive' as Prisma.QueryMode
                        }
                    }
                ]
            }
            : {};

        let brands;

        if (fetchAll) {
            brands = await prisma.brand.findMany({
                where,
                orderBy: { createdAt: 'desc' }
            });
        } else {
            const skip = (page - 1) * pageSize;
            brands = await prisma.brand.findMany({
                where,
                skip,
                take: pageSize,
            });
        }

        const totalRecords = await prisma.brand.count({ where });

        return NextResponse.json({
            marcas: brands,
            totalRecords: fetchAll ? brands.length : totalRecords
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
    }
}

export async function POST(request: Request) {

    const authError = await requireAdmin(request);
    if (authError) {
        return authError;
    }

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

    const authError = await requireAdmin(request);
    if (authError) {
        return authError;
    }

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

    const authError = await requireAdmin(request);
    if (authError) {
        return authError;
    }

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
