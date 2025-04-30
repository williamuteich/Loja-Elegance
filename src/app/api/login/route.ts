import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const email = body.email;
        const password = body.password;

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                password: true,
                active: true
            }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const matchPassword = await bcrypt.compare(password, user.password);

        if (!matchPassword) {
            return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
        }

        if (user.active === false) {
            return NextResponse.json({ message: "Necessária Validação de Email", active: user.active }, { status: 401 });
        }


        const token = `${user.id}-${user.email}-${Date.now()}`;


        (await

            cookies()).set('auth_token', token, {
                httpOnly: true,
                path: '/',
                sameSite: 'lax',
                secure: true
            });

        return NextResponse.json({
            message: 'User authenticated successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                active: user.active
            }
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
