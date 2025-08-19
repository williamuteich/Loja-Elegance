import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/services/cartService';

export async function POST(request: NextRequest) {
  try {
    const { cartId, shippingPrice } = await request.json();

    if (!cartId) {
      return NextResponse.json({ error: 'cartId é obrigatório' }, { status: 400 });
    }

    const cart = await CartService.getCartById(cartId);
    
    if (!cart) {
      return NextResponse.json({ error: 'Carrinho não encontrado' }, { status: 404 });
    }


    const subtotal = cart.items.reduce((acc, item) => {
      const itemTotal = item.product.price * item.quantity;
      return acc + itemTotal;
    }, 0);

    const freight = shippingPrice || 0;
    const total = subtotal + freight;

    const result = {
      subtotal,
      freight,
      total,
      itemCount: cart.items.length
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Erro ao calcular total:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
