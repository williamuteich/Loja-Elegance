"use client";

import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import Form from 'next/form'

export default function Formulario() {
    const router = useRouter();

    async function login(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = {
            email: formData.get("email"),
            password: formData.get("password"),
        };

        const res = await signIn("credentials", {
            ...data,
            redirect: false,
        });

        if (res?.ok) {
            const sessionResponse = await fetch(`/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const session = await sessionResponse.json();

            if (session?.user?.role === "admin" || session?.user?.role === "colaborador") {
                router.push("/dashboard");
            } else {
                router.push("/");
            }
        }
    }

    return (
        <Form onSubmit={login} action="/search" className="relative">
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
                    <button
                        type="button"
                        className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.98 8.223c.654-1.125 1.604-2.167 2.825-2.919C8.027 4.304 9.482 4 12 4c2.518 0 3.973.304 5.195 1.304 1.22.752 2.17 1.794 2.825 2.919a9.632 9.632 0 011.18 4.005 9.632 9.632 0 01-1.18 4.005c-.654 1.125-1.604 2.167-2.825 2.919C15.973 19.696 14.518 20 12 20c-2.518 0-3.973-.304-5.195-1.304-1.22-.752-2.17-1.794-2.825-2.919A9.632 9.632 0 013 12.228a9.632 9.632 0 01.98-4.005z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <button
                type="submit"
                className="w-full py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800"
            >
                ENTRAR
            </button>
        </Form>
    );
}
