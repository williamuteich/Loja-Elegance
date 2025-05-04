import React, { Suspense } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Paginacao from "@/app/components/Paginacao";

async function obtenerFaq({ searchParams }: { searchParams: Promise<{ search: string, page: string, status: string }> }) {
    const { search, page, status } = await searchParams;

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/publica/faq?${search ? `search=${search}&` : ''}${page ? `page=${page}&` : ''}${status ? `status=${status}` : ''}`, { next: {revalidate: 3800 } });

    if (!response.ok) {
        throw new Error("Error al buscar las preguntas frecuentes");
    }

    const { faq, totalRecords } = await response.json();

    return (
        <div className="min-h-screen">
            <Accordion type="single" collapsible className="w-full">
                {faq && faq.map((faqItem: { id: string, question: string, response: string }) => (
                    <AccordionItem key={faqItem.id} value={faqItem.id}>
                        <AccordionTrigger className="text-md text-pink-700">
                            {faqItem.question}
                        </AccordionTrigger>
                        <AccordionContent>
                            {faqItem.response}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            <Paginacao data={faq} totalRecords={totalRecords} />
        </div>
    );
}

export default async function PaginaFaq({ searchParams }: { searchParams: Promise<{ search: string, page: string, status: string }> }) {

    const defaultSearchParams = await searchParams;

    return (
        <div className="py-10">
            <div className="mx-auto min-h-screen">
                <h2 className="text-2xl uppercase font-extrabold text-pink-700 mb-6 text-start">
                    Preguntas Frecuentes
                </h2>
                <Suspense fallback={<div>Cargando...</div>}>
                    {await obtenerFaq({ searchParams: Promise.resolve(defaultSearchParams) })}
                </Suspense>
            </div>
        </div>
    );
};
