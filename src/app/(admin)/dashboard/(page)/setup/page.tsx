import React, { Suspense } from "react";
import Container from "../components/Container";
import ModalGeneric from "../components/ModalGeneric";
import ModalDeletar from "../components/ModalDeletar";
import SearchItems from "../components/searchItems";
import Paginacao from "../../../../components/Paginacao";
import { LoadSkeleton } from "../components/loadSkeleton";
import { headers } from "next/headers";

const fetchConfig = async (search: string, page: string, status: string) => {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/privada/setup?${search ? `search=${search}&` : ''}${page ? `page=${page}&` : ''}${status ? `status=${status}` : ''}`
  );

  if (!response.ok) {
    throw new Error("Erro ao carregar as configurações.");
  }

  const data = await response.json();
  return data;
};

const ConfigList = async ({ search, page, status }: { search: string, page: string, status: string }) => {
  const data = await fetchConfig(search, page, status);

  if (data.config.length === 0 || !data.config) {
    return (
      <p className="mt-10 font-medium text-lg">Nenhuma Configuração Encontrada</p>
    );
  }

  return (
    <div>
      <p className="text-gray-700 text-base mb-3">
        <span className="font-semibold text-gray-800">Total de Configurações: </span>
        <span className="font-medium text-blue-600">{data.totalRecords}</span>
      </p>

      {/* TABELA PARA DESKTOP */}
      <table className="hidden md:table min-w-full table-auto border-collapse rounded-md border-t border-b border-gray-300">
        <thead className="bg-gray-800 text-white">
          <tr>
            {['Variável', 'Nome', 'URL', 'Valor', ''].map((header, idx) => (
              <th key={idx} className="py-3 px-4 text-left text-sm font-medium text-white">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {data.config.map((config: any) => (
            <tr key={config.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 font-medium text-sm text-gray-700">{config.type}</td>
              <td className="py-3 px-4 font-medium text-sm text-gray-700">{config.name}</td>
              <td className="py-3 px-4 font-medium text-sm text-gray-700">
                {config.url ? (
                  <a href={config.url} className="text-blue-600">{config.url}</a>
                ) : (
                  <span className="text-gray-400">URL não disponível</span>
                )}
              </td>
              <td className="py-3 px-4 font-medium text-sm text-gray-700">
                {config.value ? config.value : <span className="text-gray-400">Valor não disponível</span>}
              </td>
              <td className="py-3 px-4 font-medium text-sm text-gray-700">
                <div className="flex justify-end items-center space-x-3">
                  <ModalGeneric
                    config={{
                      id: config.id,
                      title: "Editar Configuração",
                      description: "Faça alterações na variável, nome, URL e valor abaixo.",
                      action: "Editar",
                      fields: [
                        { name: "type", label: "Variável", type: "text", placeholder: "Digite o nome da variável" },
                        { name: "name", label: "Nome", type: "text", placeholder: "Digite o nome" },
                        { name: "url", label: "URL", type: "text", placeholder: "Digite a URL" },
                        { name: "value", label: "Valor", type: "text", placeholder: "Digite o valor" },
                      ],
                      apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/setup`,
                      urlRevalidate: "/dashboard/setup",
                      method: "PUT",
                      initialValues: {
                        type: config.type,
                        name: config.name,
                        url: config.url,
                        value: config.value,
                      },
                    }}
                    params={config.id}
                  />
                  <ModalDeletar
                    config={{
                      id: config.id,
                      title: "Tem certeza de que deseja excluir essa variável?",
                      description:
                        "Esta ação irá remover permanentemente a variável do seu site. Isso pode afetar a configuração do seu site, como URLs ou nomes, e pode causar erros em partes do sistema que dependem dessa variável. Certifique-se de que não há dependências antes de prosseguir com a exclusão.",
                      apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/setup`,
                      urlRevalidate: "/dashboard/setup",
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
        {data.config.map((config: any) => (
          <div key={config.id} className="bg-white rounded-lg shadow border p-4 flex flex-col gap-2">
            <div className="text-gray-800 text-sm mb-2">
              <span className="block"><b>Variável:</b> {config.type}</span>
              <span className="block"><b>Nome:</b> {config.name}</span>
              <span className="block"><b>URL:</b> {config.url ? (
                <a href={config.url} className="text-blue-600 break-all">{config.url}</a>
              ) : (
                <span className="text-gray-400">URL não disponível</span>
              )}</span>
              <span className="block"><b>Valor:</b> {config.value ? config.value : <span className="text-gray-400">Valor não disponível</span>}</span>
            </div>
            <div className="flex gap-2 mt-2 justify-end">
              <ModalGeneric
                config={{
                  id: config.id,
                  title: "Editar Configuração",
                  description: "Faça alterações na variável, nome, URL e valor abaixo.",
                  action: "Editar",
                  fields: [
                    { name: "type", label: "Variável", type: "text", placeholder: "Digite o nome da variável" },
                    { name: "name", label: "Nome", type: "text", placeholder: "Digite o nome" },
                    { name: "url", label: "URL", type: "text", placeholder: "Digite a URL" },
                    { name: "value", label: "Valor", type: "text", placeholder: "Digite o valor" },
                  ],
                  apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/setup`,
                  urlRevalidate: "/dashboard/setup",
                  method: "PUT",
                  initialValues: {
                    type: config.type,
                    name: config.name,
                    url: config.url,
                    value: config.value,
                  },
                }}
                params={config.id}
              />
              <ModalDeletar
                config={{
                  id: config.id,
                  title: "Tem certeza de que deseja excluir essa variável?",
                  description:
                    "Esta ação irá remover permanentemente a variável do seu site. Isso pode afetar a configuração do seu site, como URLs ou nomes, e pode causar erros em partes do sistema que dependem dessa variável. Certifique-se de que não há dependências antes de prosseguir com a exclusão.",
                  apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/setup`,
                  urlRevalidate: "/dashboard/setup",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <Paginacao
        data={data.config}
        totalRecords={data.totalRecords}
      />
    </div>
  );
};

const ConfigWrapper = ({ search, page, status }: { search: string, page: string, status: string }) => (
  <Suspense fallback={<LoadSkeleton />}>
    <ConfigList search={search} page={page} status={status} />
  </Suspense>
);

export default async function Settings({ searchParams }: { searchParams: Promise<{ search: string, page: string, status: string }> }) {
  const { search, page, status } = await searchParams;

  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Configurações Gerais</h2>
      <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
        Gerencie as variáveis do seu site, como URLs e nomes. As alterações feitas aqui são aplicadas globalmente, sem necessidade de alterar o código.
      </p>

      <div className="flex gap-2 mb-4">
        <SearchItems />
      </div>

      <ConfigWrapper search={search} page={page} status={status} />

      <div className="mt-5 flex justify-between">
        <ModalGeneric
          config={{
            title: "Adicionar nova variável",
            description:
              "Preencha os campos abaixo para adicionar uma nova variável com seu respectivo nome e valor. Esses dados serão utilizados para personalizar a configuração do seu site.",
            action: "Adicionar",
            fields: [
              { name: "type", label: "Variável", type: "text", placeholder: "Digite o nome da variável" },
              { name: "name", label: "Nome", type: "text", placeholder: "Digite o nome" },
              { name: "url", label: "URL", type: "text", placeholder: "Digite a URL" },
              { name: "value", label: "Valor", type: "text", placeholder: "Digite o valor" },
            ],
            apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/setup`,
            urlRevalidate: "/dashboard/setup",
            method: "POST",
          }}
        />
      </div>
    </Container>
  );
}
