import Link from "next/link";
import Container from "../components/Container";
import ModalGeneric from "../components/ModalGeneric";
import ModalDeletar from "../components/ModalDeletar";
import SearchItems from "../components/searchItems";
import Paginacao from "../components/Paginacao";

interface SearchParams {
  search: string;
  page: string;
}

export default async function Settings({ searchParams }: { searchParams: SearchParams }) {
  const { search } = await searchParams;
  const { page } = await searchParams;

  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/setup?${search ? `search=${search}` : page ? `page=${page}` : ''}`);

  if (!response.ok) {
    console.log(response);
    return <p>Ocorreu um erro ao carregar os produtos.</p>;
  }

  const { config, totalRecords } = await response.json();

  if (config.length === 0 || !config) {
    return (
      <div className="w-full px-8 py-10 min-h-screen bg-gray-50">
        <div className="mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">
            Nenhuma Configuração Encontrada
          </h2>
          <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
            Gerencie as variáveis do seu site, como URLs e nomes. As alterações feitas aqui são aplicadas globalmente, sem necessidade de alterar o código.
            <br />
            <br />
            No campo "Variável", para criar variáveis de redes sociais, o padrão deve ser "redeSocial", e para variáveis de contatos, o padrão deve ser "contato".
            Isso garante consistência e facilita a organização.
          </p>
          <div className="mb-4">
            <SearchItems />
          </div>

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
        </div>
      </div>
    );
  }

  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Configurações Gerais</h2>
      <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
        Gerencie as variáveis do seu site, como URLs e nomes. As alterações feitas aqui são aplicadas globalmente, sem necessidade de alterar o código.
        <br />
        <br />
        No campo "Variável", para criar variáveis de redes sociais, o padrão deve ser "redeSocial", e para variáveis de contatos, o padrão deve ser "contato".
        Isso garante consistência e facilita a organização.
      </p>

      <div className="mb-4">
        <SearchItems />
      </div>

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
