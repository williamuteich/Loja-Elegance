import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Configurar cliente MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.NEXT_ACCESS_TOKEN!,
  options: { timeout: 5000 }
});

const paymentClient = new Payment(client);

async function sendTelegramNotification(order: any) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      console.error("Telegram Bot Token ou Chat ID não configurados.");
      return;
    }

    const userName = order.user?.name || order.user?.email || order.userId;
    const totalFormatted = `R$ ${Number(order.total).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const itensMsg = order.items.map((item: any) => {
      const nomeProduto = item.product?.name || 'Produto';
      const cor = item.productVariant?.color?.name ? `\n  🎨 Cor: ${item.productVariant.color.name}` : '';
      const precoUnit = Number(item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const totalItem = Number(item.total).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return `🛒 *${nomeProduto}*${cor}\n  🔢 Quantidade: ${item.quantity}\n  💸 Unitário: R$ ${precoUnit}\n  💰 Total: R$ ${totalItem}`;
    }).join("\n\n");

    const message = `🎉 *PAGAMENTO APROVADO!*
👤 *Cliente*: ${userName}
💵 *Total*: ${totalFormatted}
💳 *Pagamento*: MercadoPago
📦 *Status*: Pago - Processando

*Itens do pedido:*
${itensMsg}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });
  } catch (err) {
    console.error("Falha ao notificar no Telegram:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Webhook MercadoPago recebido');
    
    const body = await request.json();
    console.log('📦 Dados do webhook:', JSON.stringify(body, null, 2));

    // Verificar se é uma notificação de pagamento
    if (body.type !== 'payment') {
      console.log('⚠️ Tipo de notificação ignorado:', body.type);
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      console.log('❌ ID do pagamento não encontrado');
      return NextResponse.json({ error: 'Payment ID not found' }, { status: 400 });
    }

    // Buscar detalhes do pagamento no MercadoPago
    console.log('🔍 Buscando pagamento:', paymentId);
    const paymentData = await paymentClient.get({ id: paymentId });
    
    console.log('💳 Status do pagamento:', paymentData.status);
    console.log('🆔 Referência externa:', paymentData.external_reference);

    // Apenas processar pagamentos aprovados
    if (paymentData.status !== 'approved') {
      console.log('⏳ Pagamento ainda não aprovado, status:', paymentData.status);
      return NextResponse.json({ received: true });
    }

    const cartId = paymentData.external_reference;
    if (!cartId) {
      console.log('❌ Referência externa (cartId) não encontrada');
      return NextResponse.json({ error: 'Cart reference not found' }, { status: 400 });
    }

    // Verificar se o pedido já foi criado para evitar duplicação
    const existingOrder = await prisma.order.findFirst({
      where: { 
        OR: [
          { mercadoPagoId: paymentData.id?.toString() },
          { externalReference: cartId }
        ]
      }
    });

    if (existingOrder) {
      console.log('⚠️ Pedido já existe para este pagamento:', existingOrder.id);
      return NextResponse.json({ received: true, orderId: existingOrder.id });
    }

    // Buscar carrinho com itens
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              }
            },
            productVariant: {
              include: {
                color: true,
                stock: true
              }
            }
          }
        },
        user: true
      }
    });

    if (!cart || !cart.user) {
      console.log('❌ Carrinho ou usuário não encontrado:', cartId);
      return NextResponse.json({ error: 'Cart or user not found' }, { status: 404 });
    }

    console.log('🛒 Carrinho encontrado com', cart.items.length, 'itens');

    // Criar pedido em transação
    const order = await prisma.$transaction(async (tx) => {
      // Buscar uma opção de entrega padrão
      const defaultDelivery = await tx.deliveryOption.findFirst({
        where: { category: 'Retiro en tienda' }
      });
      
      if (!defaultDelivery) {
        throw new Error('Nenhuma opção de entrega configurada');
      }

      // Verificar estoque e preparar itens
      const orderItems = [];
      for (const item of cart.items) {
        const stock = item.productVariant?.stock;
        if (stock && stock.quantity < item.quantity) {
          throw new Error(`Estoque insuficiente para ${item.product.name}`);
        }
        
        orderItems.push({
          productId: item.product.id,
          productVariantId: item.productVariant?.id,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity
        });

        // Atualizar estoque se necessário
        if (stock) {
          await tx.stock.update({
            where: { id: stock.id },
            data: { quantity: { decrement: item.quantity } }
          });
        }
      }

      // Calcular total
      const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0);

      // Criar pedido
      const newOrder = await tx.order.create({
        data: {
          userId: cart.userId!,
          total: totalAmount,
          paymentMethod: 'MercadoPago',
          paymentDetail: `Pagamento ID: ${paymentData.id}`,
          pickupLocationId: defaultDelivery.id,
          status: 'paid',
          mercadoPagoId: paymentData.id?.toString(),
          externalReference: cartId,
          items: {
            create: orderItems
          }
        },
        include: {
          user: true,
          items: {
            include: {
              product: true,
              productVariant: {
                include: { color: true }
              }
            }
          }
        }
      });

      // Limpar carrinho após pedido criado
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      await tx.cart.delete({
        where: { id: cart.id }
      });

      return newOrder;
    });

    console.log('✅ Pedido criado com sucesso:', order.id);

    // Enviar notificação no Telegram
    await sendTelegramNotification(order);

    return NextResponse.json({ 
      received: true, 
      orderId: order.id,
      status: 'order_created'
    });

  } catch (error) {
    console.error('❌ Erro no webhook MercadoPago:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET para verificar se o webhook está funcionando
export async function GET() {
  return NextResponse.json({ 
    status: 'MercadoPago Webhook Active',
    timestamp: new Date().toISOString()
  });
}
