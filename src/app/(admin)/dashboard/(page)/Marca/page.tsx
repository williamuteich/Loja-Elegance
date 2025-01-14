import { FaTag } from "react-icons/fa";
import Container from "../components/Container";
import ButtonAdicionar from "../components/ModalGeneric";
import ModalDeletar from "../components/ModalDeletar";
import SearchItems from "../components/searchItems";
import Paginacao from "../components/Paginacao";
import { FiltroBuscarItem } from "../components/FiltroBuscarItem";

interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "email" | "select" | "password";  
  placeholder: string;
}

interface Marca {
  id: string;
  name: string;
  description: string;
}

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
    apiEndpoint: `${process.env.NEXTAUTH_URL}/api/brand`,
    urlRevalidate: "/dashboard/marca",
    method: action === "Adicionar" ? "POST" : "PUT",
    initialValues: initialValuesFormatted,
  };
};

export default async function Marca({ searchParams }: { searchParams: Promise<{ search: string, page: string, status: string }> }) {
  const { search, page, status } = await searchParams;

  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/brand?${search ? `search=${search}&` : ''}${page ? `page=${page}&` : ''}${status ? `status=${status}` : ''}`
  );

  if (!response.ok) return <p>Ocorreu um erro ao carregar as marcas.</p>;

  const { marcas, totalRecords } = await response.json();

  if (marcas.length === 0 || !marcas) {
    return (
      <Container>
        <h2 className="text-3xl font-semibold mb-3 text-gray-800">Marcas</h2>
        <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
          Gerencie as marcas e suas descrições. Adicione, edite ou exclua marcas conforme necessário.
        </p>
        <div className="flex gap-2 mb-6">
          <SearchItems />
          <FiltroBuscarItem />
        </div>
        <p className="mt-10 font-medium text-lg">Nenhuma Marca Encontrada</p>
        <ButtonAdicionar config={modalConfig("Adicionar")} />
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Marcas</h2>
      <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
        Gerencie as marcas e suas descrições. Adicione, edite ou exclua marcas conforme necessário.
      </p>
      <div className="flex gap-2 mb-6">
        <SearchItems />
        <FiltroBuscarItem />
      </div>
      <p className="text-gray-700 text-base mb-3">
        <span className="font-semibold text-gray-800">Total de Marcas: </span>
        <span className="font-medium text-blue-600">{totalRecords}</span>
      </p>
      <table className="min-w-full table-auto border-collapse rounded-md border-t border-b border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[315px]">ID</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[210px]">Nome</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[calc(100%-255px)]">Descrição</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[calc(210px)]"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {marcas.map((marca: any) => (
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
                  <ButtonAdicionar config={modalConfig("Editar", marca)} />
                  <ModalDeletar
                    config={{
                      id: marca.id,
                      title: "Tem certeza que deseja excluir esta marca?",
                      description: "Esta ação não pode ser desfeita. A marca será removida permanentemente. Deseja continuar?",
                      apiEndpoint: `${process.env.NEXTAUTH_URL}/api/brand`,
                      urlRevalidate: "/dashboard/marca",
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-5 flex justify-between">
        <ButtonAdicionar config={modalConfig("Adicionar")} />
      </div>
      <Paginacao data={marcas} totalRecords={totalRecords} />
    </Container>
  );
}
