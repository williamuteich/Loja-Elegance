"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Produto } from "@/utils/types/produto";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imagePrimary: string;
  quantity: number;
  selectedVariantId: string;
  variantDetails: {
    color: string;
    hexCode: string;
    availableStock: number;
  };
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (produto: Produto & { selectedVariantId: string }) => void;
  removeFromCart: (id: string, variantId: string) => void;
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

  const updateLocalStorage = (newCart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const addToCart = (produto: Produto & { selectedVariantId: string }) => {
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

    const cartItem: CartItem = {
      id: produto.id,
      name: produto.name,
      price: produto.price,
      imagePrimary: produto.imagePrimary,
      quantity: 1,
      selectedVariantId: produto.selectedVariantId,
      variantDetails: {
        color: selectedVariant.color.name,
        hexCode: selectedVariant.color.hexCode,
        availableStock: selectedVariant.availableStock,
      },
    };

    const existingItemIndex = cart.findIndex(
      (item) => item.id === produto.id && item.selectedVariantId === produto.selectedVariantId
    );

    if (existingItemIndex >= 0) {
      if (cart[existingItemIndex].quantity >= selectedVariant.availableStock) {
        toast.warning("Quantidade máxima disponível para esta variante atingida.");
        return;
      }

      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
      updateLocalStorage(updatedCart);
    } else {
      const newCart = [...cart, cartItem];
      setCart(newCart);
      updateLocalStorage(newCart);
    }

    setCartOpen(true);
  };

  const removeFromCart = (productId: string, variantId: string) => {
    const item = cart.find(i => i.id === productId && i.selectedVariantId === variantId);
    if (!item) return;

    let updatedCart: CartItem[];

    if (item.quantity > 1) {
      updatedCart = cart.map(i =>
        i.id === productId && i.selectedVariantId === variantId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      );
    } else {
      updatedCart = cart.filter(i => !(i.id === productId && i.selectedVariantId === variantId));
    }

    setCart(updatedCart);
    updateLocalStorage(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    updateLocalStorage([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, cartOpen, setCartOpen }}
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
