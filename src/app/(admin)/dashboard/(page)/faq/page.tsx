import Container from "../components/Container";
import ModalDeletar from "../components/ModalDeletar";
import ModalGeneric from "../components/ModalGeneric";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SearchItems from "../components/searchItems";
import Paginacao from "../components/Paginacao";
import { FiltroBuscarItem } from "../components/FiltroBuscarItem";

interface FaqProps {
    id: string;
    question: string;
    response: string;
}

 
interface FieldConfig {
    name: string;
    label: string;
    type: "text" | "email" | "select" | "password";  
    placeholder: string;
}

const ModalConfig = (action: string, initialValues?: FaqProps) => {
 
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
        apiEndpoint: `${process.env.NEXTAUTH_URL}/api/faq`,
        urlRevalidate: "/dashboard/faq",
        method: action === "Adicionar" ? "POST" : "PUT",
        initialValues: initialValuesFormatted,  
    };
};

export default async function Faq({ searchParams }: { searchParams: Promise<{ search: string, page: string, status: string }> }) {
    const { search, page, status } = await searchParams;
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/faq?${search ? `search=${search}&` : ''}${page ? `page=${page}&` : ''}${status ? `status=${status}` : ''}`);

    if (!response.ok) {
        console.error("Erro ao buscar FAQs:", response.statusText);
        return <p>Ocorreu um erro ao carregar as FAQs.</p>;
    }

    const { faq, totalRecords } = await response.json();

    if (faq.length === 0 || !faq) {
        return (
            <Container>
                <h2 className="text-3xl font-semibold mb-3 text-gray-800">Perguntas Frequentes (FAQ)</h2>
                <p className="text-gray-600 mb-10 text-sm leading-[1.6]">Aqui você pode encontrar as respostas para as perguntas mais frequentes.</p>
                <div className="flex gap-2 mb-6">
                    <SearchItems />
                    <FiltroBuscarItem />
                </div>
                <p className="mt-10 font-medium text-lg">Nenhuma Pergunta Frequente Encontrada</p>
                <div className="mt-5 flex justify-center">
                    <ModalGeneric config={ModalConfig("Adicionar")} />
                </div>
            </Container>
        );
    }

    const renderFaqItem = (faq: FaqProps) => (
        <AccordionItem key={faq.id} value={faq.id}>
            <div className="flex justify-between items-center pb-0">
                <AccordionTrigger className="flex flex-row-reverse gap-4 items-center space-x-4 text-md flex-1">
                    <span>{faq.question}</span>
                </AccordionTrigger>
                <div className="flex space-x-4">
                    <ModalGeneric config={ModalConfig("editar", { question: faq.question, response: faq.response, id: faq.id })} />
                    <ModalDeletar config={{
                        id: faq.id,
                        title: "Tem certeza que deseja excluir esta pergunta?",
                        description: "Esta ação não pode ser desfeita. A pergunta será removida permanentemente. Deseja continuar?",
                        apiEndpoint: `${process.env.NEXTAUTH_URL}/api/faq`,
                        urlRevalidate: "/dashboard/faq"
                    }} />
                </div>
            </div>
            <AccordionContent className=" px-16 text-md text-blue-600 font-normal">{faq.response}</AccordionContent>
        </AccordionItem>
    );

    return (
        <Container>
            <h2 className="text-3xl font-semibold mb-3 text-gray-800">Perguntas Frequentes (FAQ)</h2>
            <p className="text-gray-600 mb-10 text-sm leading-[1.6]">Aqui você pode encontrar as respostas para as perguntas mais frequentes.</p>
            <div className="mb-6">
                <SearchItems />
            </div>
            <p className="text-gray-700 text-base mb-3">
                <span className="font-semibold text-gray-800">Total de Perguntas: </span>
                <span className="font-medium text-blue-600">{totalRecords}</span>
            </p>
            <div className="w-full my-4 space-y-3 border-t-[1px]">
                {faq.length === 0 ? (
                    <p className="text-gray-500 text-xl font-normal">Nenhuma pergunta frequente encontrada.</p>
                ) : (
                    <Accordion type="single" collapsible className="w-full">
                        {faq.map(renderFaqItem)}
                    </Accordion>
                )}
            </div>
            <div className="mt-5 flex justify-between">
                <ModalGeneric config={ModalConfig("Adicionar")} />
            </div>
            <Paginacao data={faq} totalRecords={totalRecords} />
        </Container>
    );
}
