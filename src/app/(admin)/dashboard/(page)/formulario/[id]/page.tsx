"use client";
import { Button } from "@/components/ui/button";
import Container from "../../components/Container";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Formulario } from "@/utils/types/formulario";

import { useEffect, useState } from "react";
import EnvForm from "./components/envForm";

export default function RespFormulario({ params }: { params: Promise<{ id: string }> }) {
    const [getForm, setGetForm] = useState<Formulario | null>(null);  
    const [loading, setLoading] = useState(true);  
    const [resposta, setResposta] = useState(''); 

    const response = async (id: string) => {
        try {
            setLoading(true); 
            const res = await fetch(`/api/formContact?id=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                toast.error("Erro ao carregar o formulário.");
                return;
            }

            const { formContacts } = await res.json();
            setGetForm(formContacts);  
            setLoading(false);  

        } catch (error) {
            toast.error("Erro ao fazer a requisição.");
            console.error(error);
            setLoading(false);  
        }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setResposta(e.target.value);  
    };

    useEffect(() => {
        const fetchData = async () => {
            const resolvedParams = await params;
            const id = resolvedParams.id;
            response(id);
        };

        fetchData();
    }, [params]);

    return (
        <Container>
            <ToastContainer />
            <div className="space-y-6">
                <h2 className="text-3xl font-semibold mb-3 text-gray-800">Responder ao Formulário</h2>
                <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
                    Aqui você pode visualizar as mensagens enviadas pelos usuários e responder diretamente a elas. Utilize esta página para interagir com seus clientes, esclarecer dúvidas, resolver problemas ou fornecer mais informações sobre seus serviços.
                </p>

                <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
                    {loading ? (
                        <div className="flex space-x-2 p-6">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-[2px] border-blue-800 border-solid"></div>
                            <span className="text-xl text-blue-800">Carregando Dados...</span>
                        </div>
                    ) : (
                        getForm && (
                            <>
                                <div className="space-y-2">
                                    <p><strong>ID:</strong> {getForm.id}</p>
                                    <p><strong>Nome:</strong> {getForm.name}</p>
                                    <p><strong>Email:</strong> {getForm.email}</p>
                                    <p><strong>Telefone:</strong> {getForm.telefone}</p>
                                    <p><strong>Assunto:</strong> {getForm.assunto}</p>
                                    <div className="flex flex-col mt-8">
                                        <strong>Mensagem:</strong> 
                                        <p className="bg-slate-100 p-4">{getForm.mensagem}</p>
                                    </div>
                                </div>
                            </>
                        )
                    )}
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Sua Resposta</h3>
                    <textarea
                        className="w-full h-40 p-4 border border-gray-300 rounded-md resize-none"
                        placeholder="Digite sua resposta aqui..."
                        value={resposta}  
                        onChange={handleTextareaChange}  
                    />

                    <div className="flex justify-end space-x-3 text-white">
                        <Button variant="outline" className="bg-gray-800 text-white hover:bg-gray-600">
                            Marcar como respondido
                        </Button>
                        {getForm && (
                            <EnvForm
                                formulario={getForm}
                                resposta={resposta}  
                            />
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
}
