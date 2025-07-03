import { FaInstagram } from "react-icons/fa";
import Container from "../components/Container";
import { Suspense } from "react";
import { LoadSkeleton } from "../components/loadSkeleton";
import { FieldConfig } from "@/utils/types/fieldConfig";
import ButtonAdicionar from "../components/ModalGeneric";
import ModalDeletar from "../components/ModalDeletar";
import Paginacao from "@/app/components/Paginacao";
import SearchItems from "../components/searchItems";

const modalConfig = (action: string, initialValues?: any) => {
  const initialValuesFormatted: { [key: string]: string } | undefined = initialValues
    ? {
        title: initialValues.title,
        link: initialValues.link
      }
    : undefined;

  return {
    title: `${action} Post do Instagram`,
    description: action === "Adicionar"
      ? "Preencha os campos abaixo para adicionar um novo post."
      : "Faça alterações no post abaixo.",
    action,
    fields: [
      { name: "title", label: "Título", type: "text", placeholder: "Título do post" },
      { name: "link", label: "Link", type: "url", placeholder: "URL do post no Instagram" },
    ] as FieldConfig[],
    apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/instaEmbed`,
    urlRevalidate: ["/dashboard/instagram"],
    method: action === "Adicionar" ? "POST" : "PUT",
    initialValues: initialValuesFormatted,
  };
};

const fetchInstagramPosts = async (search: string, page: string, status: string) => {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/privada/instaEmbed?${search ? `search=${search}&` : ''}${page ? `page=${page}&` : ''}${status ? `status=${status}` : ''}`,
    {
      cache: "force-cache"
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao carregar os posts.");
  }

  const data = await response.json();
  return data;
};

const InstagramList = async ({ search, page, status }: { search: string, page: string, status: string }) => {
  const { posts, totalRecords } = await fetchInstagramPosts(search, page, status);

  if (posts.length === 0 || !posts) {
    return (
      <>
        <p className="mt-10 font-medium text-lg">Nenhum Post Encontrado</p>
        <div className="mt-5 flex justify-between">
          <ButtonAdicionar config={modalConfig("Adicionar")} />
        </div>
      </>
    );
  }

  return (
    <div>
      <p className="text-gray-700 text-base mb-3">
        <span className="font-semibold text-gray-800">Total de Posts: </span>
        <span className="font-medium text-blue-600">{totalRecords}</span>
      </p>

      {/* TABELA PARA DESKTOP */}
      <table className="hidden md:table min-w-full table-auto border-collapse rounded-md border-t border-b border-gray-300">
        <thead className="text-white bg-gray-800">
          <tr>
            {['Título', 'Link', ''].map((header, idx) => (
              <th key={idx} className="py-3 px-4 text-left text-sm font-medium text-white">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {posts.map((post: { id: string; title: string; link: string }) => (
            <tr key={post.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 font-medium text-sm text-blue-600">
                <div className="flex items-center space-x-2">
                  <FaInstagram size={22} className="text-pink-600" />
                  <span>{post.title}</span>
                </div>
              </td>
              <td className="py-3 px-4 font-medium text-sm text-gray-700">
                <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {post.link}
                </a>
              </td>
              <td className="py-3 px-0 font-medium text-sm text-gray-700">
                <div className="flex justify-end items-center space-x-3">
                  <ButtonAdicionar config={modalConfig("Editar", post)} params={post.id} />
                  <ModalDeletar
                    config={{
                      id: post.id,
                      title: "Excluir post do Instagram?",
                      description: "Esta ação removerá permanentemente o post. Continuar?",
                      apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/instaEmbed`,
                      urlRevalidate: ["/dashboard/instagram"],
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
        {posts.map((post: { id: string; title: string; link: string }) => (
          <div key={post.id} className="bg-white rounded-lg shadow border p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <FaInstagram size={22} className="text-pink-600" />
              <span className="font-semibold text-blue-700">{post.title}</span>
            </div>
            <div className="text-gray-800 text-sm mb-2">
              <span className="block">
                <b>Link:</b>{" "}
                <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {post.link}
                </a>
              </span>
            </div>
            <div className="flex gap-2 mt-2 justify-end">
              <ButtonAdicionar config={modalConfig("Editar", post)} params={post.id} />
              <ModalDeletar
                config={{
                  id: post.id,
                  title: "Excluir post do Instagram?",
                  description: "Esta ação removerá permanentemente o post. Continuar?",
                  apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/instaEmbed`,
                  urlRevalidate: ["/dashboard/instagram"],
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-between">
        <ButtonAdicionar config={modalConfig("Adicionar")} />
      </div>

      <Paginacao data={posts} totalRecords={totalRecords} />
    </div>
  );
};

const InstagramWrapper = ({ search, page, status }: { search: string, page: string, status: string }) => {
  return (
    <Suspense fallback={<LoadSkeleton />}>
      <InstagramList search={search} page={page} status={status} />
    </Suspense>
  );
};

export default async function Instagram({ searchParams }: { searchParams: Promise<{ search: string, page: string, status: string }> }) {
  const { search, page, status } = await searchParams;

  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Instagram</h2>
      <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
        Gerencie os posts do Instagram. Adicione, edite ou remova links de posts integrados.
      </p>
      <div className="flex gap-2 mb-6">
        <SearchItems />
      </div>
      <InstagramWrapper search={search} page={page} status={status} />
    </Container>
  );
}
