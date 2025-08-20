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

    // ✅ SEGURO: Buscar carrinho via userId (não cartId do frontend)
    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imagePrimary: true,
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

    // Calcular subtotal
    const subtotal = cart.items.reduce((acc, item) => {
      return acc + (item.product.price * item.quantity);
    }, 0);

    // Calcular frete usando Melhor Envio (no servidor)
    const shippingPrice = await calculateShippingWithMelhorEnvio(
      cart.items,
      toPostalCode,
      shippingServiceId
    );

    // Criar preferência de pagamento no Mercado Pago
    const preference = await createMercadoPagoPreference(
      cart,
      subtotal,
      shippingPrice,
      session.user.id
    );

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

  // ✅ Validar e sanitizar CEP
  if (!toPostalCode || typeof toPostalCode !== 'string') {
    throw new Error('CEP de destino inválido');
  }

  const cleanPostalCode = String(toPostalCode).replace(/\D/g, '');
  if (cleanPostalCode.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos');
  }

  const products = items.map(item => ({
    id: item.product.id,
    width: 11,  // Largura fixa em cm
    height: 11, // Altura fixa em cm  
    length: 17, // Comprimento fixo em cm
    weight: 3,  // Peso fixo em kg
    insurance_value: item.product.price * item.quantity,
    quantity: item.quantity,
  }));

  const payload = {
    from: { postal_code: '97538000' }, // CEP de origem fixo
    to: { postal_code: cleanPostalCode },
    products,
    services: serviceId // Especificar o serviço selecionado
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
  
  // Encontrar o serviço selecionado
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

  // Preparar itens para o Mercado Pago
  const items = cart.items.map((item: any) => {
    const productName = item.product.name;
    const variantInfo = item.productVariant?.color?.name ? 
      ` - ${item.productVariant.color.name}` : '';
    
    return {
      id: item.product.id,
      title: `${productName}${variantInfo}`.substring(0, 127), // Limite de caracteres
      description: `Produto: ${productName}${variantInfo} | Preço unitário: R$ ${Number(item.product.price).toFixed(2)}`,
      picture_url: item.product.imagePrimary ? 
        `${process.env.NEXTAUTH_URL}${item.product.imagePrimary}` : undefined,
      category_id: 'fashion',
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
    items,
    back_urls: {
      success: `${process.env.NEXTAUTH_URL}/checkout/sucesso`,
      failure: `${process.env.NEXTAUTH_URL}/checkout/falha`,
      pending: `${process.env.NEXTAUTH_URL}/checkout/pending`,
    },
    auto_return: 'approved' as const,
    payment_methods: {
      excluded_payment_methods: [],
      excluded_payment_types: [],
      installments: 12,
      default_installments: 1
    },
    statement_descriptor: "BAZAR ELEGANCE",
    external_reference: cart.id,
    expires: true,
    expiration_date_from: new Date().toISOString(),
    expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString()
  };

  return await preferenceClient.create({ body: preferenceData });
}