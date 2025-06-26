"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export default function Formulario() {
    const router = useRouter();
    const [userActive, setUserActive] = useState<boolean | undefined>();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

    const [clientDomain, setClientDomain] = useState("");
    useEffect(() => {
        if (typeof window !== "undefined") {
            setClientDomain(window.location.hostname);
        }
    }, []);

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
            email: formData.get("email")?.toString()?.trim() || "",
            password: formData.get("password")?.toString() || "",
        };

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
            
            const sessionResponse = await fetch(`/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Protection": "1"
                },
                body: JSON.stringify({ ...data, recaptchaToken }),
            });

            const session = await sessionResponse.json();

            if (!sessionResponse.ok) {
                toast.error(session.message || "Credenciais inválidas ou conta inativa", {
                    position: "top-right",
                    autoClose: 3000,
                });
                setLoading(false);
                return;
            }

            setUserActive(session.user?.active);

            if (session.user?.active) {
                // Agora sim, cria a sessão NextAuth
                const result = await signIn("credentials", {
                    ...data,
                    recaptchaToken,
                    redirect: false,
                });
                if (result?.error) {
                    toast.error("Erro ao criar sessão de autenticação.", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                    setLoading(false);
                    return;
                }
                const redirectPath = session.user?.role === "admin"
                    ? "/dashboard"
                    : "/profile";
                router.push(redirectPath);
                // Não chama setLoading(false) aqui! O loading continua até o redirect.
            }
        } catch (error) {
            console.error('[LOGIN] Erro inesperado:', error);
            toast.error("Erro inesperado. Tente novamente mais tarde.", {
                position: "top-right",
                autoClose: 3000,
            });
            setLoading(false);
        }
    }

    if (userActive === false) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white border border-pink-900 rounded-lg shadow-lg mt-6">
                <h2 className="text-2xl font-semibold text-pink-900 mb-4 text-center">
                    ¡Verifica tu correo electrónico para acceder a tu cuenta!
                </h2>
                <p className="text-lg text-gray-700 mb-4 text-center">
                    Para completar el proceso de creación de cuenta, por favor, verifica tu correo electrónico y confirma tu identidad.
                </p>
                <p className="font-semibold text-pink-900 text-lg text-center">
                    Hemos enviado un correo electrónico de confirmación. No olvides verificar tu bandeja de entrada.
                </p>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">Si no has recibido el correo electrónico, revisa tu carpeta de spam.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center text-pink-700 mb-6 uppercase">
                ¡Bienvenido de nuevo!
            </h1>

            <ToastContainer />

            <div className="mb-6">
                <GoogleLoginButton className="w-full" />
            </div>

            <div className="flex items-center mb-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500">o</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={login} className="space-y-4">
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
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
                        placeholder="Contraseña"
                        required
                        className={`w-full px-4 py-3 border ${errors.password ? "border-red-500" : "border-gray-300"
                            } rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                        onChange={() => setErrors(prev => ({ ...prev, password: undefined }))}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
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
                        "Iniciar sesión"
                    )}
                </button>
                <div>
                    <>
                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                            onChange={token => {
                                setRecaptchaToken(token);
                            }}
                            className="mb-4"
                            onErrored={() => {
                                console.error('[reCAPTCHA] Houve um erro ao renderizar o widget!');
                            }}
                            onExpired={() => {
                                console.warn('[reCAPTCHA] Token expirado!');
                            }}
                        />

                    </>
                </div>
            </form>

            <div className="mt-4 text-center">
                <Link
                    href="/resetPwd"
                    className="text-sm text-pink-700 hover:text-pink-900 font-medium transition-colors"
                >
                    Olvidé mi contraseña
                </Link>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6 text-center">
                <p className="text-sm text-gray-600">
                    ¿No tienes una cuenta?{' '}
                    <Link
                        href="/cadastro"
                        className="font-semibold text-pink-700 hover:text-pink-900 transition-colors"
                    >
                        Crea una ahora
                    </Link>
                </p>
            </div>
        </div>
    );
}