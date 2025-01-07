import { FaUser } from "react-icons/fa";
import Container from "../components/Container";
import ButtonAdicionar from "../components/ModalGeneric";
import ModalDeletar from "../components/ModalDeletar";
import Paginacao from "../components/Paginacao";
import SearchItems from "../components/searchItems";

interface SearchParams {
  search: string;
  page: string;
}

export default async function Usuarios({ searchParams }: { searchParams: SearchParams }) {
  const { search } = await searchParams;
  const { page } = await searchParams;

  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user?${search ? `search=${search}` : page ? `page=${page}` : ''}`);

  if (!response.ok) {
    console.log(response)
    return <p>Ocorreu um erro ao carregar os produtos.</p>;
  }

  const { usuarios, totalRecords } = await response.json();

  if (usuarios.length === 0 || !usuarios) {
    return (
      <Container>
        <h2 className="text-3xl font-semibold mb-3 text-gray-800 text-center">Sem Usuários Cadastrados</h2>
        <p className="text-gray-600 mb-10 text-sm leading-[1.6] text-center">
          Atualmente, não há usuários cadastrados. Adicione um usuário para começar a gerenciar as permissões.
        </p>

        <div className="mb-4">
          <SearchItems />
        </div>
        
        <div className="mt-5 w-full flex justify-end">
          <ButtonAdicionar
            config={{
              id: "",
              title: "Adicionar Usuário",
              description: "Preencha os campos para adicionar um novo Usuário.",
              action: "Adicionar",
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
              method: "POST",
            }}
          />
        </div>
      </Container>
    );
  }


  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Usuários</h2>
      <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
        Gerencie os usuários e suas permissões para criar e administrar conteúdo no site. Defina funções e controle o acesso de cada membro.
      </p>

      <div className="mb-4">
        <SearchItems />
      </div>

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
          {usuarios.map((usuario: any) => (
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
                  <ButtonAdicionar
                    config={{
                      id: usuario.id,
                      title: "Editar Usuário",
                      description: "Preencha os campos para adicionar um novo produto.",
                      action: "Editar",
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
                      method: "PUT",
                      initialValues: {
                        name: usuario.name,
                        email: usuario.email,
                        role: usuario.role,
                        passowrd: usuario.password,
                      }
                    }}
                  />
                  <ModalDeletar
                    config={{
                      id: usuario.id,
                      title: "Tem certeza de que deseja excluir esse usuário?",
                      description:
                        "Esta ação não pode ser desfeita. O usuário será excluído permanentemente.",
                      apiEndpoint: `${process.env.NEXTAUTH_URL}/api/user`,
                      urlRevalidate: "/dashboard/usuarios",
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
            id: "",
            title: "Adicionar Usuário",
            description: "Preencha os campos para adicionar um novo Usuário.",
            action: "Adicionar",
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
            method: "POST",
          }}
        />
      </div>
      <Paginacao data={usuarios} totalRecords={totalRecords} />
    </Container>
  );
}
