import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.name || !body.email || !body.password) {
            return NextResponse.json({ error: 'name, email, and password are required' }, { status: 400 });
        }

        const newUser = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password,
                role: body.role? body.role : 'colaborador'
            }
        });

        return NextResponse.json(newUser, { status: 201 });

    } catch (err) {
        if (err instanceof Error) {
            console.log("Mensagem de erro: ", err.message);
        } else {
            console.log("Erro desconhecido: ", err);
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
