import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/services/cartService';
import { getServerSession } from 'next-auth';
import { auth } from '@/lib/auth-config';
import { RateLimit, getClientIP } from '@/lib/rateLimit';

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
    
    // ✅ SEGURANÇA: Rate limiting por usuário/IP
    const clientIP = getClientIP(request);
    const rateLimitIdentifier = session?.user?.id || clientIP;
    
    const rateLimitResult = await RateLimit.check(
      rateLimitIdentifier,
      RateLimit.configs.cart
    );
    
    if (!rateLimitResult.allowed) {
      console.warn(`🚨 RATE LIMIT: Cart API blocked for ${rateLimitIdentifier}`);
      return NextResponse.json(
        { 
          error: 'Muitas requisições. Tente novamente em alguns instantes.',
          remainingRequests: rateLimitResult.remainingRequests,
          resetTime: rateLimitResult.resetTime
        },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { action, sessionId, ...data } = body;

    if (!session?.user?.id && !sessionId) {
      return NextResponse.json(
        { error: 'SessionId é obrigatório para usuários não logados' },
        { status: 400 }
      );
    }

    // ✅ SEGURO: Buscar ou criar carrinho via userId/sessionId (não via cartId)
    const cart = await CartService.getOrCreateCart(
      session?.user?.id,
      sessionId || undefined
    );

    let result;

    switch (action) {
      case 'add':
        if (!data.productId || !data.quantity) {
          return NextResponse.json(
            { error: 'Campos obrigatórios: productId, quantity' },
            { status: 400 }
          );
        }
        result = await CartService.addItem(
          cart.id, // ✅ SEGURO: cartId obtido do backend
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
        if (!data.productId) {
          return NextResponse.json(
            { error: 'Campo obrigatório: productId' },
            { status: 400 }
          );
        }
        result = await CartService.removeItem(
          cart.id, // ✅ SEGURO: cartId obtido do backend
          data.productId,
          data.productVariantId,
          session?.user?.id,
          sessionId
        );
        break;

      case 'update':
        if (!data.productId || data.quantity === undefined) {
          return NextResponse.json(
            { error: 'Campos obrigatórios: productId, quantity' },
            { status: 400 }
          );
        }
        result = await CartService.updateItemQuantity(
          cart.id, // ✅ SEGURO: cartId obtido do backend
          data.productId,
          data.quantity,
          data.productVariantId,
          session?.user?.id,
          sessionId
        );
        break;

      case 'clear':
        await CartService.clearCart(cart.id); // ✅ SEGURO: cartId obtido do backend
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
