import { Produto } from "@/utils/types/produto";
import ProdutosList from "./components/ProdutosList";

export default async function ProdutosPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const paramsObj = await searchParams;
  const search = typeof paramsObj.search === "string" ? paramsObj.search : "";
  const categoria = typeof paramsObj.categoria === "string" ? paramsObj.categoria : "";
  const precoMin = typeof paramsObj.precoMin === "string" ? paramsObj.precoMin : "";
  const precoMax = typeof paramsObj.precoMax === "string" ? paramsObj.precoMax : "";
  const page = typeof paramsObj.page === "string" && !isNaN(Number(paramsObj.page)) ? Number(paramsObj.page) : 1;
  const produtosPorPagina = 10; // Definir o número de produtos por página

  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (categoria) params.set("categoria", categoria);
  if (precoMin) params.set("precoMin", precoMin);
  if (precoMax) params.set("precoMax", precoMax);
  params.set("page", page.toString());
  params.set("pageSize", produtosPorPagina.toString());
  params.set("random", "true"); // Garantir que os produtos serão aleatórios
  params.set("randomLimit", produtosPorPagina.toString()); // Limitar a 10 produtos

  const productResponse = await fetch(
    `${process.env.NEXTAUTH_URL}/api/publica/product?${params.toString()}`,
    { next: { revalidate: 300 } }
  );
  if (!productResponse.ok) {
    throw new Error('Falha ao buscar produtos');
  }
  const { produtos, totalRecords }: { produtos: Produto[]; totalRecords: number } = await productResponse.json();

  const categoryResponse = await fetch(
    `${process.env.NEXTAUTH_URL}/api/publica/category?fetchAll=true`,
    { next: { revalidate: 300 } }
  );
  if (!categoryResponse.ok) {
    throw new Error('Falha ao buscar categorias');
  }
  const { category: categoriasAll }: { category: { id: string; name: string }[] } = await categoryResponse.json();

  const filtrosAberto = paramsObj.filtros === '1';

  return (
    <ProdutosList
      produtos={produtos}
      totalRecords={totalRecords}
      categorias={categoriasAll}
      paginaAtual={page}
      produtosPorPagina={produtosPorPagina}
      search={search}
      categoria={categoria}
      precoMin={precoMin ? Number(precoMin) : undefined}
      precoMax={precoMax ? Number(precoMax) : undefined}
      filtrosAberto={filtrosAberto}
    />
  );
}
