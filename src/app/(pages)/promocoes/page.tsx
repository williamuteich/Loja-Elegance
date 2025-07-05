// src/app/(pages)/promocoes/page.tsx
import React from "react";
import { Produto } from "@/utils/types/produto";
import PromocoesList from "./components/PromocoesList";

export default async function PromocoesPage({ searchParams }: any): Promise<React.ReactElement> {
  // Aguarda searchParams caso seja uma Promise (Next.js server components)
  const resolvedSearchParams = typeof searchParams.then === "function" ? await searchParams : searchParams;
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/publica/product?fetchAll=true`,
    {
      next: { tags: ["loadProduct"] },
      cache: 'force-cache'
    }
  );

  if (!response.ok) {
    throw new Error('Falha ao buscar produtos');
  }
  const { produtos }: { produtos: Produto[] } = await response.json();

  let produtosEmPromocao = produtos.filter((p: Produto) =>
    p.active &&
    p.variants.some((v: { availableStock: number }) => v.availableStock > 0) &&
    p.priceOld && p.priceOld > p.price
  );

  if (resolvedSearchParams.categoria && typeof resolvedSearchParams.categoria === 'string') {
    produtosEmPromocao = produtosEmPromocao.filter((p: Produto) =>
      p.categories && p.categories.some((c: any) => c.category && c.category.name === resolvedSearchParams.categoria)
    );
  }
  if (resolvedSearchParams.precoMin && !isNaN(Number(resolvedSearchParams.precoMin))) {
    produtosEmPromocao = produtosEmPromocao.filter((p: Produto) => p.price >= Number(resolvedSearchParams.precoMin));
  }
  if (resolvedSearchParams.precoMax && !isNaN(Number(resolvedSearchParams.precoMax))) {
    produtosEmPromocao = produtosEmPromocao.filter((p: Produto) => p.price <= Number(resolvedSearchParams.precoMax));
  }
  if (resolvedSearchParams.search && typeof resolvedSearchParams.search === 'string') {
    const termo = resolvedSearchParams.search.toLowerCase();
    produtosEmPromocao = produtosEmPromocao.filter((p: Produto) =>
      (p.name && p.name.toLowerCase().includes(termo)) ||
      (p.description && p.description.toLowerCase().includes(termo))
    );
  }

  const produtosPorPagina = 12;
  const paginaAtual = resolvedSearchParams.page && !isNaN(Number(resolvedSearchParams.page)) ? Number(resolvedSearchParams.page) : 1;
  const totalRecords = produtosEmPromocao.length;
  const produtosPaginados = produtosEmPromocao.slice(
    (paginaAtual - 1) * produtosPorPagina,
    paginaAtual * produtosPorPagina
  );

  const categoriasUnicas = Array.from(new Set(
    produtosEmPromocao.flatMap((produto: Produto) =>
      produto.categories.map((c: { category: { name: string } }) => c.category.name)
    )
  )).map((nome: string, index: number) => ({ id: index.toString(), name: nome }));

  return (
    <PromocoesList
      produtos={produtosPaginados}
      totalRecords={totalRecords}
      categorias={categoriasUnicas}
      paginaAtual={paginaAtual}
      produtosPorPagina={produtosPorPagina}
      search={resolvedSearchParams.search || ""}
      categoria={resolvedSearchParams.categoria || ""}
      precoMin={resolvedSearchParams.precoMin || ""}
      precoMax={resolvedSearchParams.precoMax || ""}
    />
  );
}