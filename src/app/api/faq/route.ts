import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface dadosDataProps {
    id: string;
    question: string;
    response: string;
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const search = url.searchParams.get('search');
        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!, 10) : 1;
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        console.log("Buscando FAQs:", { search, page, skip });

        const faqs = await prisma.faq.findMany({
            skip,
            take: pageSize,
            where: search
                ? {
                    OR: [
                        { question: { contains: search, mode: 'insensitive' } },
                        { response: { contains: search, mode: 'insensitive' } }
                    ]
                }
                : {},
        });

        const totalRecords = await prisma.faq.count({
            where: search
                ? {
                    OR: [
                        { question: { contains: search, mode: 'insensitive' } },
                        { response: { contains: search, mode: 'insensitive' } }
                    ]
                }
                : {},
        });
        

        return NextResponse.json({ faq: faqs, totalRecords }, { status: 200 });
    } catch (err) {
        console.error("Erro ao buscar FAQs:", err);
        return NextResponse.json({ message: "An error occurred." }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.question || !body.response) {
            return NextResponse.json({ message: "Question and answer are required." });
        }

        await prisma.faq.create({
            data: {
                question: body.question,
                response: body.response
            }
        });

        return NextResponse.json({ message: "FAQ created successfully." }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: "An error occurred." }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        if (!body.id) {
            return NextResponse.json({ message: "FAQ ID is required." });
        }

        if (!body.question || !body.response) {
            return NextResponse.json({ message: "Question and answer are required." });
        }

        await prisma.faq.update({
            where: {
                id: body.id
            },
            data: {
                question: body.question,
                response: body.response
            }
        });

        return NextResponse.json({ MESSAGE: "FAQ updated successfully." }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: "An error occurred." }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {

        const body = await request.json();

        if (!body.id) {
            return NextResponse.json({ message: "FAQ ID is required." });
        }

        await prisma.faq.delete({
            where: {
                id: body.id
            }
        })

        return NextResponse.json({ message: "FAQ deleted successfully." }, { status: 201 });

    } catch (err) {
        return NextResponse.json({ message: "An error occurred." }, { status: 500 });
    }
}