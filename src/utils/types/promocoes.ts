import { Produto } from "./produto";

export interface PromocoesListProps {
  produtos: Produto[];
  totalRecords: number;
  categorias: { id: string; name: string }[];
  paginaAtual: number;
  produtosPorPagina: number;
  search?: string;
  categoria?: string;
  precoMin?: string;
  precoMax?: string;
}
