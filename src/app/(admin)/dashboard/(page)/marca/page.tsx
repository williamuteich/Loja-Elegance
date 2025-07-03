import { FaTag } from "react-icons/fa";
import Container from "../components/Container";
import ButtonAdicionar from "../components/ModalGeneric";
import ModalDeletar from "../components/ModalDeletar";
import SearchItems from "../components/searchItems";
import Paginacao from "../../../../components/Paginacao";
import { Suspense } from "react";
import { LoadSkeleton } from "../components/loadSkeleton";
import type { Marca } from "@/utils/types/marca";
import { FieldConfig } from "@/utils/types/fieldConfig";

const modalConfig = (action: string, initialValues?: Marca) => {
  const initialValuesFormatted: { [key: string]: string } | undefined = initialValues
    ? { name: initialValues.name, description: initialValues.description }
    : undefined;

  return {
    title: `${action} Marca`,
    description: action === "Adicionar"
      ? "Preencha os campos abaixo para adicionar uma nova marca."
      : "Faça alterações na marca abaixo.",
    action,
    fields: [
      { name: "name", label: "Nome", type: "text", placeholder: "Digite o nome da Marca" },
      { name: "description", label: "Descrição", type: "text", placeholder: "Descrição da marca" },
    ] as FieldConfig[],
    apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/brand`,
    urlRevalidate: ["/dashboard/marca"],
    method: action === "Adicionar" ? "POST" : "PUT",
    initialValues: initialValuesFormatted,
  };
};

const fetchMarcas = async (search: string, page: string, status: string) => {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/privada/brand?${search ? `search=${search}&` : ''}${page ? `page=${page}&` : ''}${status ? `status=${status}` : ''}`, { cache: "force-cache" }
  );

  if (!response.ok) {
    throw new Error("Erro ao carregar as marcas.");
  }

  const data = await response.json();
  return data;
};

const MarcasList = async ({ search, page, status }: { search: string, page: string, status: string }) => {
  const { marcas, totalRecords } = await fetchMarcas(search, page, status);

  if (marcas.length === 0 || !marcas) {
    return (
      <>
        <p className="mt-10 font-medium text-lg">Nenhuma Marca Encontrada</p>
        <div className="mt-5 flex justify-between">
          <ButtonAdicionar config={modalConfig("Adicionar")} />
        </div>
      </>
    );
  }

  return (
    <div>
      <p className="text-gray-700 text-base mb-3">
        <span className="font-semibold text-gray-800">Total de Marcas: </span>
        <span className="font-medium text-blue-600">{totalRecords}</span>
      </p>
      {/* TABELA PARA DESKTOP */}
      <table className="hidden md:table min-w-full table-auto border-collapse rounded-md border-t border-b border-gray-300">
        <thead className="text-white bg-gray-800">
          <tr>
            {['ID', 'Nome', 'Descrição', ''].map((header, idx) => (
              <th key={idx} className="py-3 px-4 text-left text-sm font-medium text-white">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {marcas.map((marca: Marca) => (
            <tr key={marca.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 font-medium text-sm text-blue-600">{marca.id}</td>
              <td className="py-3 px-4 font-medium text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <FaTag size={22} className="text-gray-500" />
                  <span>{marca.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 font-medium text-sm text-gray-700">{marca.description}</td>
              <td className="py-3 px-0 font-medium text-sm text-gray-700">
                <div className="flex justify-end items-center space-x-3">
                  <ButtonAdicionar config={modalConfig("Editar", marca)} params={marca.id} />
                  <ModalDeletar
                    config={{
                      id: marca.id,
                      title: "Tem certeza que deseja excluir esta marca?",
                      description: "Esta ação não pode ser desfeita. A marca será removida permanentemente. Deseja continuar?",
                      apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/brand`,
                      urlRevalidate: ["/dashboard/marca"],
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
        {marcas.map((marca: Marca) => (
          <div key={marca.id} className="bg-white rounded-lg shadow border p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <FaTag size={22} className="text-gray-500" />
              <span className="font-semibold text-blue-700">{marca.name}</span>
            </div>
            <div className="text-gray-800 text-sm mb-2">
              <span className="block"><b>ID:</b> {marca.id}</span>
              <span className="block"><b>Descrição:</b> {marca.description}</span>
            </div>
            <div className="flex gap-2 mt-2 justify-end">
              <ButtonAdicionar config={modalConfig("Editar", marca)} params={marca.id} />
              <ModalDeletar
                config={{
                  id: marca.id,
                  title: "Tem certeza que deseja excluir esta marca?",
                  description: "Esta ação não pode ser desfeita. A marca será removida permanentemente. Deseja continuar?",
                  apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/brand`,
                  urlRevalidate: ["/dashboard/marca"],
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-between">
        <ButtonAdicionar config={modalConfig("Adicionar")} />
      </div>
      <Paginacao data={marcas} totalRecords={totalRecords} />
    </div>
  );
};

const MarcasWrapper = ({ search, page, status }: { search: string, page: string, status: string }) => {
  return (
    <Suspense fallback={<LoadSkeleton />}>
      <MarcasList search={search} page={page} status={status} />
    </Suspense>
  );
};

export default async function Marca({ searchParams }: { searchParams: Promise<{ search: string, page: string, status: string }> }) {
  const { search, page, status } = await searchParams;

  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Marcas</h2>
      <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
        Gerencie as marcas e suas descrições. Adicione, edite ou exclua marcas conforme necessário.
      </p>
      <div className="flex gap-2 mb-6">
        <SearchItems />
      </div>
      <MarcasWrapper search={search} page={page} status={status} />
    </Container>
  );
}
