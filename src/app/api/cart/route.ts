import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/services/cartService';
import { getServerSession } from 'next-auth';
import { auth } from '@/lib/auth-config';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(auth);
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (!session?.user?.id && !sessionId) {
      return NextResponse.json(
        { error: 'SessionId é obrigatório para usuários não logados' },
        { status: 400 }
      );
    }

    const cart = await CartService.getOrCreateCart(
      session?.user?.id,
      sessionId || undefined
    );

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(auth);
    const body = await request.json();
    const { action, cartId, sessionId, ...data } = body;

    if (!session?.user?.id && !sessionId) {
      return NextResponse.json(
        { error: 'SessionId é obrigatório para usuários não logados' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'add':
        if (!cartId || !data.productId || !data.quantity) {
          return NextResponse.json(
            { error: 'Campos obrigatórios: cartId, productId, quantity' },
            { status: 400 }
          );
        }
        result = await CartService.addItem(
          cartId,
          {
            productId: data.productId,
            productVariantId: data.productVariantId,
            quantity: data.quantity,
          },
          session?.user?.id,
          sessionId
        );
        break;

      case 'remove':
        if (!cartId || !data.productId) {
          return NextResponse.json(
            { error: 'Campos obrigatórios: cartId, productId' },
            { status: 400 }
          );
        }
        result = await CartService.removeItem(
          cartId,
          data.productId,
          data.productVariantId,
          session?.user?.id,
          sessionId
        );
        break;

      case 'update':
        if (!cartId || !data.productId || data.quantity === undefined) {
          return NextResponse.json(
            { error: 'Campos obrigatórios: cartId, productId, quantity' },
            { status: 400 }
          );
        }
        result = await CartService.updateItemQuantity(
          cartId,
          data.productId,
          data.quantity,
          data.productVariantId,
          session?.user?.id,
          sessionId
        );
        break;

      case 'clear':
        if (!cartId) {
          return NextResponse.json(
            { error: 'Campo obrigatório: cartId' },
            { status: 400 }
          );
        }
        await CartService.clearCart(cartId);
        result = { success: true };
        break;

      case 'migrate':
        if (!session?.user?.id || !sessionId) {
          return NextResponse.json(
            { error: 'Usuário deve estar logado e fornecer sessionId' },
            { status: 400 }
          );
        }
        result = await CartService.migrateSessionCartToUser(sessionId, session.user.id);
        break;

      default:
        return NextResponse.json(
          { error: 'Ação inválida' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Erro na API do carrinho:', error);
    
    // Erros de negócio (validação, estoque, etc.) retornam 400
    if (error.message?.includes('Estoque insuficiente') || 
        error.message?.includes('não encontrado') ||
        error.message?.includes('não encontrada')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Outros erros retornam 500
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
