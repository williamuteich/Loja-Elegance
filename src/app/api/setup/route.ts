import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface dadosDataProps {
    id: string;
    name: string;
    value: string;
    url: string | null;
    type: string;
}

export async function GET(request: Request) {
    try {

        const config: dadosDataProps[] = await prisma.config.findMany();

        return NextResponse.json(config, { status: 200 });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
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
        console.log(err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
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
        console.log(err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
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
