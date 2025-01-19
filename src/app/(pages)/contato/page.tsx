import Image from "next/image";

export default function Contato() {
    return (
        <div className="flex flex-col items-center py-10">
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

                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Seu Nome"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-pink-800"
                                />
                                <input
                                    type="email"
                                    placeholder="Seu Email"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-pink-800"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Seu Telefone"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-pink-800"
                                />
                                <input
                                    type="text"
                                    placeholder="Assunto"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-pink-800"
                                />
                            </div>
                            <textarea
                                placeholder="Mensagem"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-pink-800 h-32"
                            ></textarea>
                            <button
                                type="submit"
                                className="bg-pink-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-pink-700"
                            >
                                Enviar Mensagem
                            </button>
                        </form>
                    </div>
                </div>
                <iframe title="Nossa localização" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.7429899232243!2d-51.11948492367529!3d-30.01553532993785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9519764274d6bf19%3A0x671f695511d4b7c6!2sAv.%20Baltazar%20De%20Oliveira%20Garcia%2C%202833!5e0!3m2!1spt-BR!2sbr!4v1737319923901!5m2!1spt-BR!2sbr" width="600" height="450" style={{ border: 0, width: "100%", height: "400px" }} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </div>
    );
}
