import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';

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