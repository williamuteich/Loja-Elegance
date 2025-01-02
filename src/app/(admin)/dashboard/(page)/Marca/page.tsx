import { FaTag } from "react-icons/fa";
import Container from "../components/Container";
import ButtonAdicionar from "../components/ModalAdicionar";
import ButtonDelete from "../faq/components/deletar";
import ButtonEditar from "../faq/components/editar";

export default async function Marca() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/brand`);

  if (!response.ok) {
    return <p>Ocorreu um erro ao carregar as marcas.</p>;
  }

  const marcas = await response.json();

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
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[calc(100%-275px)]">Descrição</th>
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
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-5 flex justify-between">
        <ButtonAdicionar
          config={{
            title: "Adicionar Marca",
            description: "Preencha os campos para adicionar uma nova marca.",
            fields: [
              { name: "name", label: "Nome", type: "text", placeholder: "Digite o nome da Marca" },
              { name: "description", label: "Descrição", type: "text", placeholder: "Descrição da marca" },
            ],
            apiEndpoint: `${process.env.NEXTAUTH_URL}/api/brand`,
            urlRevalidate: "/dashboard/marca",
          }}
        />
      </div>
    </Container>
  );
}
