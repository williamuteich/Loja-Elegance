"use client";

import Produtos from "./produtos";
import { useAppSelector } from "@/store/hooks";
import { Produto } from "@/utils/types/produto";

interface Props {
  titulo?: string;
  categoriaProduct: any[];
  fallback?: Produto[];
}

export default function RelatedProdutos({ titulo = "Produtos Relacionados", categoriaProduct, fallback = [] }: Props) {
  const produtosStore = useAppSelector((state) => state.products) as Produto[];
  const produtos = produtosStore.length ? produtosStore : fallback;

  if (!produtos.length) return null;

  return (
    <Produtos
      titulo={titulo}
      isDestaque={false}
      categoriaProduct={categoriaProduct}
      produtos={produtos}
    />
  );
}
