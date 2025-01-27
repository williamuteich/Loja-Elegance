"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function Formulario() {
    const router = useRouter();

    async function login(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        };

        const res = await signIn("credentials", {
            ...data,
            redirect: false,
        });

        if (res?.ok) {
            toast.success("Login efetuado com sucesso!", {
                position: "top-center",
                autoClose: 3000,
            });

            const sessionResponse = await fetch(`/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const session = await sessionResponse.json();

            if (session?.user?.role) {
                router.push("/dashboard");
            } else {
                router.push("/");
            }
        } else {
            toast.error("Email ou senha incorretos.", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    }

    return (
        <>
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
                    className="w-full py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800"
                >
                    ENTRAR
                </button>
            </form>
        </>
    );
}
