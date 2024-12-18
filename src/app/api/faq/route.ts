import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    const faqs = await prisma.faq.findMany();
    return NextResponse.json(faqs);
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