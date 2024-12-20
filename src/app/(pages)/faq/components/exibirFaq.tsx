"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface FaqItem {
    id: number;
    question: string;
    response: string;
}

export default function ExibirFaq({ response }: { response: FaqItem[] }) {

    return (
        <Accordion type="single" collapsible className="w-full">
        {response.map((item) => (
          <AccordionItem key={item.id} value={item.question}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>
              {item.response}
            </AccordionContent>
          </AccordionItem>
        ))}
        </Accordion>
      )
    }