import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function resetExpiredPromotions() {
  const now = new Date();

  const expiredProducts = await prisma.product.findMany({
    where: {
      promotionDeadline: { lt: now },
      onSale: true,
    },
    select: { id: true, priceOld: true, price: true },
  });

  if (expiredProducts.length === 0) {
    console.log("Nenhuma promoção expirada encontrada");
    return;
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

  console.log(`✅ Resetadas ${expiredProducts.length} promoções expiradas`);
  await prisma.$disconnect(); // boa prática em scripts
}
