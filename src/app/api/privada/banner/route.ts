import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from "@/utils/auth";

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

export async function POST(request: Request) {

    const authError = await requireAdmin(request);
    if (authError) {
        return authError;
    }

    try {
        const body = await request.json();

        if (!Array.isArray(body)) {
            return NextResponse.json({ message: "Expected an array of banners" }, { status: 400 });
        }

        for (const banner of body) {
            if (!banner.imageUrl || banner.alt === undefined) {
                return NextResponse.json({ message: "Image URL and alt are required for each banner" }, { status: 400 });
            }
        }

        const newBanners = await prisma.banner.createMany({
            data: body.map((banner) => ({
                imageUrl: banner.imageUrl,
                active: banner.active !== undefined ? banner.active : true,
                link: banner.link || null,
                alt: banner.alt || null,
            })),
        });

        return NextResponse.json({ message: 'Banners created successfully', banners: newBanners }, { status: 201 });
    } catch (err) {
        console.error("Erro ao criar banners:", err);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}

export async function PUT(request: Request) {

    const authError = await requireAdmin(request);
    if (authError) {
        return authError;
    }

    try {
        const { id, imageUrl, alt, active, link } = await request.json();

        if (!id || !imageUrl || alt === undefined) {
            return NextResponse.json({ message: "ID, Image URL, and alt are required" }, { status: 400 });
        }

        const updatedBanner = await prisma.banner.update({
            where: { id },
            data: {
                imageUrl,
                alt,
                active: active !== undefined ? active : true,
                link: link || null,
            },
        });

        return NextResponse.json({ message: 'Banner updated successfully', banner: updatedBanner }, { status: 200 });
    } catch (err) {
        console.error("Erro ao editar banner:", err);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {

    const authError = await requireAdmin(request);
    if (authError) {
        return authError;
    }
    
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ message: "ID is required to delete a banner" }, { status: 400 });
        }

        const deletedBanner = await prisma.banner.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Banner deleted successfully', banner: deletedBanner }, { status: 200 });
    } catch (err) {
        console.error("Erro ao deletar banner:", err);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}
