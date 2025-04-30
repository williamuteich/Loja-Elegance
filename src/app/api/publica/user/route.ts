import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from "@/utils/auth";
import { generateToken } from "@/utils/generateToken";
import { SendEmail } from "@/infra/SendEmail";
import { VerifyEmail } from "@/emails/VerifyEmail";
import { render } from "@react-email/render";

const prisma = new PrismaClient();

export async function GET(request: Request) {

    const authError = await requireAdmin(request);
    if (authError) {
        return authError;
    }

    try {
        const url = new URL(request.url);
        const search = url.searchParams.get('search');
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const status = url.searchParams.get('status');
        const pageSize = 10;

        const skip = (page - 1) * pageSize;

        const where: any = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { role: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};

        if (status !== null) {
            where.active = status === "true";
        }

        const users = await prisma.user.findMany({
            skip,
            take: pageSize,
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                active: true
            }
        });

        const totalRecords = await prisma.user.count({
            where,
        });

        return NextResponse.json({ usuarios: users, totalRecords }, { status: 200 });
    } catch (err) {
        console.error("Erro no filtro de status", err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const saltRounds = 10;

        if (!body.name || !body.email || !body.password) {
            return new Response(JSON.stringify({ message: "Name, email and password are required" }), {
                status: 400,
            });
        }

        body.role = body.role || 'user';
        body.active = false; 
        body.telefone = body.telefone || null;

        const emailVerify = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        });

        if (emailVerify) {
            return new Response(JSON.stringify({ message: 'Email já em uso' }), { status: 400 });
        }

        if (body.password.length < 8) {
            return new Response(JSON.stringify({ message: 'Password must be at least 8 characters long' }), { status: 400 });
        }

        const hashPassword = await bcrypt.hash(body.password, saltRounds);

        const verificationToken = generateToken(32);
        const verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

        const newUser = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                role: body.role,
                password: hashPassword,
                active: false,
                telefone: body.telefone,
                verificationToken,
                verificationTokenExpires,
            }
        });

        const baseUrl = process.env.NEXTAUTH_URL;
        const verifyUrl = `${baseUrl}/verify-email?token=${verificationToken}`;

        const emailHtml = await render(VerifyEmail({ verifyUrl }));

        const emailService = new SendEmail();
        await emailService.sendEmail(
            newUser.email,
            "Confirme seu e-mail | Loja Elegance",
            emailHtml
        );

        return new Response(JSON.stringify({ message: 'User created successfully. Please verify your email.' }), { status: 201 });

    } catch (err) {
        console.error("Erro ao criar usuário:", err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        return new Response(JSON.stringify({ error: 'Internal server error', details: errorMessage }), { status: 500 });
    }
}
