import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const status = searchParams.get('status');
    const paymentId = searchParams.get('payment_id');
    const preferenceId = searchParams.get('preference_id');
    const externalReference = searchParams.get('external_reference'); 
    const merchantOrderId = searchParams.get('merchant_order_id');
    const collectionStatus = searchParams.get('collection_status');

    if (!paymentId || !preferenceId || !externalReference) {
      return NextResponse.json(
        { error: "Parâmetros inválidos" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        preferenceId: preferenceId,
        userId: externalReference
      },
      include: {
        items: {
          select: {
            name: true,
            quantity: true,
            unitPrice: true,
            imageUrl: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    if (order.returnViewed) {
      return NextResponse.json(
        { 
          error: "Página já visualizada",
          message: "Este pagamento já foi confirmado anteriormente.",
          canView: false
        },
        { status: 403 }
      );
    }

    let statusInfo = {
      kind: "pending" as "success" | "pending" | "failure",
      title: "Pagamento Pendente",
      desc: "Seu pagamento está sendo processado.",
      badge: {
        icon: "⏳",
        label: "Processando"
      }
    };

    if (status === "success" || collectionStatus === "approved") {
      statusInfo = {
        kind: "success",
        title: "Pagamento Aprovado!",
        desc: "Seu pedido foi confirmado e será processado em breve.",
        badge: {
          icon: "✅",
          label: "Aprovado"
        }
      };
    } else if (status === "failure" || collectionStatus === "cancelled") {
      statusInfo = {
        kind: "failure",
        title: "Pagamento Recusado",
        desc: "Houve um problema com seu pagamento. Tente novamente.",
        badge: {
          icon: "❌",
          label: "Recusado"
        }
      };
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { returnViewed: true }
    });

    return NextResponse.json({
      canView: true,
      statusInfo,
      order: {
        id: order.id,
        total: order.total,
        subtotal: order.subtotal,
        shippingPrice: order.shippingPrice,
        items: order.items
      },
      transactionDetails: {
        paymentId,
        preferenceId,
        merchantOrderId,
        status: collectionStatus || status
      }
    });

  } catch (error) {
    console.error("Erro ao validar retorno:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}