import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from "@/utils/auth";

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

export async function POST(request: Request) {

    const authError = await requireAdmin(request);
    if (authError) {
        return authError;
    }

    try {
        const newConfig: dadosDataProps = await request.json();

        const createdConfig = await prisma.config.create({
            data: {
                name: newConfig.name,
                value: newConfig.value,
                url: newConfig.url || null,
                type: newConfig.type
            }
        });

        return NextResponse.json({ message: 'Created', createdConfig }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {

    const authError = await requireAdmin(request);
    if (authError) {
        return authError;
    }

    try {
        const { id, name, value, url, type } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Id not provided' }, { status: 400 });
        }

        const updatedConfig = await prisma.config.update({
            where: { id },
            data: {
                name,
                value,
                url: url || null,
                type
            }
        });

        return NextResponse.json({ message: 'Updated', updatedConfig }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {

    const authError = await requireAdmin(request);
    if (authError) {
        return authError;
    }

    try {
        const body = await request.json();

        const { id } = body;

        if (!id) {
            return NextResponse.json({ message: 'Id not provided' }, { status: 400 });
        }

        const deleteConfig = await prisma.config.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 400 });
    }
}
