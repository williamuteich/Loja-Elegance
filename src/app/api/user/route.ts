import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
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

        body.role = body.role || '';
        body.active = body.active === 'true' ? true : false;

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

        const newUser = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                role: body.role,
                password: hashPassword,
                active: body.active
            }
        });
        
        return new Response(JSON.stringify({ message: 'User created successfully' }), { status: 201 });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { id, name, email, role, password, active } = await request.json();
        const saltRounds = 10;

        if (!id || !name || !email || !role || !password || active === undefined) {
            return NextResponse.json({ message: 'ID, name, email, role and password are required' }, { status: 400 });
        }

        const updatedActive = active === "true" ? true : false;

        const hashPassword = await bcrypt.hash(password, saltRounds);

        const user = await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                role,
                password: hashPassword,
                active: updatedActive
            }
        });

        return NextResponse.json({ message: 'User updated successfully', user }, { status: 200 });
    } catch (err) {
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

        await prisma.user.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}