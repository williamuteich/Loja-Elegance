import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: reservationId } = await params;

    if (!reservationId) {
      return NextResponse.json(
        { valid: false, reason: "ID da reserva não fornecido" },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        product: {
          include: { stock: true }
        }
      }
    });

    if (!reservation) {
      return NextResponse.json(
        { valid: false, reason: "Reserva não encontrada" },
        { status: 200 }
      );
    }

    const isValid = reservation.expiresAt > new Date();

    return NextResponse.json({ 
      valid: isValid,
      expiresAt: reservation.expiresAt
    });

  } catch (err) {
    console.error("Erro na validação:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
