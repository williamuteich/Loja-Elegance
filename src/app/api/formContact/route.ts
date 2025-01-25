import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const formContacts = await prisma.formulario.findMany();

        return NextResponse.json({ formContacts }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try{
        const body = await request.json()

        if(!body.name || !body.email || !body.telefone || !body.assunto || !body.mensagem) {
            return NextResponse.json({ message: "name, email, assunto and messagem are required" }, { status: 400 })
        }

        const formContact = await prisma.formulario.create({
            data: {
                name: body.name,
                email: body.email,
                telefone: body.telefone,
                assunto: body.assunto,
                mensagem: body.mensagem,
                respondido: body.respondido || false 
            }
        })

        return NextResponse.json({ message: "Created", formContact }, {  status: 201 })
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}