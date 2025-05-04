import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const search = url.searchParams.get('search');
        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!, 10) : 1;
        const pageSize = 10;

        const where: Prisma.InstaEmbedWhereInput = search
            ? {
                OR: [
                    {
                        title: {
                            contains: search,
                            mode: 'insensitive' as Prisma.QueryMode
                        }
                    },
                    {
                        link: {
                            contains: search,
                            mode: 'insensitive' as Prisma.QueryMode
                        }
                    }
                ]
            }
            : {};

        const skip = (page - 1) * pageSize;
        const insta = await prisma.instaEmbed.findMany({
            where,
            skip,
            take: pageSize,
        });

        const totalRecords = await prisma.instaEmbed.count({ where });

        return NextResponse.json({
            posts: insta,
            totalRecords
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}
