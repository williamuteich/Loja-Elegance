import React from "react";
import ExibirFaq from "./components/exibirFaq";

interface FaqItem {
    id: number;
    question: string;
    response: string;
}

const FaqPage = async () => {

    const data = await fetch("http://localhost:3000/api/faq");
    const response: FaqItem[] = await data.json();

    return (
        <div className="py-16 my-10">
            <div className="container mx-auto">
                <h1 className="text-2xl text-gray-800 font-bold mb-6 text-start">
                    Perguntas Frequentes
                </h1>
                <div className="px-4 rounded-sm border-gray-200">
                    <ExibirFaq response={response} />
                </div>
            </div>
        </div>
    );
};

export default FaqPage;
