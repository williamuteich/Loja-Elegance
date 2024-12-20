import ButtonAdicionar from "./components/adicionar";
import ButtonDelete from "./components/deletar";
import ButtonEditar from "./components/editar";

export default async function Faq() {

    const response = await fetch("http://localhost:3000/api/faq");
    
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
            <ButtonAdicionar />
            <div className="w-full px-6 py-4 space-y-3">
                {faqs.length === 0 ? (
                    <p className="text-gray-500 text-xl font-normal">Nenhuma pergunta frequentes encontrada.</p>
                ) : (
                    faqs.map((faq: FaqProps) => (
                        <div key={faq.id} className="bg-white p-6 mt-0 rounded-lg shadow-sm border border-gray-300">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-2xl font-bold text-blue-500">{faq.question}</h2> 
                                <div className="flex space-x-4">
                                    <ButtonEditar id={faq.id} question={faq.question} response={faq.response} />
                                    <ButtonDelete id={faq.id}/>
                                </div>
                            </div>
                            <p className="text-gray-800 bg-gray-100 p-2">{faq.response}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
