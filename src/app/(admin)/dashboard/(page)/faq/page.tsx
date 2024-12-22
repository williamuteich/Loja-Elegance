import ButtonAdicionar from "./components/adicionar";
import ButtonDelete from "./components/deletar";
import ButtonEditar from "./components/editar";
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
        <div className="w-full h-screen flex flex-col items-center">
            <h1 className="text-3xl font-semibold mb-8 mt-8 text-center text-gray-800">Perguntas Frequentes (FAQ)</h1>
            <div className="w-full px-6 py-4 space-y-3">
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
                                        <ButtonEditar id={faq.id} question={faq.question} response={faq.response} />
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
            <ButtonAdicionar />
        </div>
    );
}
