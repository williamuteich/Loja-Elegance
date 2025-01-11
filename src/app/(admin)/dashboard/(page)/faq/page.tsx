import Container from "../components/Container";
import ModalDeletar from "../components/ModalDeletar";
import ModalGeneric from "../components/ModalGeneric";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SearchItems from "../components/searchItems";
import Paginacao from "../components/Paginacao";
import { FiltroBuscarItem } from "../components/FiltroBuscarItem";

interface SearchParams {
    search: string;
    page: string;
    status: string;
  }

export default async function Faq({ searchParams }: { searchParams: SearchParams }) {
    
    const { search, page, status } = await searchParams;

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/faq?${search ? `search=${search}&` : ''}${page ? `page=${page}&` : ''}${status ? `status=${status}` : ''}`);

    if (!response.ok) {
        console.error("Erro ao buscar FAQs:", response.statusText);
        return <p>Ocorreu um erro ao carregar as FAQs.</p>;
    }

    const { faq, totalRecords } = await response.json();

    interface FaqProps {
        id: string;
        question: string;
        response: string;
    }

    if (faq.length === 0 || !faq) {
        return (
            <div className="w-full px-8 py-10 min-h-screen bg-gray-50">
                <div className="mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
                    <h2 className="text-3xl font-semibold mb-4 text-gray-800">Nenhuma FAQ encontrada.</h2>
                    <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
                        Não há perguntas frequentes cadastradas no momento. Você pode adicionar novas perguntas clicando no botão abaixo.
                    </p>
                    <div className="flex gap-2 mb-4">
                        <SearchItems />
                        <FiltroBuscarItem />
                    </div>
                    <div className="mt-5 flex justify-center">
                        <ModalGeneric
                            config={{
                                title: "Adicionar Pergunta Frequente",
                                description: "Preencha os campos abaixo para adicionar uma nova pergunta frequente à plataforma.",
                                action: "Adicionar",
                                fields: [
                                    { name: "question", label: "Pergunta", type: "text", placeholder: "Sua pergunta" },
                                    { name: "response", label: "Resposta", type: "text", placeholder: "Sua resposta" },
                                ],
                                apiEndpoint: `${process.env.NEXTAUTH_URL}/api/faq`,
                                urlRevalidate: "/dashboard/faq",
                                method: "POST",
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Container>
            <h1 className="text-3xl font-semibold mb-3 text-gray-800">Perguntas Frequentes (FAQ)</h1>
            <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
                Aqui você pode encontrar as respostas para as perguntas mais frequentes.
            </p>
            <div className="flex gap-2 mb-4">
                <SearchItems />
                <FiltroBuscarItem />
            </div>
            <div className="w-full py-4 space-y-3">
                {faq.length === 0 ? (
                    <p className="text-gray-500 text-xl font-normal">Nenhuma pergunta frequente encontrada.</p>
                ) : (
                    <Accordion type="single" collapsible className="w-full">
                        {faq.map((faq: FaqProps) => (
                            <AccordionItem key={faq.id} value={faq.id}>
                                <div className="flex justify-between items-center pb-0">
                                    <AccordionTrigger className="flex flex-row-reverse gap-4 items-center space-x-4 text-md flex-1">
                                        <span>{faq.question}</span>
                                    </AccordionTrigger>
                                    <div className="flex space-x-4">
                                        <ModalGeneric
                                            config={{
                                                id: faq.id,
                                                title: "Editar Pergunta Frequente",
                                                description: "Faça alterações na pergunta e resposta abaixo.",
                                                action: "editar",
                                                fields: [
                                                    { name: "question", label: "Pergunta", type: "text", placeholder: "Sua pergunta" },
                                                    { name: "response", label: "Resposta", type: "text", placeholder: "Sua resposta" },
                                                ],
                                                apiEndpoint: `${process.env.NEXTAUTH_URL}/api/faq`,
                                                urlRevalidate: "/dashboard/faq",
                                                method: "PUT",
                                                initialValues: {
                                                    question: faq.question,
                                                    response: faq.response,
                                                },
                                            }}
                                        />
                                        <ModalDeletar
                                            config={{
                                                id: faq.id,
                                                title: "Tem certeza que deseja excluir esta pergunta?",
                                                description: "Esta ação não pode ser desfeita. A pergunta será removida permanentemente. Deseja continuar?",
                                                apiEndpoint: `${process.env.NEXTAUTH_URL}/api/faq`,
                                                urlRevalidate: "/dashboard/faq",
                                            }}
                                        />
                                    </div>
                                </div>
                                <AccordionContent className=" px-16 text-md text-blue-600 font-normal">
                                    {faq.response}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </div>
            <div className="mt-5 flex justify-between">
                <ModalGeneric
                    config={{
                        title: "Adicionar Pergunta Frequente",
                        description: "Preencha os campos abaixo para adicionar uma nova pergunta frequente à plataforma.",
                        action: "Adicionar",
                        fields: [
                            { name: "question", label: "Pergunta", type: "text", placeholder: "Sua pergunta" },
                            { name: "response", label: "Resposta", type: "text", placeholder: "Sua resposta" },
                        ],
                        apiEndpoint: `${process.env.NEXTAUTH_URL}/api/faq`,
                        urlRevalidate: "/dashboard/faq",
                        method: "POST",
                    }}
                />
            </div>
            <Paginacao data={faq} totalRecords={totalRecords} />
        </Container>
    );
}
