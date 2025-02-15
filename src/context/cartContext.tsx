"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Produto } from "@/utils/types/produto";

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
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (produto: Produto) => {
    setCart((prevCart) => {
      return prevCart.some((item) => item.id === produto.id)
        ? prevCart.map((item) =>
            item.id === produto.id
              ? { ...item, quantity: Math.min(item.quantity + 1, item.stock.quantity) }
              : item
          )
        : [...prevCart, { ...produto, quantity: 1 }];
    });

    setCartOpen(true); 
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartOpen, setCartOpen }}>
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
