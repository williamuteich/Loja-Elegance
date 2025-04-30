import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        const banners = id
            ? await prisma.banner.findUnique({ where: { id } })
            : await prisma.banner.findMany();

        if (id && !banners) {
            return NextResponse.json({ error: 'Banner não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ banners }, { status: 200 });
    } catch (err) {
        console.error("Erro ao buscar banners:", err);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}
