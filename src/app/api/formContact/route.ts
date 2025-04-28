import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from "@/utils/auth";

const prisma = new PrismaClient();

import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
        return new Response(JSON.stringify({ error: "Não autorizado" }), { status: 403 });
    }

    try {
        const url = new URL(request.url);
        const search = url.searchParams.get('search');
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const status = url.searchParams.get('status');
        const pageSize = 10;
        const id = url.searchParams.get('id');

        const skip = (page - 1) * pageSize;

        let formContacts;

        if (id) {
            formContacts = await prisma.formulario.findUnique({ where: { id } });
            if (!formContacts) {
                return NextResponse.json({ error: 'Formulário não encontrado' }, { status: 404 });
            }
        } else {
            const where: any = search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { assunto: { contains: search, mode: 'insensitive' } },
                        { mensagem: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {};

            if (status !== null) {
                where.respondido = status === "true";
            }
            formContacts = await prisma.formulario.findMany({
                skip,
                take: pageSize,
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    telefone: true,
                    assunto: true,
                    mensagem: true,
                    respondido: true,
                    resposta: true
                }
            });
        }

        const totalRecords = await prisma.formulario.count();

        return NextResponse.json({ formContacts, totalRecords }, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
    }
}

export async function POST(request: Request) {

    try {
        const body = await request.json()

        // Validação do reCAPTCHA
        const recaptchaToken = body.recaptchaToken;
        if (!recaptchaToken) {
            return NextResponse.json({ message: 'reCAPTCHA obrigatório' }, { status: 400 });
        }
        const recaptchaRes = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
            { method: 'POST' }
        );
        const recaptchaJson = await recaptchaRes.json();
        if (!recaptchaJson.success) {
            return NextResponse.json({ message: 'Falha no reCAPTCHA' }, { status: 400 });
        }

        if (!body.name || !body.email || !body.telefone || !body.assunto || !body.mensagem) {
            return NextResponse.json({ message: "name, email, assunto and messagem are required" }, { status: 400 })
        }

        const formContact = await prisma.formulario.create({
            data: {
                name: body.name,
                email: body.email,
                telefone: body.telefone,
                assunto: body.assunto,
                mensagem: body.mensagem,
                resposta: body.resposta || null,
                respondido: body.respondido || false
            }
        })

        return NextResponse.json({ message: "Created", formContact }, { status: 201 })
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
        const { id, resposta } = await request.json();
        const formContact = await prisma.formulario.update({
            where: { id },
            data: {
                respondido: true,
                resposta: resposta
            }
        })

        return NextResponse.json({ formContact }, { status: 200 });
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
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ error: 'ID obrigatório para deletar.' }, { status: 400 });
        }
        await prisma.formulario.delete({ where: { id } });
        return NextResponse.json({ message: 'Formulário deletado com sucesso.' }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}