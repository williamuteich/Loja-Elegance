import React, { Suspense } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Paginacao from "@/app/(admin)/dashboard/(page)/components/Paginacao";

async function getFaq({ searchParams }: { searchParams: Promise<{ search: string, page: string, status: string }> }) {
    const { search, page, status } = await searchParams;

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/faq?${search ? `search=${search}&` : ''}${page ? `page=${page}&` : ''}${status ? `status=${status}` : ''}, {cache: "no-store"}`);

    if (!response.ok) {
        throw new Error("Erro ao buscar as perguntas frequentes");
    }

    const { faq, totalRecords } = await response.json();

    return (
        <>
            <Accordion type="single" collapsible className="w-full">
                {faq && faq.map((faqItem: { id: string, question: string, response: string }) => (
                    <AccordionItem key={faqItem.id} value={faqItem.id}>
                        <AccordionTrigger className="text-md">
                            {faqItem.question}
                        </AccordionTrigger>
                        <AccordionContent>
                            {faqItem.response}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            <Paginacao data={faq} totalRecords={totalRecords} />
        </>
    );
}

export default async function FaqPage({ searchParams }: { searchParams: Promise<{ search: string, page: string, status: string }> }) {

    const defaultSearchParams = await searchParams;

    return (
        <div className="py-16 my-10">
            <div className="container mx-auto">
                <h1 className="text-2xl text-gray-800 font-bold mb-6 text-start">
                    Perguntas Frequentes
                </h1>
                <Suspense fallback={<div>Carregando...</div>}>
                    {await getFaq({ searchParams: Promise.resolve(defaultSearchParams) })}
                </Suspense>
            </div>
        </div>
    );
};
