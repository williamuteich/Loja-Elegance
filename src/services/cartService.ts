import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';

export interface CartItemData {
  productId: string;
  productVariantId?: string;
  quantity: number;
}

export interface CartData {
  id: string;
  sessionId?: string;
  userId?: string;
  items: Array<{
    id: string;
    productId: string;
    productVariantId?: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: number;
      imagePrimary?: string;
      width?: number;
      height?: number;
      length?: number;
      weight?: number;
    };
    productVariant?: {
      id: string;
      color: {
        name: string;
        hexCode: string;
      };
    };
  }>;
  expireAt: Date;
}

export class CartService {

  private static TTL_SECONDS = 10 * 60; // 10 minutos

  static async getOrCreateCart(userId?: string, sessionId?: string): Promise<CartData> {
    if (!userId && !sessionId) {
      logger.error('Cart creation failed: No userId or sessionId provided', null, 'CartService');
      throw new Error('É necessário fornecer userId ou sessionId');
    }

    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
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
                stock: true, 
              },
            },
          },
        },
      },
    });

    if (!cart) {
      const expireAt = new Date();
      expireAt.setSeconds(expireAt.getSeconds() + this.TTL_SECONDS);

      cart = await prisma.cart.create({
        data: {
          userId,
          sessionId: sessionId || (userId ? undefined : uuidv4()),
          expireAt,
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
                  stock: true, 
                },
              },
            },
          },
        },
      });
    }

    return cart as CartData;
  }

  static async addItem(
    cartId: string,
    item: CartItemData,
    userId?: string,
    sessionId?: string
  ): Promise<CartData> {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      include: {
        variants: {
          include: {
            stock: true,
          },
        },
      },
    });

    if (!product) {
      throw new Error('Produto não encontrado');
    }

    if (item.productVariantId) {
      const variant = product.variants.find(v => v.id === item.productVariantId);
      if (!variant) {
        throw new Error('Variante do produto não encontrada');
      }

      const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          cartId,
          productId: item.productId,
          productVariantId: item.productVariantId,
        },
      });

      const quantityInCart = existingCartItem ? existingCartItem.quantity : 0;
      const totalQuantityAfterAdd = quantityInCart + item.quantity;

      if (variant.stock && variant.stock.quantity < totalQuantityAfterAdd) {
        throw new Error(`Estoque insuficiente. Disponível: ${variant.stock.quantity}, no carrinho: ${quantityInCart}`);
      }
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId,
        productId: item.productId,
        productVariantId: item.productVariantId,
      },
    });

    const newExpireAt = new Date();
    newExpireAt.setSeconds(newExpireAt.getSeconds() + this.TTL_SECONDS);

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + item.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId,
          productId: item.productId,
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        },
      });
    }

    // Verify cart exists before updating
    const cartExists = await prisma.cart.findUnique({
      where: { id: cartId },
      select: { id: true }
    });

    if (!cartExists) {
      throw new Error('Carrinho não encontrado ou expirado');
    }

    await prisma.cart.update({
      where: { id: cartId },
      data: { expireAt: newExpireAt },
    });

    return this.getOrCreateCart(userId, sessionId);
  }

  static async removeItem(
    cartId: string,
    productId: string,
    productVariantId?: string,
    userId?: string,
    sessionId?: string
  ): Promise<CartData> {
    await prisma.cartItem.deleteMany({
      where: {
        cartId,
        productId,
        productVariantId,
      },
    });

    const newExpireAt = new Date();
    newExpireAt.setSeconds(newExpireAt.getSeconds() + this.TTL_SECONDS);

    // Verify cart exists before updating
    const cartExists = await prisma.cart.findUnique({
      where: { id: cartId },
      select: { id: true }
    });

    if (cartExists) {
      await prisma.cart.update({
        where: { id: cartId },
        data: { expireAt: newExpireAt },
      });
    }

    return this.getOrCreateCart(userId, sessionId);
  }

  static async updateItemQuantity(
    cartId: string,
    productId: string,
    quantity: number,
    productVariantId?: string,
    userId?: string,
    sessionId?: string
  ): Promise<CartData> {
    if (quantity <= 0) {
      return this.removeItem(cartId, productId, productVariantId, userId, sessionId);
    }

    if (productVariantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: productVariantId },
        include: { stock: true },
      });

      if (variant?.stock && variant.stock.quantity < quantity) {
        throw new Error('Estoque insuficiente');
      }
    }

    await prisma.cartItem.updateMany({
      where: {
        cartId,
        productId,
        productVariantId,
      },
      data: { quantity },
    });

    const newExpireAt = new Date();
    newExpireAt.setSeconds(newExpireAt.getSeconds() + this.TTL_SECONDS);

    // Verify cart exists before updating
    const cartExists = await prisma.cart.findUnique({
      where: { id: cartId },
      select: { id: true }
    });

    if (cartExists) {
      await prisma.cart.update({
        where: { id: cartId },
        data: { expireAt: newExpireAt },
      });
    }

    return this.getOrCreateCart(userId, sessionId);
  }

  static async clearCart(cartId: string): Promise<void> {
    await prisma.cart.delete({
      where: { id: cartId },
    });
  }

  static async getCartById(cartId: string): Promise<CartData | null> {
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

    return cart as CartData | null;
  }

  static async migrateSessionCartToUser(sessionId: string, userId: string): Promise<CartData | null> {
    const sessionCart = await prisma.cart.findFirst({
      where: { sessionId },
      include: { items: true },
    });

    if (!sessionCart) return null;

    const userCart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (userCart) {
      for (const item of sessionCart.items) {
        const existingItem = await prisma.cartItem.findFirst({
          where: {
            cartId: userCart.id,
            productId: item.productId,
            productVariantId: item.productVariantId,
          },
        });

        if (existingItem) {
          await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + item.quantity },
          });
        } else {
          await prisma.cartItem.create({
            data: {
              cartId: userCart.id,
              productId: item.productId,
              productVariantId: item.productVariantId,
              quantity: item.quantity,
            },
          });
        }
      }

      await prisma.cart.delete({ where: { id: sessionCart.id } });

      return this.getCartById(userCart.id);
    } else {
      const updatedCart = await prisma.cart.update({
        where: { id: sessionCart.id },
        data: {
          userId,
          sessionId: null,
        },
      });

      return this.getCartById(updatedCart.id);
    }
  }
}
