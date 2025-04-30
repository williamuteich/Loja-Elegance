import Container from "../components/Container";
import ModalDeletar from "../components/ModalDeletar";
import ModalGeneric from "../components/ModalGeneric";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SearchItems from "../components/searchItems";
import Paginacao from "../../../../components/Paginacao";
import { Suspense } from "react";
import { LoadSkeleton } from "../components/loadSkeleton";
import { FaqProps } from "@/utils/types/faq";
import { FieldConfig } from "@/utils/types/fieldConfig";

const modalConfig = (action: string, initialValues?: FaqProps) => {
    const initialValuesFormatted = initialValues
        ? { question: initialValues.question, response: initialValues.response }
        : undefined;

    return {
        title: `${action} Pergunta Frequente`,
        description: action === "Adicionar"
            ? "Preencha os campos abaixo para adicionar uma nova pergunta frequente à plataforma."
            : "Faça alterações na pergunta e resposta abaixo.",
        action,
        fields: [
            { name: "question", label: "Pergunta", type: "text", placeholder: "Sua pergunta" },
            { name: "response", label: "Resposta", type: "text", placeholder: "Sua resposta" },
        ] as FieldConfig[],
        apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/faq`,
        urlRevalidate: "/dashboard/faq",
        method: action === "Adicionar" ? "POST" : "PUT",
        initialValues: initialValuesFormatted,
    };
};

const fetchFaqs = async (search: string, page: string, status: string) => {
    const response = await fetch(
        `${process.env.NEXTAUTH_URL}/api/privada/faq?${search ? `search=${search}&` : ''}${page ? `page=${page}&` : ''}${status ? `status=${status}` : ''}`
    );

    if (!response.ok) {
        throw new Error("Erro ao carregar as FAQs.");
    }

    const data = await response.json();
    return data;
};

const FaqList = async ({ search, page, status }: { search: string, page: string, status: string }) => {
    const { faq, totalRecords } = await fetchFaqs(search, page, status);

    return (
        <div>
            {faq.length === 0 || !faq ? (
                <>
                    <p className="mt-10 font-medium text-lg">Nenhuma Pergunta Encontrada</p>
                    <div className="flex justify-end mb-6">
                        <ModalGeneric config={modalConfig("Adicionar")} />
                    </div>
                </>
            ) : (
                <>
                    <p className="text-gray-700 text-base mb-3">
                        <span className="font-semibold text-gray-800">Total de Perguntas: </span>
                        <span className="font-medium text-blue-600">{totalRecords}</span>
                    </p>
                    <div className="w-full my-4 space-y-3 border-t-[1px]">
                        <Accordion type="single" collapsible className="w-full">
                            {faq.map((faqItem: FaqProps) => (
                                <AccordionItem key={faqItem.id} value={faqItem.id}>
                                    <div className="flex justify-between items-center pb-0">
                                        <AccordionTrigger className="flex flex-row-reverse gap-4 items-center space-x-4 text-md flex-1">
                                            <span>{faqItem.question}</span>
                                        </AccordionTrigger>
                                        <div className="flex space-x-4">
                                            <ModalGeneric config={modalConfig("editar", faqItem)} params={faqItem.id} />
                                            <ModalDeletar
                                                config={{
                                                    id: faqItem.id,
                                                    title: "Tem certeza que deseja excluir esta pergunta?",
                                                    description: "Esta ação não pode ser desfeita. A pergunta será removida permanentemente. Deseja continuar?",
                                                    apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/faq`,
                                                    urlRevalidate: "/dashboard/faq",
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <AccordionContent className="px-16 text-md text-blue-600 font-normal">
                                        {faqItem.response}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                    <div className="flex justify-end mb-6">
                        <ModalGeneric config={modalConfig("Adicionar")} />
                    </div>
                    <Paginacao data={faq} totalRecords={totalRecords} />
                </>
            )}
        </div>
    );
};

const FaqWrapper = ({ search, page, status }: { search: string, page: string, status: string }) => {
    return (
        <Suspense fallback={<LoadSkeleton />}>
            <FaqList search={search} page={page} status={status} />
        </Suspense>
    );
};

export default async function Faq({ searchParams }: { searchParams: Promise<{ search: string, page: string, status: string }> }) {
    const { search, page, status } = await searchParams;

    return (
        <Container>
            <h2 className="text-3xl font-semibold mb-3 text-gray-800">Perguntas Frequentes (FAQ)</h2>
            <p className="text-gray-600 mb-10 text-sm leading-[1.6]">Aqui você pode encontrar as respostas para as perguntas mais frequentes.</p>
            <div className="flex gap-2 mb-6">
                <SearchItems />
            </div>
            <FaqWrapper search={search} page={page} status={status} />
        </Container>
    );
}
