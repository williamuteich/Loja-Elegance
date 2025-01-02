import { FaUser } from "react-icons/fa";
import ButtonDelete from "./components/deletar";
import ButtonEditar from "./components/editar";
import Container from "../components/Container";
import ButtonAdicionar from "../components/ModalAdicionar";

export default async function Usuarios() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, { cache: 'force-cache' });

  if (!response.ok) {
    return <p>Ocorreu um erro ao carregar os usuários.</p>;
  }

  const usuarios = await response.json();

  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Usuários</h2>
      <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
        Gerencie os usuários e suas permissões para criar e administrar conteúdo no site. Defina funções e controle o acesso de cada membro.
      </p>
      <table className="min-w-full table-auto border-collapse rounded-md border-t border-b border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[120px]">ID</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[200px]">Usuário</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[250px]">Email</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[150px]">Permissão</th>
            <th className="py-3 px-0 text-left text-sm font-medium text-gray-700 w-[200px]"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {usuarios.data.map((usuario: any) => (
            <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 font-medium text-sm text-blue-600">{usuario.id}</td>
              <td className="py-3 px-4 font-medium text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <FaUser size={22} className="text-gray-500" />
                  <span>{usuario.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 font-medium text-sm text-gray-700">{usuario.email}</td>
              <td className="py-3 px-4 font-medium text-sm text-red-700">{usuario.role}</td>
              <td className="py-3 px-0 font-medium text-sm text-gray-700">
                <div className="flex justify-end items-center space-x-3">
                  <ButtonEditar config={usuario} />
                  <ButtonDelete id={usuario.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-5 flex justify-between">
        <ButtonAdicionar
          config={{
            title: "Adicionar Produto",
            description: "Preencha os campos para adicionar um novo produto.",
            fields: [
              { name: "name", label: "Nome", type: "text", placeholder: "Digite o nome do usuário" },
              { name: "email", label: "Email", type: "text", placeholder: "Digite o e-mail" },
              {
                name: "role",
                label: "Permissão",
                type: "select",
                options: [
                  { value: "admin", label: "Admin" },
                  { value: "colaborador", label: "Colaborador" },
                ],
              },
              { name: "password", label: "Senha", type: "password", placeholder: "Digite uma Senha" },
            ],
            apiEndpoint: `${process.env.NEXTAUTH_URL}/api/user`,
            urlRevalidate: "/dashboard/usuarios",
          }}
        />
      </div>
    </Container>
  );
}
