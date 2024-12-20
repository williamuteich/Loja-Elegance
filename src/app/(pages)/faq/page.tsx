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
        <div className="container mx-auto py-24">
            <h1 className="text-3xl font-semibold mb-8 text-center text-gray-700">Perguntas Frequentes</h1>
            <div className="space-y-1">
                <ExibirFaq response={response} />
            </div>
        </div>
    );
};

export default FaqPage;
