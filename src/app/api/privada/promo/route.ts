import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "@/utils/auth";
import { DateTime } from "luxon"; // Luxon para timezone

const prisma = new PrismaClient();

interface ProdutoPromo {
  produto: { id: string };
  precoPromo: string;
  promotionDeadline: string; // Ex: "2025-06-30T23:59"
}

// 🔁 Função para resetar promoções expiradas
async function resetExpiredPromotions() {
  const now = new Date();

  const expiredProducts = await prisma.product.findMany({
    where: {
      promotionDeadline: { lt: now },
      onSale: true,
    },
  });

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
}

// ✅ Atualiza promoções via PATCH
export async function PATCH(request: Request) {
  const authError = await requireAdmin(request);
  if (authError) {
    return authError;
  }

  try {
    const body = (await request.json()) as { produtos: ProdutoPromo[] };

    for (const item of body.produtos) {
      const promocional = parseFloat(item.precoPromo);

      // Busca o produto atual
      const produtoAtual = await prisma.product.findUnique({
        where: { id: item.produto.id },
      });

      if (!produtoAtual) {
        console.warn(`Produto com id ${item.produto.id} não encontrado.`);
        continue;
      }

      // 🕓 Converte a deadline da hora brasileira para UTC
      const deadlineUTC = DateTime.fromISO(item.promotionDeadline, {
        zone: "America/Sao_Paulo",
      }).toUTC().toJSDate(); // Converte para objeto Date

      await prisma.product.update({
        where: { id: item.produto.id },
        data: {
          priceOld: produtoAtual.priceOld ?? produtoAtual.price,
          price: promocional,
          promotionDeadline: deadlineUTC,
          onSale: true,
          updatedAt: new Date(),
        },
      });

      console.log(`Produto ${item.produto.id} atualizado para promoção: R$${promocional}, deadline UTC: ${deadlineUTC.toISOString()}`);
    }

    return NextResponse.json(
      { message: "Promoção atualizada nos produtos selecionados" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro na criação:", error);
    return NextResponse.json(
      { error: "Erro ao tentar adicionar promoção" },
      { status: 500 }
    );
  }
}

export { resetExpiredPromotions };
