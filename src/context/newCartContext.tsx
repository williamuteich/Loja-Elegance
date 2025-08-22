"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Produto } from "@/utils/types/produto";
import { toast, ToastContainer } from "react-toastify";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from 'uuid';
import "react-toastify/dist/ReactToastify.css";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imagePrimary: string | null;
  quantity: number;
  selectedVariantId: string;
  variantDetails: {
    color: string;
    hexCode: string;
    availableStock: number;
  };
}

export interface DatabaseCartItem {
  id: string;
  productId: string;
  productVariantId?: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imagePrimary?: string;
  };
  productVariant?: {
    id: string;
    color: {
      name: string;
      hexCode: string;
    };
    stock?: {
      quantity: number;
    };
  };
}

export interface DatabaseCart {
  id: string;
  sessionId?: string;
  userId?: string;
  items: DatabaseCartItem[];
  expireAt: Date;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (produto: Produto & { selectedVariantId: string }) => void;
  removeFromCart: (id: string, variantId: string) => void;
  decreaseQuantity: (id: string, variantId: string) => void; 
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isHydrated: boolean;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  // ❌ REMOVIDO: cartId não deve ficar no frontend por segurança
  
  const { data: session } = useSession();

  useEffect(() => {
    let storedSessionId = localStorage.getItem('cart_session_id');
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      localStorage.setItem('cart_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  useEffect(() => {
    if (!sessionId && !session?.user?.id) return;

    const loadCart = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (!session?.user?.id && sessionId) {
          params.set('sessionId', sessionId);
        }

        const response = await fetch(`/api/cart?${params.toString()}`);
        const data: DatabaseCart = await response.json();

        if (response.ok && data) {
          // ✅ SEGURO: Não armazenar cartId no frontend
          
          const convertedCart: CartItem[] = data.items.map(item => ({
            id: item.productId,
            name: item.product.name,
            price: item.product.price,
            imagePrimary: item.product.imagePrimary || null,
            quantity: item.quantity,
            selectedVariantId: item.productVariantId || '',
            variantDetails: {
              color: item.productVariant?.color.name || '',
              hexCode: item.productVariant?.color.hexCode || '',
              availableStock: item.productVariant?.stock?.quantity || 0, 
            },
          }));

          setCart(convertedCart);
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        toast.error('Erro ao carregar carrinho');
      } finally {
        setIsLoading(false);
        setIsHydrated(true);
      }
    };

    loadCart();
  }, [sessionId, session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id && sessionId) {
      const migrateCart = async () => {
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'migrate',
              sessionId,
            }),
          });

          if (response.ok) {
            localStorage.removeItem('cart_session_id');
            window.location.reload();
          }
        } catch (error) {
          console.error('Erro ao migrar carrinho:', error);
        }
      };

      migrateCart();
    }
  }, [session?.user?.id, sessionId]); // ✅ SEGURO: Removido cartId da dependência

  const addToCart = async (produto: Produto & { selectedVariantId: string }) => {
    // ✅ SEGURO: Backend resolve o cartId internamente
    
    let selectedVariant = produto.variants?.find(
      (v: Produto["variants"][number]) => v.id === produto.selectedVariantId
    );

    if (!selectedVariant) {
      const existingItem = cart.find(
        (item) => item.id === produto.id && item.selectedVariantId === produto.selectedVariantId
      );

      if (existingItem) {
        selectedVariant = {
          id: existingItem.selectedVariantId,
          color: {
            name: existingItem.variantDetails.color,
            hexCode: existingItem.variantDetails.hexCode,
          },
          availableStock: existingItem.variantDetails.availableStock,
        };
      }
    }

    if (!selectedVariant) {
      toast.error("Variante não encontrada.");
      return;
    }

    const existingItem = cart.find(
      (item) => item.id === produto.id && item.selectedVariantId === produto.selectedVariantId
    );

    if (selectedVariant && selectedVariant.availableStock > 0) {
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
      if (currentQuantityInCart >= selectedVariant.availableStock) {
        toast.warning(`Estoque máximo atingido (${selectedVariant.availableStock} unidades)`);
        return;
      }
    }

    try {
      setIsLoading(true);
      
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          // ✅ SEGURO: API resolve cartId internamente via sessionId/userId
          sessionId: !session?.user?.id ? sessionId : undefined,
          productId: produto.id,
          productVariantId: produto.selectedVariantId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (response.ok && data.items) {
        const convertedCart: CartItem[] = data.items.map((item: DatabaseCartItem) => ({
          id: item.productId,
          name: item.product.name,
          price: item.product.price,
          imagePrimary: item.product.imagePrimary || null,
          quantity: item.quantity,
          selectedVariantId: item.productVariantId || '',
          variantDetails: {
            color: item.productVariant?.color.name || '',
            hexCode: item.productVariant?.color.hexCode || '',
            availableStock: item.productVariant?.stock?.quantity || 0, 
          },
        }));

        setCart(convertedCart);
        setCartOpen(true);
      } else {
        if (response.status === 400 && data.error?.includes('Estoque insuficiente')) {
          toast.warning(data.error);
        } else {
          toast.error(data.error || 'Erro ao adicionar produto');
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast.error('Erro ao adicionar produto ao carrinho');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string, variantId: string) => {
    // ✅ SEGURO: API resolve cartId via sessionId/userId

    try {
      setIsLoading(true);

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          // ✅ SEGURO: Sem cartId exposto
          sessionId: !session?.user?.id ? sessionId : undefined,
          productId,
          productVariantId: variantId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.items) {
        const convertedCart: CartItem[] = data.items.map((item: DatabaseCartItem) => ({
          id: item.productId,
          name: item.product.name,
          price: item.product.price,
          imagePrimary: item.product.imagePrimary || null,
          quantity: item.quantity,
          selectedVariantId: item.productVariantId || '',
          variantDetails: {
            color: item.productVariant?.color.name || '',
            hexCode: item.productVariant?.color.hexCode || '',
            availableStock: item.productVariant?.stock?.quantity || 0, 
          },
        }));

        setCart(convertedCart);
      } else {
        toast.error(data.error || 'Erro ao remover produto');
      }
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
      toast.error('Erro ao remover produto do carrinho');
    } finally {
      setIsLoading(false);
    }
  };

  const decreaseQuantity = async (productId: string, variantId: string) => {
    // ✅ SEGURO: API resolve cartId via sessionId/userId

    const currentItem = cart.find(item => 
      item.id === productId && item.selectedVariantId === variantId
    );

    if (!currentItem) return;

    try {
      setIsLoading(true);

      if (currentItem.quantity === 1) {
        await removeFromCart(productId, variantId);
      } else {
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update',
            // ✅ SEGURO: Sem cartId exposto
            sessionId: !session?.user?.id ? sessionId : undefined,
            productId,
            productVariantId: variantId,
            quantity: currentItem.quantity - 1,
          }),
        });

        const data = await response.json();

        if (response.ok && data.items) {
          const convertedCart: CartItem[] = data.items.map((item: DatabaseCartItem) => ({
            id: item.productId,
            name: item.product.name,
            price: item.product.price,
            imagePrimary: item.product.imagePrimary || null,
            quantity: item.quantity,
            selectedVariantId: item.productVariantId || '',
            variantDetails: {
              color: item.productVariant?.color.name || '',
              hexCode: item.productVariant?.color.hexCode || '',
              availableStock: item.productVariant?.stock?.quantity || 0, 
            },
          }));

          setCart(convertedCart);
        } else {
          toast.error(data.error || 'Erro ao atualizar quantidade');
        }
      }
    } catch (error) {
      console.error('Erro ao diminuir quantidade:', error);
      toast.error('Erro ao atualizar quantidade');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    // ✅ SEGURO: API resolve cartId via sessionId/userId

    try {
      setIsLoading(true);

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'clear',
          // ✅ SEGURO: API resolve cartId internamente
          sessionId: !session?.user?.id ? sessionId : undefined,
        }),
      });

      if (response.ok) {
        setCart([]);
        // ✅ SEGURO: Não precisa limpar cartId (não existe mais)
      } else {
        toast.error('Erro ao limpar carrinho');
      }
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      toast.error('Erro ao limpar carrinho');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, decreaseQuantity, clearCart, cartOpen, setCartOpen, isHydrated, isLoading }}
    >
      <ToastContainer />
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
};
