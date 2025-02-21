"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { Produto } from "@/utils/types/produto";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CartItem extends Produto {
  quantity: number;
  reservationId: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (produto: Produto) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const sessionId = useMemo(() => {
    return typeof window !== 'undefined'
      ? localStorage.getItem('sessionId') || crypto.randomUUID()
      : crypto.randomUUID();
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      const storedCart = localStorage.getItem("cart");
      if (!storedCart) return;
  
      const validatedCart = await Promise.all(
        JSON.parse(storedCart).map(async (item: CartItem) => {
          try {
            if (!item.reservationId?.match(/^[0-9a-fA-F]{24}$/)) return null;
  
            const response = await fetch(`/api/reservations/validate/${item.reservationId}`);
            if (!response.ok) return null;
  
            const { valid } = await response.json();
            return valid ? item : null;
          } catch (error) {
            return null;
          }
        })
      );
  
      setCart(validatedCart.filter(Boolean) as CartItem[]);
    };
  
    loadCart();
  }, []);

  const updateLocalStorage = (newCart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const addToCart = async (produto: Produto) => {
    try {
      const existingItem = cart.find(item => item.id === produto.id);
      const currentQuantity = existingItem?.quantity || 0;
  
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: produto.id,
          quantity: 1,
          sessionId
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error) {
          toast.error(`${errorData.error}`); 
        } else {
          throw new Error(errorData.error || 'Erro ao reservar produto');
        }
        return;
      }
  
      const updatedReservation = await response.json();
  
      setCart(prev => {
        const newCart = existingItem
          ? prev.map(item => 
              item.id === produto.id
                ? { ...item, 
                    quantity: updatedReservation.quantity, 
                    reservationId: updatedReservation.id 
                  }
                : item
            )
          : [...prev, { 
              ...produto, 
              quantity: updatedReservation.quantity,
              reservationId: updatedReservation.id 
            }];
  
        updateLocalStorage(newCart);
        return newCart;
      });
  
      setCartOpen(true);
  
    } catch (err) {
      console.error('Erro ao adicionar ao carrinho:', err);
      toast.error('Erro ao adicionar ao carrinho');
    }
  };
  

  const removeFromCart = async (productId: string) => {
    try {
      const item = cart.find(i => i.id === productId);
      if (!item) return;
  
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity: -1,
          sessionId
        }),
      });
  
      if (response.status === 204) {
        setCart(prev => {
          const newCart = prev.filter(i => i.id !== productId);
          updateLocalStorage(newCart);
          return newCart;
        });
      } 
      else if (response.ok) {
        const updatedReservation = await response.json();
        
        setCart(prev => {
          const newCart = prev.map(item => 
            item.id === productId
              ? { ...item, quantity: updatedReservation.quantity }
              : item
          ).filter(item => item.quantity > 0);
          
          updateLocalStorage(newCart);
          return newCart;
        });
      }
      else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar reserva');
      }
  
    } catch (err) {
      console.error('Erro ao remover:', err);
      toast.error(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  const clearCart = async () => {
    try {
      await Promise.all(
        cart.map(item =>
          fetch('/api/reservations', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reservationId: item.reservationId }),
          })
        )
      );

      setCart([]);
      updateLocalStorage([]);
    } catch (err) {
      toast.error('Erro ao limpar carrinho:');
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartOpen, setCartOpen }}>
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