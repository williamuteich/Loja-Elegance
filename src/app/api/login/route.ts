import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json(); 

        console.log(body)

        const email = body.email;
        const password = body.password;

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        const userVerify = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                email: true,
                role: true,
                password: true
            }
        });

        if (!userVerify) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const matchPassword = await bcrypt.compare(password, userVerify.password);

        if (!matchPassword) {
            return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
        }

        return NextResponse.json({ message: 'User authenticated successfully' }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}


