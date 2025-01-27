
import Container from "../components/Container";
import SearchItems from "../components/searchItems";
import Paginacao from "../../../../components/Paginacao";
import { FiltroBuscarItem } from "../components/FiltroBuscarItem";
import { Suspense } from "react";
import { LoadSkeleton } from "../components/loadSkeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Formulario } from "@/utils/types/formulario";



const fetchFormularios = async (search: string, page: string, status: string) => {
    const response = await fetch(
        `${process.env.NEXTAUTH_URL}/api/formContact?${search ? `search=${search}&` : ''}${page ? `page=${page}&` : ''}${status ? `status=${status}` : ''}`
    );

    if (!response.ok) {
        throw new Error("Erro ao carregar os formulários.");
    }

    const data = await response.json();
    return data;
};

const FormularioList = async ({ search, page, status }: { search: string, page: string, status: string }) => {
    const { formContacts, totalRecords } = await fetchFormularios(search, page, status);

    if (formContacts.length === 0 || !formContacts) {
        return (
            <>
                <p className="mt-10 font-medium text-lg">Nenhum Formulário Encontrado</p>
            </>
        );
    }

    return (
        <div>
            <p className="text-gray-700 text-base mb-3">
                <span className="font-semibold text-gray-800">Total de Formulários: </span>
                <span className="font-medium text-blue-600">{totalRecords}</span>
            </p>

            <table className="min-w-full table-auto border-collapse rounded-md border-t border-b border-gray-300">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[315px]">#</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[210px]">Nome</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[calc(100%-255px)]">Assunto</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-2/6">Mensagem</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[130px]">Status</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-4"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                    {formContacts.map((form: Formulario) => (
                        <tr key={form.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 font-medium text-sm text-blue-600">{form.id}</td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700">{form.name}</td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700">{form.assunto}</td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700 overflow-hidden h-12 max-w-xl line-clamp-2">{form.mensagem}</td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                {form.respondido ? (
                                    <span className="bg-green-700 rounded-full px-[10px] p-[0.1px]"></span>
                                ) : (
                                    <span className="bg-red-700 rounded-full px-[10px] p-[0.1px]"></span>
                                )}
                            </td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <Link href={`/dashboard/formulario/${form.id}`}  className="flex justify-end text-white items-center space-x-3">
                                    <Button variant="outline" className="bg-green-800 text-white hover:bg-green-600 font-semibold py-1 px-4 rounded-md transition duration-300 ease-in-out">
                                        Responder
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

const FormularioWrapper = ({ search, page, status }: { search: string, page: string, status: string }) => {
    return (
        <Suspense fallback={<LoadSkeleton />}>
            <FormularioList search={search} page={page} status={status} />
        </Suspense>
    );
};

export default async function FormularioPage({ searchParams }: { searchParams: Promise<{ search: string, page: string, status: string }> }) {
    const { search, page, status } = await searchParams;

    return (
        <Container>
            <h2 className="text-3xl font-semibold mb-3 text-gray-800">Formulários Recebidos</h2>
            <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
                Aqui você pode visualizar as mensagens enviadas pelos usuários e responder diretamente a elas. Utilize esta página para interagir com seus clientes, esclarecer dúvidas, resolver problemas ou fornecer mais informações sobre seus serviços.
            </p>

            <div className="flex gap-2 mb-4">
                <SearchItems />
                <FiltroBuscarItem />
            </div>

            <FormularioWrapper search={search} page={page} status={status} />
        </Container>
    );
}
