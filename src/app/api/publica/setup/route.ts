import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface dadosDataProps {
    id: string;
    name: string;
    value: string | null;
    url: string | null;
    type: string;
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const search = url.searchParams.get('search');
        const page = parseInt(url.searchParams.get('page') || '1');

        const pageSize = 10;

        const config: dadosDataProps[] = await prisma.config.findMany({
            where: search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { type: { contains: search, mode: 'insensitive' } }
                    ]
                }
                : {},
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        const totalRecords = await prisma.config.count({
            where: search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { type: { contains: search, mode: 'insensitive' } }
                    ]
                }
                : {},
        });

        return NextResponse.json({ config, totalRecords }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
