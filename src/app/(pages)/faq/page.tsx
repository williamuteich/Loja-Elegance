"use client"

import React, { useState } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

const faqData = [
    {
        id: 1,
        question: "Como faço para agendar um corte de cabelo?",
        response: "Você pode agendar um corte de cabelo diretamente pelo nosso aplicativo ou através do nosso site, selecionando o horário disponível e o barbeiro desejado."
    },
    {
        id: 2,
        question: "Qual é o horário de funcionamento da barbearia?",
        response: "Nosso horário de funcionamento é de segunda a sábado, das 9h às 19h. Fechamos aos domingos."
    },
    {
        id: 3,
        question: "Posso cancelar ou reagendar meu agendamento?",
        response: "Sim, você pode cancelar ou reagendar seu agendamento diretamente pelo aplicativo ou entrando em contato com a nossa equipe."
    },
    {
        id: 4,
        question: "Quais serviços a barbearia oferece?",
        response: "Oferecemos cortes de cabelo, barba, sobrancelha, serviços de coloração e tratamentos capilares."
    }
];

export default function HomeFaq() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAnswer = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="container mx-auto py-24">
            <h1 className="text-3xl font-semibold mb-8 text-center text-gray-700">Perguntas Frequentes</h1>

            <div className="space-y-1">
                {faqData.map((faq, index) => (
                    <div
                        key={faq.id}
                        onClick={() => toggleAnswer(index)}
                        className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 cursor-pointer"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <div className="text-xl font-semibold text-blue-500">{faq.question}</div>
                            <div className="text-xl text-blue-600">
                                {openIndex === index ? (
                                    <AiOutlineUp />
                                ) : (
                                    <AiOutlineDown />
                                )}
                            </div>
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            {openIndex === index && (
                                <p className="text-gray-700 text-base mt-2">{faq.response}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
