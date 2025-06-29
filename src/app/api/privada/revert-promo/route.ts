import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "@/utils/auth";

const prisma = new PrismaClient();

interface RevertPromoBody {
  produtoId: string;
}

export async function PATCH(request: Request) {
  // Autorização
  const authError = await requireAdmin(request);
  if (authError) {
    return authError;
  }

  try {
    const { produtoId } = (await request.json()) as RevertPromoBody;

    // Busca o produto atual
    const produto = await prisma.product.findUnique({
      where: { id: produtoId },
    });

    if (!produto) {
      return NextResponse.json(
        { error: `Produto ${produtoId} não encontrado` },
        { status: 404 }
      );
    }

    // Restaura priceOld para price, desliga a promoção e limpa os campos
    await prisma.product.update({
      where: { id: produtoId },
      data: {
        price: produto.priceOld ?? produto.price,
        onSale: false,
        priceOld: null,
        promotionDeadline: null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Promoção revertida com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao reverter promoção:", error);
    return NextResponse.json(
      { error: "Falha interna ao reverter promoção" },
      { status: 500 }
    );
  }
}
