import { FaTag } from "react-icons/fa";
import Container from "../components/Container";
import ButtonAdicionar from "../components/ModalGeneric";
import ModalDeletar from "../components/ModalDeletar";

export default async function Marca() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/brand`);

  if (!response.ok) {
    console.log(response)
    return <p>Ocorreu um erro ao carregar os produtos.</p>;
  }

  const marcas = await response.json();

  if (marcas.length === 0 || !marcas) {
    return (
      <div className="w-full px-8 py-10 min-h-screen bg-gray-50">
        <div className="mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">Nenhuma Marca encontrada</h2>
          <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
            No momento, não há marcas cadastradas. Você pode adicionar novas marcas clicando no botão abaixo.
            <br />
            <br />
            As marcas são importantes para categorizar e organizar os produtos ou serviços. Ao adicionar uma nova marca, informe um nome relevante e uma breve descrição para facilitar a identificação.
          </p>
          <ButtonAdicionar
            config={{
              title: "Adicionar Marca",
              description: "Preencha os campos para adicionar uma nova marca.",
              action: "Adicionar",
              fields: [
                { name: "name", label: "Nome", type: "text", placeholder: "Digite o nome da Marca" },
                { name: "description", label: "Descrição", type: "text", placeholder: "Descrição da marca" },
              ],
              apiEndpoint: `${process.env.NEXTAUTH_URL}/api/brand`,
              urlRevalidate: "/dashboard/marca",
              method: "POST",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Marcas</h2>
      <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
        Gerencie as marcas e suas descrições. Adicione, edite ou exclua marcas conforme necessário.
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
                  <ButtonAdicionar
                    config={{
                      id: marca.id,
                      title: "Adicionar Marca",
                      description: "Preencha os campos para adicionar uma nova marca.",
                      action: "Editar",
                      fields: [
                        { name: "name", label: "Nome", type: "text", placeholder: "Digite o nome da Marca" },
                        { name: "description", label: "Descrição", type: "text", placeholder: "Descrição da marca" },
                      ],
                      apiEndpoint: `${process.env.NEXTAUTH_URL}/api/brand`,
                      urlRevalidate: "/dashboard/marca",
                      method: "PUT",
                      initialValues: {
                        name: marca.name,
                        description: marca.description,
                      }
                    }}
                  />
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
        <ButtonAdicionar
          config={{
            title: "Adicionar Marca",
            description: "Preencha os campos para adicionar uma nova marca.",
            action: "Adicionar",
            fields: [
              { name: "name", label: "Nome", type: "text", placeholder: "Digite o nome da Marca" },
              { name: "description", label: "Descrição", type: "text", placeholder: "Descrição da marca" },
            ],
            apiEndpoint: `${process.env.NEXTAUTH_URL}/api/brand`,
            urlRevalidate: "/dashboard/marca",
            method: "POST",
          }}
        />
      </div>
    </Container>
  );
}
