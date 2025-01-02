import { FaList } from "react-icons/fa";
import Container from "../components/Container";
import ButtonAdicionar from "../components/ModalGeneric";
import ButtonDelete from "../faq/components/deletar";

export default async function Categoria() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/category`);

  if (!response.ok) {
    return <p>Ocorreu um erro ao carregar as marcas.</p>;
  }

  const categorias = await response.json();

  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Categorias</h2>
      <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
        Gerencie as categorias e suas descrições. Adicione, edite ou exclua marcas conforme necessário.
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
          {categorias.map((categoria: any) => (
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
                  <ButtonDelete id={categoria.id} />
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
    </Container>
  );
}
