import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.userID) {
        return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where: { id: session.user.userID },
        select: { id: true, email: true, name: true, role: true, totpSecret: true }
    });
    if (!user) {
        return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
    }
    return NextResponse.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        has2FA: !!user.totpSecret
    });
}
