import Container from "../components/Container";
import SearchItems from "../components/searchItems";
import Paginacao from "../../../../components/Paginacao";
import { FiltroBuscarItem } from "../components/FiltroBuscarItem";
import { Suspense } from "react";
import { LoadSkeleton } from "../components/loadSkeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Formulario } from "@/utils/types/formulario";
//import { headers } from "next/headers";

const fetchFormularios = async (search: string, page: string, status: string) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (page) params.append("page", page);
  if (status) params.append("status", status);

  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/formContact?${params}`,{
   // headers: await headers(),
  });
  if (!response.ok) throw new Error("Erro ao carregar os formulários.");

  return response.json();
};

const FormularioList = async ({ search, page, status }: { search: string; page: string; status: string }) => {
  const { formContacts, totalRecords } = await fetchFormularios(search, page, status);

  if (!formContacts?.length) {
    return <p className="mt-10 font-medium text-lg">Nenhum Formulário Encontrado</p>;
  }

  return (
    <div>
      <p className="text-gray-700 text-base mb-3">
        <span className="font-semibold text-gray-800">Total de Formulários: </span>
        <span className="font-medium text-blue-600">{totalRecords}</span>
      </p>
      <table className="min-w-full text-white table-auto border-collapse rounded-md border-t border-b border-gray-300">
        <thead className="bg-gray-800 text-white">
          <tr>
            {["ID", "Nome", "Assunto", "Mensagem", "Status", ""].map((header, idx) => (
              <th key={idx} className="py-3 px-4 text-left text-sm font-medium text-white">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {formContacts.map((form: Formulario) => (
            <tr key={form.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 font-medium text-sm text-blue-600">{form.id}</td>
              <td className="py-3 px-4 font-medium text-sm text-gray-700">{form.name}</td>
              <td className="py-3 px-4 font-medium text-sm text-gray-700">{form.assunto}</td>
              <td className="py-3 px-4 font-medium text-sm text-gray-700 line-clamp-2">{form.mensagem}</td>
              <td className="py-3 px-4 font-medium text-sm text-gray-700">
                <div className="relative group inline-block">
                  <span
                    className={`rounded-full px-[10px] p-[0.1px] ${
                      form.respondido ? "bg-green-700" : "bg-red-700"
                    }`}
                  ></span>
                  <span className="absolute bottom-[120%] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {form.respondido ? "Respondido" : "Não Respondido"}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 font-medium text-sm text-gray-700">
                <Link href={`/dashboard/formulario/${form.id}`}>
                  <Button variant="outline" className="bg-green-800 text-white hover:bg-green-600 font-semibold py-1 px-4 rounded-md">
                    {form.respondido ? "Visualizar" : "Responder"}
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Paginacao data={formContacts} totalRecords={totalRecords} />
    </div>
  );
};

const FormularioPage = async ({ searchParams }: { searchParams: Promise<{ search: string; page: string; status: string }> }) => {
  const { search, page, status } = await searchParams;

  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Formulários Recebidos</h2>
      <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
        Aqui você pode visualizar as mensagens enviadas pelos usuários e responder diretamente a elas.
      </p>
      <div className="flex gap-2 mb-4">
        <SearchItems />
        <FiltroBuscarItem />
      </div>
      <Suspense fallback={<LoadSkeleton />}>
        <FormularioList search={search} page={page} status={status} />
      </Suspense>
    </Container>
  );
};

export default FormularioPage;
