"use client";

import { useCart } from "@/context/cartContext";
import { Produto } from "@/utils/types/produto";

interface AddToCartButtonProps {
  produto: Produto;
}

export default function AddToCartButton({ produto }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => {
        addToCart(produto);
      }}
      className="w-full py-2 bg-pink-600 text-white text-sm font-semibold rounded-md hover:bg-pink-700 transition-all"
    >
      Agregar al Carrito
    </button>
  );
}
