import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import speakeasy from "speakeasy";  
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, totpCode } = body;

        if (!userId || !totpCode) {
            return NextResponse.json({ message: "User ID and TOTP code are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                totpSecret: true,
                role: true
            }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (!user.totpSecret) {
            return NextResponse.json({ message: "User does not have TOTP enabled" }, { status: 403 });
        }

        const verified = speakeasy.totp.verify({
            secret: user.totpSecret,
            encoding: "base32",
            token: totpCode
        });

        if (!verified) {
            return NextResponse.json({ message: "Invalid TOTP code" }, { status: 401 });
        }

        const token = `${user.id}-${user.email}-${Date.now()}`;
        (await cookies()).set("auth_token", token, {
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            secure: true
        });

        return NextResponse.json({
            message: "TOTP verified successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }, { status: 200 });

    } catch (err) {
        console.error("[VERIFY TOTP ERROR]", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
