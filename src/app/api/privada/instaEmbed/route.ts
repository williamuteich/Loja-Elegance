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

export async function POST(request: Request) {

    const authError = await requireAdmin(request);
    if (authError) {
        return authError;
    }

    try {
        const body = await request.json();

        const instaEmbed = await prisma.instaEmbed.create({
            data: {
                title: body.title,
                link: body.link,
            },
        });

        return NextResponse.json({ message: 'Link created successfully', data: instaEmbed }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create Link' }, { status: 500 });
    }
}

export async function PUT(request: Request) {

    const authError = await requireAdmin(request);
    if (authError) {
        return authError;
    }

    try {
        const body = await request.json();

        const insta = await prisma.instaEmbed.update({
            where: { id: body.id },
            data: {
                title: body.title,
                link: body.link,
            },
        });

        return NextResponse.json({ message: 'Link updated successfully', data: insta }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update Link' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {

    const authError = await requireAdmin(request);
    if (authError) {
        return authError;
    }

    try {
        const { id } = await request.json();

        const insta = await prisma.instaEmbed.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Link deleted successfully', data: insta }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete Link' }, { status: 500 });
    }
}
