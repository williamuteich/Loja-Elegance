import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { productId, quantity, sessionId } = await request.json();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.reservation.findFirst({
        where: {
          productId,
          sessionId,
          expiresAt: { gt: new Date() }
        }
      });

      const newQty = (existing?.quantity || 0) + quantity;

      if (newQty <= 0) {
        if (existing) {
          await tx.reservation.delete({ where: { id: existing.id } });
        }
        return { action: 'delete', data: null };
      }

      if (quantity > 0) {
        const product = await tx.product.findUnique({
          where: { id: productId },
          include: {
            stock: true,
            reservations: {
              where: {
                expiresAt: { gt: new Date() },
                NOT: { id: existing?.id }
              }
            }
          }
        });

        const totalReserved = product?.reservations.reduce((sum, r) => sum + r.quantity, 0) || 0;
        const available = (product?.stock?.quantity || 0) - totalReserved;

        if (available < newQty) {
          throw new Error("Não há mais quantidade de estoque disponível");
        }
      }

      const operation = existing 
        ? tx.reservation.update({
            where: { id: existing.id },
            data: {
              quantity: newQty,
              expiresAt: new Date(Date.now() + 10 * 60 * 1000)
            }
          })
        : tx.reservation.create({
            data: {
              productId,
              quantity: newQty,
              sessionId,
              expiresAt: new Date(Date.now() + 10 * 60 * 1000)
            }
          });

      return { action: 'update', data: await operation };
    });

    return result.action === 'delete' 
      ? new NextResponse(null, { status: 204 })
      : NextResponse.json(result.data);

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro desconhecido" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  const { reservationId } = await request.json();

  try {
    await prisma.reservation.delete({ where: { id: reservationId } });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro desconhecido" },
      { status: 400 }
    );
  }
}