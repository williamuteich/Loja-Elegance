"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "react-toastify/dist/ReactToastify.css";

export default function FormularioAdmin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [totpCode, setTotpCode] = useState<string | null>(null);
    const [waitingForTotp, setWaitingForTotp] = useState(false);
    const [userId, setUserId] = useState<string | null>(null); 
    const [email, setEmail] = useState<string>(""); 
    const [password, setPassword] = useState<string>("");

    const validateForm = (data: { email: string; password: string }) => {
        const newErrors: typeof errors = {};
        if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = "Formato de e-mail inválido";
        }
        if (data.password.length < 6) {
            newErrors.password = "Mínimo 6 caracteres";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function login(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            email: formData.get("email")?.toString().trim() || "",
            password: formData.get("password")?.toString() || "",
        };
        setEmail(data.email);
        setPassword(data.password);

        if (!validateForm(data)) {
            setLoading(false);
            return;
        }

        if (!recaptchaToken) {
            toast.error("Por favor, marque o reCAPTCHA para continuar.", {
                position: "top-right",
                autoClose: 3000,
            });
            setLoading(false);
            return;
        }

        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                recaptchaToken,
                redirect: false,
            });
            if (result?.error) {
        
                if (result.error.includes('TOTP')) {
                    setWaitingForTotp(true);
                    toast.info("Insira o código do Google Authenticator", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                } else {
                    toast.error(result.error, {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
                setLoading(false);
                return;
            }
            router.push("/dashboard");
        } catch (error) {
            toast.error("Erro inesperado. Tente novamente mais tarde.", {
                position: "top-right",
                autoClose: 3000,
            });
            setLoading(false);
        }
    }

    async function handleTotpVerification() {
        if (!totpCode) {
            toast.error("Por favor, insira o código TOTP", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }
        setLoading(true);
        try {
            const result = await signIn("credentials", {
                email,
                password,
                recaptchaToken,
                totpCode,
                redirect: false,
            });
            if (result?.error) {
                toast.error(result.error, {
                    position: "top-right",
                    autoClose: 3000,
                });
                setLoading(false);
                return;
            }
            setPassword("");
            setLoading(false);
            router.push("/dashboard");
        } catch (err) {
            toast.error("Erro inesperado ao verificar código TOTP.", {
                position: "top-right",
                autoClose: 3000,
            });
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center text-pink-700 mb-6 uppercase">
                Acesso Administrativo
            </h1>

            <ToastContainer />
            
            {waitingForTotp ? (
                <div>
                    <input
                        type="text"
                        placeholder="Digite o código do Google Authenticator"
                        value={totpCode || ""}
                        onChange={(e) => setTotpCode(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <div className="flex justify-center my-4">
                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                            onChange={(token) => setRecaptchaToken(token)}
                            onExpired={() => setRecaptchaToken(null)}
                            onErrored={() => console.error('[reCAPTCHA] Erro ao carregar.')}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleTotpVerification}
                        disabled={loading || !totpCode || !recaptchaToken}
                        className="w-full py-3 bg-pink-700 text-white font-semibold uppercase rounded-md transition-all"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Verificando...
                            </div>
                        ) : (
                            "Verificar Código TOTP"
                        )}
                    </button>
                </div>
            ) : (
                <form onSubmit={login} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="E-mail corporativo"
                            required
                            className={`w-full px-4 py-3 border ${errors.email ? "border-red-500" : "border-gray-300"
                                } rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                            onChange={() => setErrors(prev => ({ ...prev, email: undefined }))}

                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Senha"
                            required
                            className={`w-full px-4 py-3 border ${errors.password ? "border-red-500" : "border-gray-300"
                                } rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                            onChange={() => setErrors(prev => ({ ...prev, password: undefined }))}

                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                            onChange={(token) => setRecaptchaToken(token)}
                            onExpired={() => {
                                setRecaptchaToken(null);
                                toast.warn("O reCAPTCHA expirou. Atualize ou marque novamente.", {
                                    position: "top-right",
                                    autoClose: 3000,
                                });
                            }}
                            onErrored={() => {
                                console.error('[reCAPTCHA] Erro ao carregar.');
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !recaptchaToken}
                        className={`w-full py-3 bg-pink-700 text-white font-semibold uppercase rounded-md transition-all ${loading ? "opacity-75 cursor-not-allowed" : "hover:bg-pink-600"
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Carregando...
                            </div>
                        ) : (
                            "Entrar"
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}
