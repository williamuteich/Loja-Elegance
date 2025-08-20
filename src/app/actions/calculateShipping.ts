'use server';

import { MercadoPagoConfig, Preference } from 'mercadopago';
import { getServerSession } from 'next-auth';
import { auth } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function calculateShippingAndCreatePayment(
  shippingServiceId: string,
  toPostalCode: string
) {
  try {
    const session = await getServerSession(auth);
    if (!session?.user) {
      throw new Error('Usuário não autenticado');
    }

    const cart = await prisma.cart.findFirst({
      where: { 
        OR: [
          { userId: session.user.id },
          { sessionId: { not: null } } 
        ]
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imagePrimary: true,
                width: true,
                height: true,
                length: true,
                weight: true,
              },
            },
            productVariant: {
              include: {
                color: {
                  select: {
                    name: true,
                    hexCode: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error('Carrinho vazio ou não encontrado');
    }

    const subtotal = cart.items.reduce((acc, item) => {
      return acc + (item.product.price * item.quantity);
    }, 0);

    const shippingPrice = await calculateShippingWithMelhorEnvio(
      cart.items,
      toPostalCode,
      shippingServiceId
    );

    const preference = await createMercadoPagoPreference(
      cart,
      subtotal,
      shippingPrice,
      session.user.id
    );

    console.log('✅ Pagamento criado:', preference.id);

    return {
      success: true,
      init_point: preference.init_point,
      preference_id: preference.id,
      subtotal,
      shippingPrice,
      total: subtotal + shippingPrice
    };
  } catch (error) {
    console.error('Erro no cálculo de frete:', error);
    throw new Error(error instanceof Error ? error.message : 'Erro interno');
  }
}

async function calculateShippingWithMelhorEnvio(
  items: any[],
  toPostalCode: string,
  serviceId: string
): Promise<number> {
  const MELHOR_ENVIO_URL = process.env.MELHOR_ENVIO_URL || 'https://melhorenvio.com.br/api/v2/me/shipment/calculate';
  const MELHOR_ENVIO_TOKEN = process.env.MELHOR_ENVIO_TOKEN;
  
  if (!MELHOR_ENVIO_TOKEN) {
    throw new Error('Token do Melhor Envio não configurado');
  }

  if (!toPostalCode || typeof toPostalCode !== 'string') {
    throw new Error('CEP de destino inválido');
  }

  const cleanPostalCode = String(toPostalCode).replace(/\D/g, '');
  if (cleanPostalCode.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos');
  }

  const products = items.map(item => ({
    id: item.product.id,
    width: item.product.width || 11,     
    height: item.product.height || 11,   
    length: item.product.length || 17,   
    weight: item.product.weight || 3,    
    insurance_value: 0, 
    quantity: item.quantity,
  }));


  const payload = {
    from: { postal_code: '97538000' }, 
    to: { postal_code: cleanPostalCode },
    products,
    services: serviceId 
  };

  const res = await fetch(MELHOR_ENVIO_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${MELHOR_ENVIO_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao calcular frete');
  }

  const data = await res.json();
  
  const selectedService = Array.isArray(data) ? 
    data.find(service => service.id === serviceId) : data;
  
  if (!selectedService || !selectedService.price) {
    throw new Error('Serviço de frete não disponível');
  }

  return Number(selectedService.price);
}

async function createMercadoPagoPreference(
  cart: any,
  subtotal: number,
  shippingPrice: number,
  userId: string
) {
  const MERCADOPAGO_ACCESS_TOKEN = process.env.NEXT_ACCESS_TOKEN;
  if (!MERCADOPAGO_ACCESS_TOKEN) {
    throw new Error('Token do Mercado Pago não configurado');
  }

  const client = new MercadoPagoConfig({ 
    accessToken: MERCADOPAGO_ACCESS_TOKEN,
    options: { timeout: 5000 }
  });
  
  const preferenceClient = new Preference(client);

  const items = cart.items.map((item: any) => {
    const productName = item.product.name;
    const variantInfo = item.productVariant?.color?.name ? 
      ` - ${item.productVariant.color.name}` : '';
    
    return {
      id: item.product.id,
      title: `${productName}${variantInfo}`.substring(0, 127), 
      description: `Produto: ${productName}${variantInfo} | Preço unitário: R$ ${Number(item.product.price).toFixed(2)}`,
      picture_url: item.product.imagePrimary ? `${item.product.imagePrimary}` : undefined,
      quantity: Number(item.quantity),
      unit_price: Number(item.product.price),
      currency_id: 'BRL'
    };
  });

  // Adicionar frete como item separado
  if (shippingPrice > 0) {
    items.push({ 
      id: 'frete',
      title: 'Frete',
      description: `Entrega - Valor: R$ ${Number(shippingPrice).toFixed(2)}`,
      category_id: 'shipping',
      quantity: 1,
      unit_price: Number(shippingPrice),
      currency_id: 'BRL'
    });
  }

  const preferenceData = {
    items
  };

  const preference = await preferenceClient.create({ body: preferenceData });
  console.log('✅ MercadoPago OK:', preference.id);

  return preference;
}