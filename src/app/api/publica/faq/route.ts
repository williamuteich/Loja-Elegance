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
