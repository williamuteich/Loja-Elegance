
import React, { Suspense } from "react";
import { FaUser } from "react-icons/fa";
import Container from "../components/Container";
import ButtonAdicionar from "../components/ModalGeneric";
import ModalDeletar from "../components/ModalDeletar";
import Paginacao from "../../../../components/Paginacao";
import SearchItems from "../components/searchItems";
import { LoadSkeleton } from "../components/loadSkeleton";
import TableMobile from "./components/tableMobile";
import { FiltroBuscarItem } from "../components/FiltroBuscarItem";
import { FieldConfig } from "@/utils/types/fieldConfig";

const userFields: FieldConfig[] = [
  { name: "name", label: "Nome", type: "text", placeholder: "Digite o nome do usuário" },
  { name: "email", label: "Email", type: "text", placeholder: "Digite o e-mail" },
  {
    name: "role",
    label: "Permissão",
    type: "select",
    options: [
      { value: "user", label: "User" },
      { value: "admin", label: "Admin" },
    ],
  },
  {
    name: "active",
    label: "Status de Usuário",
    type: "select",
    options: [
      { value: "true", label: "Ativo" },
      { value: "false", label: "Inativo" },
    ],
  },
  { name: "password", label: "Senha", type: "password", placeholder: "Digite uma Senha" },
];

const createButtonConfig = (action: string, userId?: string, initialValues?: any) => ({
  id: userId || "",
  title: `${action} Usuário`,
  description: `Preencha os campos para ${action.toLowerCase()} as informações do usuário.`,
  action,
  fields: userFields,
  apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/user`,
  urlRevalidate: ["/dashboard/usuarios"],
  method: action === "Adicionar" ? "POST" : "PUT",
  initialValues,
});

import { cookies } from "next/headers";

const fetchUsuarios = async (search: string, page: string, status: string) => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/privada/user?${search ? `search=${search}&` : ''}${page ? `page=${page}&` : ''}${status ? `status=${status}` : ''}`,
    {
      headers: {
        Cookie: cookieHeader,
      },
    }
  );

  if (!response.ok) {
    console.log("Erro ao carregar os dados.");
  }

  const data = await response.json();
  return data;
};

const UsuariosList = async ({ search, page, status }: { search: string, page: string, status: string }) => {
  const data = await fetchUsuarios(search, page, status);

  if (!data.usuarios || data.usuarios.length === 0) {
    return (
      <>
        <p className="mt-10 font-medium text-lg">Nenhum Usuário Encontrado</p>
      </>
    );
  }

  return (
    <div>
      <p className="text-gray-700 text-base mb-3">
        <span className="font-semibold text-gray-800">Total de Usuários: </span>
        <span className="font-medium text-blue-600">{data.totalRecords}</span>
      </p>

      <div className="hidden xl:block">
        <table className="min-w-full table-auto border-collapse rounded-md border-t border-b border-gray-300">
          <thead className="bg-gray-800 text-white">
            <tr>
              {['ID', 'Usuario', 'Email', 'Permissão', 'Status', ''].map((header, idx) => (
                <th key={idx} className="py-3 px-4 text-left text-sm font-medium text-white">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {data.usuarios.map((usuario: any) => (
              <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-medium text-sm text-blue-600">{usuario.id}</td>
                <td className="py-3 px-4 font-medium text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <FaUser size={22} className="text-gray-500" />
                    <span>{usuario.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-medium text-sm text-gray-700">{usuario.email}</td>
                <td className="py-3 px-4 font-medium text-sm text-blue-700">{usuario.role ? usuario.role : "User"}</td>
                <td className="py-3 px-4 font-medium text-sm text-red-700">
                  <span className={Boolean(usuario.active) ? "text-green-700" : "text-red-600"}>
                    {Boolean(usuario.active) ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="py-3 px-0 font-medium text-sm text-gray-700">
                  <div className="flex justify-end items-center space-x-3">
                    <ButtonAdicionar
                      config={createButtonConfig("Editar", usuario.id, {
                        name: usuario.name,
                        email: usuario.email,
                        role: usuario.role,
                        status: usuario.active,
                      })}
                      params={usuario.id}
                    />
                    <ModalDeletar
                      config={{
                        id: usuario.id,
                        title: "Tem certeza de que deseja excluir esse usuário?",
                        description: "Esta ação não pode ser desfeita. O usuário será excluído permanentemente.",
                        apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/user`,
                        urlRevalidate: ["/dashboard/usuarios"],
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TableMobile data={data} createButtonConfig={createButtonConfig} />

      <Paginacao
        totalRecords={data.totalRecords} data={[]} />
    </div>
  );
};

const UsuariosWrapper = ({ search, page, status }: { search: string, page: string, status: string }) => {
  return (
    <Suspense fallback={<LoadSkeleton />}>
      <UsuariosList search={search} page={page} status={status} />
    </Suspense>
  );
};

export default async function Usuarios({ searchParams }: { searchParams: Promise<{ search: string, page: string, status: string }> }) {
  const { search, page, status } = await searchParams;

  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Usuários</h2>
      <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
        Gerencie os usuários e suas permissões para criar e administrar conteúdo no site. Defina funções e controle o acesso de cada membro.
      </p>
      <div className="flex gap-2 mb-6">
        <SearchItems />
        <FiltroBuscarItem />
      </div>
      <UsuariosWrapper search={search} page={page} status={status} />
      <div className="mt-5 flex justify-between">
        <ButtonAdicionar
          config={createButtonConfig("Adicionar")}
        />
      </div>
    </Container>
  );
}
