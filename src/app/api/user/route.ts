import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                password: false,
                role: true,
            }
        });

        return NextResponse.json({ message: 'Users fetched successfully', data: users }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const saltRounds = 10;

        if (!body.name || !body.email  || !body.password) {
            return new Response("Name, email and password are required", {
                status: 400,
            });
        }

        const emailVerify = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        })

        if (emailVerify) {
            return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
        }

        if (body.password.length < 8) {
            return NextResponse.json({ message: 'Password must be at least 8 characters long' }, { status: 400 });
        }

        const hashPassword = await bcrypt.hash(body.password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                role: body.role,
                password: hashPassword,
            }
        })

        return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { id, name, email, role, password } = await request.json();
        const saltRounds = 10;

        if (!id || !name || !email || !role || !password) {
            return NextResponse.json({ message: 'ID, name, email, role and password are required' }, { status: 400 });
        }

        const hashPassword = await bcrypt.hash(password, saltRounds);

        const user = await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                role,
                password: hashPassword
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