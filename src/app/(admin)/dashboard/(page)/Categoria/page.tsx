import { FaList } from "react-icons/fa";
import Container from "../components/Container";
import ButtonAdicionar from "../components/ModalGeneric";
import ModalDeletar from "../components/ModalDeletar";
import SearchItems from "../components/searchItems";
import Paginacao from "../components/Paginacao";
import { FiltroBuscarItem } from "../components/FiltroBuscarItem";

interface SearchParams {
  search: string;
  page: string;
  status: string;
}

interface Categoria {
  id: string;
  name: string;
  description: string;
}

interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "select" | "email" | "password";
  placeholder: string;
}

const modalConfig = (action: string, initialValues?: Categoria) => {
  const initialValuesFormatted: { [key: string]: string } | undefined = initialValues
    ? { name: initialValues.name, description: initialValues.description }
    : undefined;

  return {
    title: `${action} Categoria`,
    description: action === "Adicionar"
      ? "Preencha os campos abaixo para adicionar uma nova categoria."
      : "Faça alterações na categoria abaixo.",
    action,
    fields: [
      { name: "name", label: "Nome", type: "text", placeholder: "Digite o nome da Categoria" },
      { name: "description", label: "Descrição", type: "text", placeholder: "Descrição da categoria" },
    ] as FieldConfig[],
    apiEndpoint: `${process.env.NEXTAUTH_URL}/api/category`,
    urlRevalidate: "/dashboard/categoria",
    method: action === "Adicionar" ? "POST" : "PUT",
    initialValues: initialValuesFormatted,
  };
};

export default async function Categoria({ searchParams }: { searchParams: SearchParams }) {
  const { search, page, status } = await searchParams;

  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/category?${search ? `search=${search}&` : ''}${page ? `page=${page}&` : ''}${status ? `status=${status}` : ''}`);

  if (!response.ok) {
    console.log(response);
    return <p>Ocorreu um erro ao carregar as categorias.</p>;
  }

  const { category, totalRecords } = await response.json();

  if (!category || category.length === 0) {
    return (
      <Container>
        <h2 className="text-3xl font-semibold mb-3 text-gray-800">Categorias</h2>
        <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
          Gerencie as categorias e suas descrições. Adicione, edite ou exclua marcas conforme necessário.
        </p>
        <div className="flex gap-2 mb-6">
          <SearchItems />
          <FiltroBuscarItem />
        </div>
        <p className="mt-10 font-medium text-lg">Nenhuma Marca Encontrada</p>
        <ButtonAdicionar
          config={{
            title: "Adicionar categoria",
            description: "Preencha os campos para adicionar uma nova categoria.",
            action: "Adicionar",
            fields: [
              { name: "name", label: "Nome", type: "text", placeholder: "Digite o nome da categoria" },
              { name: "description", label: "Descrição", type: "text", placeholder: "Descrição da categoria" },
            ],
            apiEndpoint: `${process.env.NEXTAUTH_URL}/api/category`,
            urlRevalidate: "/dashboard/categoria",
            method: "POST",
          }}
        />
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Categorias</h2>
      <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
        Gerencie as categorias e suas descrições. Adicione, edite ou exclua marcas conforme necessário.
      </p>

      <div className="flex gap-2 mb-6">
        <SearchItems />
        <FiltroBuscarItem />
      </div>
      <p className="text-gray-700 text-base mb-3">
        <span className="font-semibold text-gray-800">Total de Categorias: </span>
        <span className="font-medium text-blue-600">{totalRecords}</span>
      </p>
      <table className="min-w-full table-auto border-collapse rounded-md border-t border-b border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[315px]">ID</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[210px]">Nome</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[calc(100%-275px)]">Descrição</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[calc(210px)]"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {category.map((categoria: Categoria) => (
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
                  <ButtonAdicionar
                    config={{
                      id: categoria.id,
                      title: "Adicionar Categoria",
                      description: "Preencha os campos para adicionar uma nova categoria.",
                      action: "Editar",
                      fields: [
                        { name: "name", label: "Nome", type: "text", placeholder: "Digite o nome da Categoria" },
                        { name: "description", label: "Descrição", type: "text", placeholder: "Descrição da categoria" },
                      ],
                      apiEndpoint: `${process.env.NEXTAUTH_URL}/api/category`,
                      urlRevalidate: "/dashboard/categoria",
                      method: "PUT",
                      initialValues: {
                        name: categoria.name,
                        description: categoria.description,
                      }
                    }}
                  />
                  <ModalDeletar
                    config={{
                      id: categoria.id,
                      title: "Tem certeza que deseja excluir esta categoria?",
                      description: "Esta ação não pode ser desfeita. A categoria será removida permanentemente. Deseja continuar?",
                      apiEndpoint: `${process.env.NEXTAUTH_URL}/api/category`,
                      urlRevalidate: "/dashboard/categoria",
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-5 flex justify-between">
        <ButtonAdicionar
          config={{
            title: "Adicionar categoria",
            description: "Preencha os campos para adicionar uma nova categoria.",
            action: "Adicionar",
            fields: [
              { name: "name", label: "Nome", type: "text", placeholder: "Digite o nome da categoria" },
              { name: "description", label: "Descrição", type: "text", placeholder: "Descrição da categoria" },
            ],
            apiEndpoint: `${process.env.NEXTAUTH_URL}/api/category`,
            urlRevalidate: "/dashboard/categoria",
            method: "POST",
          }}
        />
      </div>
      <Paginacao data={category} totalRecords={totalRecords} />
    </Container>
  );
}
