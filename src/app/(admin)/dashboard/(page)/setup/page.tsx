import Link from "next/link";
import Container from "../components/Container";
import ModalGeneric from "../components/ModalGeneric";
import ModalDeletar from "../components/ModalDeletar";
import SearchItems from "../components/searchItems";
import Paginacao from "../components/Paginacao";
import { FiltroBuscarItem } from "../components/FiltroBuscarItem";


export default async function Settings({ searchParams }: { searchParams: Promise<{ search: string, page: string, status: string }> }) {

  const { search, page, status } = await searchParams;

  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/setup?${search ? `search=${search}&` : ''}${page ? `page=${page}&` : ''}${status ? `status=${status}` : ''}`);

  if (!response.ok) {
    console.log(response);
    return <p>Ocorreu um erro ao carregar os produtos.</p>;
  }

  const { config, totalRecords } = await response.json();

  if (config.length === 0 || !config) {
    return (
      <Container>
        <h2 className="text-3xl font-semibold mb-3 text-gray-800">Configurações Gerais</h2>
        <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
          Gerencie as variáveis do seu site, como URLs e nomes. As alterações feitas aqui são aplicadas globalmente, sem necessidade de alterar o código.
        </p>
        <div className="flex gap-2 mb-4">
          <SearchItems />
          <FiltroBuscarItem />
        </div>
        <p className="mt-10 font-medium text-lg">Nenhuma Configuração Encontrada</p>
        <ModalGeneric
          config={{
            title: "Adicionar Pergunta Frequente",
            description:
              "Preencha os campos abaixo para adicionar uma nova pergunta frequente à plataforma.",
            action: "Adicionar",
            fields: [
              { name: "type", label: "Variável", type: "text", placeholder: "Digite o nome da variável" },
              { name: "name", label: "Nome", type: "text", placeholder: "Digite o nome" },
              { name: "url", label: "URL", type: "text", placeholder: "Digite a URL" },
              { name: "value", label: "Valor", type: "text", placeholder: "Digite o valor" },
            ],
            apiEndpoint: `${process.env.NEXTAUTH_URL}/api/faq`,
            urlRevalidate: "/dashboard/faq",
            method: "POST",
          }}
        />
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Configurações Gerais</h2>
      <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
        Gerencie as variáveis do seu site, como URLs e nomes. As alterações feitas aqui são aplicadas globalmente, sem necessidade de alterar o código.
      </p>

      <div className="flex gap-2 mb-6">
        <SearchItems />
        <FiltroBuscarItem />
      </div>
      <p className="text-gray-700 text-base mb-3">
        <span className="font-semibold text-gray-800">Total de Categorias: </span>
        <span className="font-medium text-blue-600">{totalRecords}</span>
      </p>
      <table className="min-w-full table-auto border-collapse rounded-md border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-4 border border-slate-300 text-left text-sm font-medium text-gray-700 w-[180px]">Variável</th>
            <th className="py-3 px-4 border border-slate-300 text-left text-sm font-medium text-gray-700 w-[180px]">Nome</th>
            <th className="py-3 px-4 border border-slate-300 text-left text-sm font-medium text-gray-700">URL</th>
            <th className="py-3 px-4 border border-slate-300 text-left text-sm font-medium text-gray-700">Valor</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {config.map((config: any) => (
            <tr key={config.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 font-medium text-sm text-gray-700 border border-gray-300">{config.type}</td>
              <td className="py-3 px-4 font-medium text-sm text-gray-700 border border-gray-300">{config.name}</td>

              <td className="py-3 px-4 font-medium text-sm text-gray-700 border border-gray-300">
                {config.url ? (
                  <Link href={config.url} className="text-blue-600">
                    {config.url}
                  </Link>
                ) : (
                  <span className="text-gray-400">URL não disponível</span>
                )}
              </td>

              <td className="py-3 px-4 font-medium text-sm text-gray-700 border border-gray-300">
                <div className="flex items-center space-x-3">
                  <span className="w-full p-2 border border-gray-300 rounded-md text-gray-700 truncate">
                    {config.value ? config.value : <span className="text-gray-400">Valor não disponível</span>}
                  </span>
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
                      apiEndpoint: `${process.env.NEXTAUTH_URL}/api/setup`,
                      urlRevalidate: "/dashboard/setup",
                      method: "PUT",
                      initialValues: {
                        type: config.type,
                        name: config.name,
                        url: config.url,
                        value: config.value,
                      },
                    }}
                  />
                  <ModalDeletar
                    config={{
                      id: config.id,
                      title: "Tem certeza de que deseja excluir essa variável?",
                      description:
                        "Esta ação irá remover permanentemente a variável do seu site. Isso pode afetar a configuração do seu site, como URLs ou nomes, e pode causar erros em partes do sistema que dependem dessa variável. Certifique-se de que não há dependências antes de prosseguir com a exclusão.",
                      apiEndpoint: `${process.env.NEXTAUTH_URL}/api/setup`,
                      urlRevalidate: "/dashboard/setup",
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-5 flex justify-between">
        <ModalGeneric
          config={{
            title: "Adicionar novo conteúdo",
            description:
              "Preencha os campos abaixo para adicionar uma nova variável com seu respectivo nome e valor. Esses dados serão utilizados para personalizar a configuração do seu site.",
            action: "Adicionar",
            fields: [
              { name: "type", label: "Variável", type: "text", placeholder: "Digite o nome da variável" },
              { name: "name", label: "Nome", type: "text", placeholder: "Digite o nome" },
              { name: "url", label: "URL", type: "text", placeholder: "Digite a URL" },
              { name: "value", label: "Valor", type: "text", placeholder: "Digite o valor" },
            ],
            apiEndpoint: `${process.env.NEXTAUTH_URL}/api/setup`,
            urlRevalidate: "/dashboard/setup",
            method: "POST",
          }}
        />
      </div>
      <Paginacao data={config} totalRecords={totalRecords} />
    </Container>
  );
}
