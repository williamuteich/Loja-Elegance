"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Produto } from "@/utils/types/produto";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CartItem extends Produto {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (produto: Produto) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const loadCart = () => {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    };

    loadCart();
  }, []);

  const updateLocalStorage = (newCart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const addToCart = (produto: Produto) => {
    const existingItem = cart.find(item => item.id === produto.id);
    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.id === produto.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
      updateLocalStorage(updatedCart);
    } else {
      const newCart = [...cart, { ...produto, quantity: 1 }];
      setCart(newCart);
      updateLocalStorage(newCart);
    }

    setCartOpen(true);
  };

  const removeFromCart = async (productId: string) => {
    try {
      const item = cart.find(i => i.id === productId);
      if (!item) return;
  
      let updatedCart: CartItem[];
  
      if (item.quantity > 1) {
        updatedCart = cart.map(i =>
          i.id === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );
      } else {
        updatedCart = cart.filter(i => i.id !== productId);
      }
  
      setCart(updatedCart);
      updateLocalStorage(updatedCart);
  
    } catch (err) {
      console.error('Erro ao remover item do carrinho:', err);
      toast.error('Erro ao remover item do carrinho');
    }
  };
  
  

  const clearCart = () => {
    setCart([]);
    updateLocalStorage([]);
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
