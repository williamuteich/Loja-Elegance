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
        <div className="space-y-2">
            {response.map((faq, index) => (
                <div
                    key={faq.id}
                    onClick={() => toggleAnswer(index)}
                    className="bg-white p-6 rounded-lg border-[1px] border-l-indigo-700 border-gray-200 cursor-pointer transition-all duration-200 ease-in-out"
                >
                    <div className="flex justify-between items-center mb-1">
                        <div className="text-lg flex gap-4 items-center font-semibold text-gray-800">
                            <div className="text-lg text-indigo-700">
                                {openIndex === index ? (
                                    <AiOutlineUp />
                                ) : (
                                    <AiOutlineDown />
                                )}
                            </div>
                            <span className="uppercase">{faq.question}</span>
                        </div>
                    </div>
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        {openIndex === index && (
                            <p className="text-gray-600 border-[1px] bg-gray-50 p-4 text-base">
                                {faq.response}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
