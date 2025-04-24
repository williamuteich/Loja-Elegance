import { Produto } from "@/utils/types/produto";
import ClientProdutos from "./components/ProdutosList";

export default async function ProdutosPage({ searchParams }: any) {
  const resolvedSearchParams = await searchParams;
  const productResponse = await fetch(
    `${process.env.NEXTAUTH_URL}/api/publica/product?fetchAll=true`,
    { next: { revalidate: 800 } }
  );

  if (!productResponse.ok) {
    throw new Error('Falha ao buscar produtos');
  }

  const { produtos, totalRecords }: { produtos: Produto[]; totalRecords: number } = await productResponse.json();

  const categoriasUnicas = Array.from(new Set(
    produtos.flatMap((produto: Produto) => 
      produto.categories.map((c: { category: { name: string } }) => c.category.name)
    )
  )).map((nome: string, index: number) => ({ id: index.toString(), name: nome }));

  return (
    <ClientProdutos
      produtos={produtos}
      totalRecords={totalRecords}
      categorias={categoriasUnicas}
      searchParams={resolvedSearchParams}
    />
  );
}