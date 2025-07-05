import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { revalidateTag } from "next/cache";

const prisma = new PrismaClient();

export async function PATCH(request: Request) {

  try {
    const now = new Date();

    const expiredProducts = await prisma.product.findMany({
      where: {
        promotionDeadline: { lt: now },
        onSale: true,
      },
      select: { id: true, priceOld: true, price: true },
    });

    if (expiredProducts.length === 0) {
      return NextResponse.json(
        { message: "Nenhuma promoção expirada encontrada" },
        { status: 200 }
      );
    }

    for (const product of expiredProducts) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          price: product.priceOld ?? product.price,
          priceOld: null,
          promotionDeadline: null,
          onSale: false,
          updatedAt: new Date(),
        },
      });
    }

    revalidateTag("loadProduct");
  
    return NextResponse.json(
      { message: `Resetadas ${expiredProducts.length} promoções expiradas` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao resetar promoções:", error);
    return NextResponse.json(
      { error: "Erro interno ao resetar promoções" },
      { status: 500 }
    );
  }
}
