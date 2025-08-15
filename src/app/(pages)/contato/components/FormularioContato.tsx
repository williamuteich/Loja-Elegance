"use client"
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import { FormEvent, useState } from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import Flag from "react-world-flags";

const COUNTRIES = [
  { code: "BR", name: "Brasil", dial: "+55" },
  { code: "UY", name: "Uruguai", dial: "+598" },
  { code: "AR", name: "Argentina", dial: "+54" },
];

export default function Contato() {
    const [loading, setLoading] = useState(false)
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
    const [countryCode, setCountryCode] = useState("UY")
    const [phoneNumber, setPhoneNumber] = useState("")

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!phoneNumber.trim()) {
            toast.error("Por favor, insira um número de telefone válido");
            return;
        }

        const formData = new FormData(event.currentTarget);
        const formObject: { [key: string]: string } = {};

        formData.forEach((value, key) => {
            formObject[key] = value.toString();
        });

        const selectedCountry = COUNTRIES.find(c => c.code === countryCode)
        const dial = selectedCountry?.dial.replace(/\s/g, "") || ""
        const cleanPhone = phoneNumber.replace(/\D/g, "")
        formObject.telefone = dial + cleanPhone

        if (!recaptchaToken) {
            toast.error("Por favor, marque o reCAPTCHA para continuar.", {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }

        const jsonData = JSON.stringify({ ...formObject, recaptchaToken });
        setLoading(true);

        try {
            const response = await fetch(`/api/formContact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: jsonData,
            })

            if (!response.ok) {
                toast.error("Erro ao enviar o formulário de contato", {
                    position: "top-center",
                    autoClose: 3000
                })
                setLoading(false);
                return
            }

            toast.success("Formulário enviado com sucesso", {
                position: "top-center",
                autoClose: 4500
            })

            setLoading(false);
            setTimeout(() => window.location.reload(), 5000);

        } catch (err) {
            toast.error("Erro ao enviar o formulário de contato", {
                position: "top-center",
                autoClose: 3000
            })
        }
    }

    return (
        <div className="flex flex-col items-center py-10">
            <ToastContainer />
            <div className=" w-full">
                <h1 className="text-2xl uppercase font-extrabold text-pink-700 mb-2">Contato</h1>
                <p className="text-gray-700 text-base">
                    Estamos aqui para ajudá-lo! Utilize o formulário abaixo para entrar em contato conosco e responderemos o mais rápido possível.
                </p>
                <p className="text-gray-700 text-base mb-4">
                    Nosso horário de atendimento é de segunda a sexta-feira, das 9h às 18h.
                </p>

                <div className="grid md:grid-cols-2 gap-10 mt-10 mb-6">
                    <div>
                        <h2 className="text-2xl uppercase font-extrabold text-pink-700 mb-4">SUPORTE AO CLIENTE</h2>
                        <Image
                            src="/contato.png"
                            width={700}
                            height={500}
                            priority
                            alt="Suporte ao cliente"
                        />
                        <h2 className="text-2xl uppercase font-extrabold text-pink-700 mb-4 mt-6">Estamos aqui para você</h2>
                        <p className="text-gray-700 text-base mb-4">
                            Se você tiver dúvidas sobre nossos produtos ou precisar de ajuda com seu pedido, entre em contato conosco. Nossa equipe está pronta para oferecer o suporte necessário.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl uppercase font-extrabold text-pink-700 mb-4">ENTRE EM CONTATO</h2>
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
                                    placeholder="Seu E-mail"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-pink-800"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex gap-2">
                                    <div className="relative w-1/3">
                                        <select
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                            className="appearance-none pr-8 pl-10 py-2 border rounded-lg bg-white w-full"
                                        >
                                            {COUNTRIES.map((c) => (
                                                <option key={c.code} value={c.code}>
                                                    {c.dial}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute left-2 top-2">
                                            <Flag 
                                                code={countryCode} 
                                                className="w-6 h-4 rounded-sm border" 
                                            />
                                        </div>
                                    </div>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "").slice(0, 15)
                                            setPhoneNumber(value)
                                        }}
                                        placeholder="Ex: 099123456"
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-pink-800"
                                    />
                                </div>
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
                            
                            <div>
                                <ReCAPTCHA
                                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                                    onChange={(token: string | null) => setRecaptchaToken(token)}
                                    className="mb-4"
                                />
                            </div>
                            
                            <button
                                type="submit"
                                className={`bg-pink-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-pink-700 ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                                disabled={loading || !recaptchaToken}
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
                <iframe title="Nossa localização" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1449.6861182992457!2d-57.55597675040666!3d-30.209857671747244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95acd6acbca676fd%3A0xe373108697f9f0d2!2sR.%20Salustiano%20Marty%2C%20244%20-%20Barra%20do%20Quara%C3%AD%2C%20RS%2C%2097538-000!5e0!3m2!1spt-BR!2sbr!4v1746321782889!5m2!1spt-BR!2sbr" width="600" height="450" style={{ border: 0, width: "100%", height: "400px" }} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </div>
    );
}
