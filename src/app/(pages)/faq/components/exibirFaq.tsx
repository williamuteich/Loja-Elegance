"use client";

import React, { useState } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

interface FaqItem {
    id: number;
    question: string;
    response: string;
}

export default function ExibirFaq({ response }: { response: FaqItem[] }) {

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAnswer = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
            {response.map((faq, index) => (
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
        </>
    );
}
