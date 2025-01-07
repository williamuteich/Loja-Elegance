import { FaList } from "react-icons/fa";
import Container from "../components/Container";
import ButtonAdicionar from "../components/ModalGeneric";
import ModalDeletar from "../components/ModalDeletar";
import SearchItems from "../components/searchItems";
import Paginacao from "../components/Paginacao";

interface SearchParams {
  search: string;
  page: string;
}

export default async function Categoria({ searchParams }: { searchParams: SearchParams }) {
  const { search } = await searchParams;
  const { page } = await searchParams;

  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/category?${search ? `search=${search}` : ''}&page=${page || 1}`);

  if (!response.ok) {
    console.log(response);
    return <p>Ocorreu um erro ao carregar as categorias.</p>;
  }

  const { category, totalRecords } = await response.json();

  if (!category || category.length === 0) {
    return (
      <div className="w-full px-8 py-10 min-h-screen bg-gray-50">
        <div className="mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">Nenhuma Categoria encontrada.</h2>
          <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
            Não há categorias cadastradas no momento. Você pode adicionar novas categorias preenchendo os campos abaixo.
            <br />
            <br />
            A categoria pode ser qualquer grupo que você gostaria de organizar em seu site. Para que o sistema funcione corretamente, sugere-se escolher um nome que seja claro e representativo do que a categoria irá englobar.
            <br />
            <br />
            No campo "Nome", digite o nome da categoria, por exemplo: "Tecnologia", "Saúde", "Moda", entre outros.
            <br />
            No campo "Descrição", descreva brevemente o objetivo ou o conteúdo da categoria. A descrição ajudará os usuários a entender melhor o que cada categoria representa.
            <br />
            <br />
            Quando estiver pronto para adicionar, basta preencher os campos e clicar em "Adicionar".
          </p>

          <div className="mb-4">
            <SearchItems />
          </div>
          
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
      </div>
    );
  }

  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Categorias</h2>
      <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
        Gerencie as categorias e suas descrições. Adicione, edite ou exclua marcas conforme necessário.
      </p>

      <div className="mb-4">
        <SearchItems />
      </div>

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
          {category.map((categoria: any) => (
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
