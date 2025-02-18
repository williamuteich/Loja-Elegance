"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Link from "next/link";

export default function Formulario() {
    const router = useRouter();
    const [userActive, setUserActive] = useState();

    async function login(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        };

        await signIn("credentials", {
            ...data,
            redirect: false,
        });

        const sessionResponse = await fetch(`/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!sessionResponse.ok) {
            toast.error("Email ou Senha Incorreto.", {
                position: "top-right",
                autoClose: 3000,
            })
        }

        const session = await sessionResponse.json();

        if (session?.user?.role && session?.user?.active === true) {
            router.push("/dashboard");
        } else if (session?.user?.active === true) {
            router.push("/");
        }

        setUserActive(session.active);
    }

    if (userActive === false) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white border border-pink-900 rounded-lg shadow-lg mt-6">
                <h2 className="text-2xl font-semibold text-pink-900 mb-4 text-center">
                    Verifique seu E-mail para Acessar sua Conta!
                </h2>
                <p className="text-lg text-gray-700 mb-4 text-center">
                    Para concluir o processo de criação de conta, por favor, verifique o seu e-mail e confirme sua identidade.
                </p>
                <p className="font-semibold text-pink-900 text-lg text-center">
                    Enviamos um e-mail de confirmação. Não se esqueça de verificar a sua caixa de entrada.
                </p>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">Se você não recebeu o e-mail, verifique sua pasta de spam.</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-center text-pink-700 mb-6 uppercase">Bem Vindo De Volta!</h1>
            <ToastContainer />
            <form onSubmit={login} className="relative">
                <div className="mb-6">
                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="password"
                            name="password"
                            placeholder="Senha"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>
                <button
                    title="login"
                    type="submit"
                    className="w-full py-3 bg-pink-700 text-white font-semibold uppercase rounded-md hover:bg-pink-600"
                >
                    Entrar
                </button>
            </form>
            <div className="mt-4 text-center">
                <Link href="/resetPwd" className="text-sm text-gray-600 hover:text-black font-medium">
                    Esqueci minha senha
                </Link>
            </div>
            <div className="mt-6 border-t border-gray-300 pt-6 text-center">
                <p className="text-sm text-gray-600">
                    Não tem uma conta?{' '}
                    <Link href="/cadastro" className="text-black font-semibold hover:underline">
                        Crie uma agora
                    </Link>
                </p>
            </div>
        </>
    );
}
