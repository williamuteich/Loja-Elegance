"use client";

import { useCart } from "@/context/cartContext";
import { Produto } from "@/utils/types/produto";

interface AddToCartButtonProps {
  produto: Produto;
  selectedVariant: {
    id: string;
    color: {
      name: string;
      hexCode: string;
    };
    availableStock: number;
  };
}

export default function AddToCartButton({ produto, selectedVariant }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart({ ...produto, selectedVariantId: selectedVariant.id })}
      className="w-full py-2 bg-pink-600 text-white text-sm font-semibold rounded-md hover:bg-pink-700 transition-all"
    >
      Adicionar ao carrinho
    </button>
  );
}
