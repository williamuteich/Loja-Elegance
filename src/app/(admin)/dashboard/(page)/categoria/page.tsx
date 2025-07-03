import { FaList } from "react-icons/fa";
import { Suspense } from "react";
import Container from "../components/Container";
import ModalCategoria from "../components/ModalCategoria";
import ModalDeletar from "../components/ModalDeletar";
import SearchItems from "../components/searchItems";
import { LoadSkeleton } from "../components/loadSkeleton";
import Paginacao from "@/app/components/Paginacao";
import type { Categoria } from "@/utils/types/categoria";

const modalConfig = (action: string, categoria?: Categoria) => ({
  title: `${action} Categoria`,
  description: action === "Adicionar" 
    ? "Preencha os campos abaixo para adicionar uma nova categoria." 
    : "Faça alterações na categoria abaixo.",
  action,
  fields: [
    { name: "name", label: "Nome", type: "text" as "text", placeholder: "Digite o nome da Categoria" },
    { name: "description", label: "Descrição", type: "text" as "text", placeholder: "Descrição da categoria" },
  ],
  apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/category`,
  urlRevalidate: ["/dashboard/categoria"], 
  tags: ["reloadCategory"],
  method: action === "Adicionar" ? "POST" : "PUT",
  initialValues: categoria ? { 
    name: categoria.name, 
    description: categoria.description, 
    imageUrl: categoria.imageUrl 
  } : undefined,
});

const fetchCategories = async (search: string, page: string, status: string) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (page) params.append("page", page);
  if (status) params.append("status", status);

  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/privada/category?${params}`, {
    cache: "force-cache", 
  });

  if (!response.ok) throw new Error("Erro ao carregar os dados.");

  return response.json();
};

const CategoriasList = async ({ search, page, status }: { search: string; page: string; status: string }) => {
  const data = await fetchCategories(search, page, status);

  if (!data.category?.length) {
    return <p className="mt-10 font-medium text-lg">Nenhuma Categoria Encontrada</p>;
  }

  return (
    <div>
      <p className="text-gray-700 text-base mb-3">
        <span className="font-semibold text-gray-800">Total de Categorias: </span>
        <span className="font-medium text-blue-600">{data.totalRecords}</span>
      </p>
      <table className="hidden md:table min-w-full table-auto border-collapse rounded-md border-t border-b border-gray-300">
        <thead className="bg-gray-800 text-white">
          <tr>
            {['ID', 'Nome', 'Descrição', ''].map((header, idx) => (
              <th key={idx} className="py-3 px-4 text-left text-sm font-medium text-white">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {data.category.map((categoria: Categoria) => (
            <tr key={categoria.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 font-medium text-sm text-blue-600">{categoria.id}</td>
              <td className="py-3 px-4 font-medium text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <FaList size={22} className="text-gray-500" />
                  <span>{categoria.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 font-medium text-sm text-gray-700">{categoria.description}</td>
              <td className="py-3 px-0 font-medium text-sm text-gray-700">
                <div className="flex justify-end items-center space-x-3">
                  <ModalCategoria config={modalConfig("Editar", categoria)} params={categoria.id} />
                  <ModalDeletar
                    config={{
                      id: categoria.id,
                      title: "Tem certeza que deseja excluir esta categoria?",
                      description:
                        "Esta ação não pode ser desfeita. A categoria será removida permanentemente. Deseja continuar?",
                      apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/category`,
                      urlRevalidate: ["/dashboard/categoria"],
                      tags: ["reloadCategory"],
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CARDS PARA MOBILE */}
      <div className="md:hidden flex flex-col gap-4">
        {data.category.map((categoria: Categoria) => (
          <div key={categoria.id} className="bg-white rounded-lg shadow border p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <FaList size={22} className="text-gray-500" />
              <span className="font-semibold text-blue-700">{categoria.name}</span>
            </div>
            <div className="text-gray-800 text-sm mb-2">
              <span className="block"><b>ID:</b> {categoria.id}</span>
              <span className="block"><b>Descrição:</b> {categoria.description}</span>
            </div>
            <div className="flex gap-2 mt-2 justify-end">
              <ModalCategoria config={modalConfig("Editar", categoria)} params={categoria.id} />
              <ModalDeletar
                config={{
                  id: categoria.id,
                  title: "Tem certeza que deseja excluir esta categoria?",
                  description:
                    "Esta ação não pode ser desfeita. A categoria será removida permanentemente. Deseja continuar?",
                  apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/category`,
                  urlRevalidate: ["/dashboard/categoria"],
                  tags: ["reloadCategory"],
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <Paginacao data={data.category} totalRecords={data.totalRecords} />
    </div>
  );
};

const CategoriasWrapper = ({ search, page, status }: { search: string; page: string; status: string }) => (
  <Suspense fallback={<LoadSkeleton />}>
    <CategoriasList search={search} page={page} status={status} />
  </Suspense>
);

export default async function Categoria({ searchParams }: { searchParams: Promise<{ search: string; page: string; status: string }> }) {
  const { search, page, status } = await searchParams;

  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Categorias</h2>
      <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
        Gerencie as categorias e suas descrições. Adicione, edite ou exclua marcas conforme necessário.
      </p>
      <div className="flex gap-2 mb-6">
        <SearchItems />
      </div>
      <CategoriasWrapper search={search} page={page} status={status} />
      <div className="mt-5 flex justify-between">
        <ModalCategoria config={modalConfig("Adicionar")} />
      </div>
    </Container>
  );
}