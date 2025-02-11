"use client"
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import { FormEvent, useState } from 'react'

export default function Contato() {
    const [loading, setLoading] = useState(false)

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget);
        const formObject: { [key: string]: string } = {};

        formData.forEach((value, key) => {
            formObject[key] = value.toString();
        });

        const jsonData = JSON.stringify(formObject);

        setLoading(true);

        try {
            const response = await fetch(`http://localhost:3000/api/formContact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: jsonData,
            })

            if (!response.ok) {
                toast.error("Falha ao Enviar Formulario De Contato", {
                    position: "top-center",
                    autoClose: 3000
                })
                setLoading(false);
                return
            }

            toast.success("Formulario Enviado Com Sucesso", {
                position: "top-center",
                autoClose: 4500
            })

            setLoading(false);

            setTimeout(() => {
                window.location.reload();
            }, 5000);

        } catch (err) {
            toast.error("Falha ao Enviar Formulario De Contato", {
                position: "top-center",
                autoClose: 3000
            })
        }

    }

    return (
        <div className="flex flex-col items-center py-10">
            <ToastContainer />
            <div className=" w-full">
                <h1 className="text-2xl uppercase  font-extrabold text-pink-700 mb-2">Contato</h1>
                <p className="text-gray-700 text-base">
                    Estamos aqui para ajudar você! Utilize o formulário abaixo para entrar em contato conosco e responderemos o mais breve possível.
                </p>
                <p className="text-gray-700 text-base mb-4">
                    Nosso horário de atendimento é de segunda a sexta-feira, das 9h às 18h.
                </p>

                <div className="grid md:grid-cols-2 gap-10 mt-10 mb-6">
                    <div>
                        <h2 className="text-2xl uppercase  font-extrabold text-pink-700 mb-4">SUPORTE AO CLIENTE</h2>
                        <Image
                            src="/contato.png"
                            width={700}
                            height={500}
                            priority
                            alt="Suporte ao cliente"
                        />
                        <h2 className="text-2xl uppercase  font-extrabold text-pink-700 mb-4 mt-6">Estamos aqui para você</h2>
                        <p className="text-gray-700 text-base mb-4">
                            Caso tenha dúvidas sobre nossos produtos ou precise de ajuda com seu pedido, entre em contato conosco. Nossa equipe está pronta para oferecer o suporte necessário.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl uppercase  font-extrabold text-pink-700 mb-4">ENTRE EM CONTATO</h2>
                        <p className="text-gray-700 text-base mb-4">
                            Precisa de ajuda ou tem dúvidas? Preencha o formulário abaixo e nossa equipe entrará em contato com você.
                        </p>

                        <form onSubmit={onSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Seu Nome"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-pink-800"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Seu Email"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-pink-800"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="telefone"
                                    placeholder="Seu Telefone"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-pink-800"
                                />
                                <input
                                    type="text"
                                    name="assunto"
                                    placeholder="Assunto"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-pink-800"
                                />
                            </div>
                            <textarea
                                placeholder="Mensagem"
                                name="mensagem"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-pink-800 h-32"
                            ></textarea>
                            <button
                                type="submit"
                                className={`bg-pink-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-pink-700 ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex justify-center items-center space-x-2">
                                        <div className="animate-spin border-2 border-t-2 border-white w-4 h-4 rounded-full"></div>
                                        <span>Enviando...</span>
                                    </div>
                                ) : (
                                    "Enviar Mensagem"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
                <iframe title="Nossa localização" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.7039973696415!2d-51.1331397!3d-30.045348799999992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9519762be7be6c89%3A0xd14c8ec78197d0d2!2sRua%20Ney%20da%20Gama%20Ahrends%20-%20Morro%20Santana%2C%20Porto%20Alegre%20-%20RS%2C%2091450-345!5e0!3m2!1spt-BR!2sbr!4v1739205015604!5m2!1spt-BR!2sbr" width="600" height="450" style={{ border: 0, width: "100%", height: "400px" }} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </div>
    );
}
