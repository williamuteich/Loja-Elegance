import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    if (!token) {
        return NextResponse.json({ success: false, message: "Token não informado." }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
        where: {
            verificationToken: token,
            verificationTokenExpires: { gte: new Date() },
        },
    });

    if (!user) {
        return NextResponse.json({ success: false, message: "Token inválido ou expirado." }, { status: 400 });
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            active: true,
            verificationToken: null,
            verificationTokenExpires: null,
        },
    });

    return NextResponse.json({ success: true, message: "Conta verificada com sucesso!" }, { status: 200 });
}
