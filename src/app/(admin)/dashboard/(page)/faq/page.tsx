import Container from "../components/Container";
import ModalGeneric from "../components/ModalGeneric";
import ButtonDelete from "./components/deletar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default async function Faq() {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/faq`);

    if (!response.ok) {
        console.error("Erro ao buscar FAQs:", response.statusText);
        return <p>Ocorreu um erro ao carregar as FAQs.</p>;
    }

    const faqs = await response.json();

    interface FaqProps {
        id: string;
        question: string;
        response: string;
    }

    return (
        <Container>
            <h1 className="text-3xl font-semibold mb-3 text-gray-800">Perguntas Frequentes (FAQ)</h1>
            <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
                Aqui você pode encontrar as respostas para as perguntas mais frequentes.
            </p>
            <div className="w-full py-4 space-y-3">
                {faqs.length === 0 ? (
                    <p className="text-gray-500 text-xl font-normal">Nenhuma pergunta frequente encontrada.</p>
                ) : (
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq: FaqProps) => (
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
                                        <ButtonDelete id={faq.id} />
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
        </Container>
    );
}
