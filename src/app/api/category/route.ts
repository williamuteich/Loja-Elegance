import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const category = await prisma.category.findMany();
        return NextResponse.json(category, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const category = await prisma.category.create({
            data: {
                name: body.name,
                description: body.description
            }
        });

        return NextResponse.json({ message: 'Category created successfully', data: category }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        const category = await prisma.category.update({
            where: { id: body.id },
            data: {
                name: body.name,
                description: body.description
            }
        });
    
        return NextResponse.json({ message: 'Category updated successfully', data: category }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        const category = await prisma.category.delete({
            where: { id }
        })
    
        return NextResponse.json({ message: 'Category deleted successfully', data: category }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
