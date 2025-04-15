// app/api/order/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth as authOptions } from "@/lib/auth-config";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

interface OrderItemRequest {
  selectedVariantId: string;
  quantity: number;
  price: number;
}

interface OrderRequest {
  cart: OrderItemRequest[];
  pagamento: string;
  pagamentoDetalhado?: string;
  pickupLocation: {
    id: string;
  };
  finalCashInfo?: {
    cashInHand: string;
    change: number;
  };
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.userID) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const body: OrderRequest = await request.json();

    if (!body.cart || body.cart.length === 0) {
      return NextResponse.json(
        { message: "Carrinho vazio" },
        { status: 400 }
      );
    }

    const pickupLocation = await prisma.deliveryOption.findUnique({
      where: { id: body.pickupLocation.id },
    });
    if (!pickupLocation) {
      return NextResponse.json(
        { message: "Local de retirada inválido" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1) Verificar estoque e preparar items
      const itemsWithStock = await Promise.all(
        body.cart.map(async (item) => {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.selectedVariantId },
            include: { stock: true },
          });
          if (!variant) {
            throw new Error(`Variante ${item.selectedVariantId} não encontrada`);
          }
          // stock é um array: pegamos o primeiro registro
          const stockRecord = variant.stock[0];
          if (!stockRecord) {
            throw new Error(`Estoque não configurado para a variante ${item.selectedVariantId}`);
          }
          if (stockRecord.quantity < item.quantity) {
            throw new Error(
              `Estoque insuficiente para a variante ${item.selectedVariantId}`
            );
          }
          return {
            variantId: variant.id,
            quantity: item.quantity,
            price: item.price,
          };
        })
      );

      // 2) Criar o pedido com nested write de items
      const order = await tx.order.create({
        data: {
          userId: session.user.userID,
          total: itemsWithStock.reduce(
            (sum, i) => sum + i.price * i.quantity,
            0
          ),
          paymentMethod: body.pagamento,
          paymentDetail: body.pagamentoDetalhado || null,
          pickupLocationId: body.pickupLocation.id,
          status: "pending",
          items: {
            create: itemsWithStock.map((i) => ({
              variantId: i.variantId,
              quantity: i.quantity,
              price: i.price,
            })),
          },
        },
        include: {
          items: true,
          pickupLocation: true,
        },
      });

      // 3) Decrementar estoque para cada item
      await Promise.all(
        itemsWithStock.map((i) =>
          tx.stock.updateMany({
            where: { variantId: i.variantId },
            data: { quantity: { decrement: i.quantity } },
          })
        )
      );

      return order;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Erro no processamento do pedido:", error);

    const errMsg =
      error.message.startsWith("Variante") ||
      error.message.startsWith("Estoque")
        ? error.message
        : "Erro interno no servidor";

    return NextResponse.json(
      {
        message: "Falha ao processar pedido",
        error: errMsg,
      },
      { status: 500 }
    );
  }
}
