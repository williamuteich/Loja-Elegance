// src/app/(pages)/promocoes/page.tsx
import { Produto } from "@/utils/types/produto";
import PromocoesList from "./components/PromocoesList";

export default async function PromocoesPage({ searchParams }: any) {
  const resolvedSearchParams = await searchParams;
  const productResponse = await fetch(
    `${process.env.NEXTAUTH_URL}/api/publica/product?fetchAll=true`,
    { next: { revalidate: 800 } }
  );

  if (!productResponse.ok) {
    throw new Error('Falha ao buscar produtos');
  }

  const { produtos }: { produtos: Produto[] } = await productResponse.json();

  const produtosEmPromocao = produtos.filter((p: Produto) => 
    p.active &&
    p.variants.some((v: { availableStock: number }) => v.availableStock > 0) &&
    p.priceOld && p.priceOld > p.price
  );

  const categoriasUnicas = Array.from(new Set(
    produtosEmPromocao.flatMap((produto: Produto) => 
      produto.categories.map((c: { category: { name: string } }) => c.category.name)
    )
  )).map((nome: string, index: number) => ({ id: index.toString(), name: nome }));

  return (
    <PromocoesList
      produtos={produtosEmPromocao}
      totalRecords={produtosEmPromocao.length}
      categorias={categoriasUnicas}
      searchParams={resolvedSearchParams}
    />
  );
}