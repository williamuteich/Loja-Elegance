import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "@/utils/auth";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: any) {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    try {
        const body = await request.json();
        const updatedOrder = await prisma.order.update({
            where: { id: params.id },
            data: { status: body.status },
        });
        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        return NextResponse.json(
            { message: "Erro ao atualizar status" },
            { status: 500 }
        );
    }
}