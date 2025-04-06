"use client";

import { Produto } from "@/utils/types/produto";
import Link from "next/link";

interface AddToCartButtonProps {
  produto: Produto;
}

export default function AddToCartButton({ produto }: AddToCartButtonProps) {


  return (
    <Link href={`/produtos/${produto.id}`}>
      <button
        className="w-full py-2 bg-pink-600 text-white text-sm font-semibold rounded-md hover:bg-pink-700 transition-all"
      >
        Ver detalles
      </button>
    </Link>
  );
}
