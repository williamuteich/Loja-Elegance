import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth as authOptions } from "@/lib/auth-config";
import { getServerSession } from "next-auth";
import { ObjectId } from 'mongodb';

const prisma = new PrismaClient();

async function sendTelegramNotification(order: any) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      console.error("Telegram Bot Token ou Chat ID não configurados.");
      return;
    }

    const userName = order.user?.name || order.user?.username || order.user?.email || order.userId;
    const totalFormatted = `$ ${Number(order.total).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const localRetirada = order.pickupLocation?.title || order.pickupLocation?.name || order.pickupLocation?.description || 'N/A';

    const itensMsg = order.items.map((item: any) => {
      const nomeProduto = item.product?.name || 'Produto';
      const cor = item.productVariant?.color?.name ? `\n  🎨 Cor: ${item.productVariant.color.name}` : '';
      const precoUnit = Number(item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const totalItem = Number(item.total).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return `🍥 *${nomeProduto}*${cor}\n  🔢 Quantidade: ${item.quantity}\n  💸 Unitário: $ ${precoUnit}\n  💰 Total: $ ${totalItem}`;
    }).join("\n\n");

    const message = `🛒 *Novo Pedido Recebido!*
  👤 *Cliente*: ${userName}
  💵 *Total*: ${totalFormatted}
  💳 *Pagamento*: ${order.paymentMethod}${order.paymentDetail ? ` (${order.paymentDetail})` : ""}
  🏪 *Retirada*: ${localRetirada}
  📦 *Status*: ${order.status}

  *Itens do pedido:*
    ${itensMsg}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });
    const telegramResult = await response.json();
   
    if (!response.ok) {
      console.error("Erro ao enviar mensagem para o Telegram:", telegramResult);
    }
  } catch (err) {
    console.error("Falha ao notificar no Telegram:", err);
  }
}

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

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.userID || session.user?.role !== "admin") {
    return NextResponse.json(
      { message: "Usuário não autenticado ou sem permissão" },
      { status: 403 }
    );
  }

  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const status = url.searchParams.get('status');
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    let where: any = {};

    if (search) {
      const orFilters = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { telefone: { contains: search, mode: 'insensitive' } } }
      ];

      if (ObjectId.isValid(search) && new ObjectId(search).toString() === search) {
        where.id = search;
      } else {
        where.OR = orFilters;
      }
    }

    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      skip,
      take: pageSize,
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        items: {
          include: {
            product: true,
            productVariant: {
              include: { color: true }
            }
          }
        },
        pickupLocation: true,
      },
    });

    const totalRecords = await prisma.order.count({ where });

    return NextResponse.json({
      orders: orders.map(order => ({ ...order, total: Number(order.total) })),
      totalRecords
    }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json(
      { message: "Erro ao buscar pedidos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.userID || session.user?.role !== "user") {
      return NextResponse.json(
        { message: "Usuário não autenticado ou sem permissão:" },
        { status: 401 }
      );
    }

    const body: OrderRequest = await request.json();

    if (!body.cart || body.cart.length === 0) {
      return NextResponse.json(
        { message: "Carrito vacío" },
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
      const itemsWithStock = await Promise.all(
        body.cart.map(async (item) => {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.selectedVariantId },
            include: { stock: true, product: true },
          });

          if (!variant) {
            throw new Error(`Variante ${item.selectedVariantId} não encontrada`);
          }

          const stockRecord = variant.stock;
          if (!stockRecord) {
            throw new Error(
              `Estoque não configurado para a variante ${item.selectedVariantId}`
            );
          }

          if (stockRecord.quantity < item.quantity) {
            throw new Error(
              `Estoque insuficiente para a variante ${item.selectedVariantId}`
            );
          }

          return {
            variantId: variant.id,
            productId: variant.product.id,
            quantity: item.quantity,
            price: item.price,
          };
        })
      );

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
              productVariantId: i.variantId,
              productId: i.productId,
              quantity: i.quantity,
              price: i.price,
              total: i.price * i.quantity,
            })),
          },
        },
        include: {
          user: true,
          items: {
            include: {
              product: true,
              productVariant: { include: { color: true } },
            },
          },
          pickupLocation: true,
        },
      });

      await Promise.all(
        itemsWithStock.map((i) =>
          tx.stock.update({
            where: { variantId: i.variantId },
            data: { quantity: { decrement: i.quantity } },
          })
        )
      );

      return order;
    });

    await sendTelegramNotification(result);

    return NextResponse.json(
      { message: "Pedido realizado com sucesso. Está em análise.", order: result },
      { status: 201 }
    );
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
