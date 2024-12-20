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
        <div className="bg-gray-50  py-16 px-6">
            <div className="container mx-auto bg-white p-8 rounded-lg shadow-lg max-w-4xl">
                <h1 className="text-4xl font-semibold text-blue-700 mb-10 text-center">
                    Perguntas Frequentes
                </h1>
                <div className="space-y-6">
                    <ExibirFaq response={response} />
                </div>
            </div>
        </div>
    );
};

export default FaqPage;
