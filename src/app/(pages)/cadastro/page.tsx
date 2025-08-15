import { Container } from "@/app/components/container";
import Form from "@/components/Form";
import Submit from "@/components/Submit";
import Link from "next/link";
import validator from 'validator';
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export default function Registro() {
    async function novoUsuario(prevState: any, formData: FormData): Promise<{ success?: string; error?: string; confirm?: string}> {
        "use server";

        const data = Object.fromEntries(formData.entries());

        if (!data.name) {
            return { error: "O campo Nome não pode estar vazio." };
        }

        if (!data.email) {
            return { error: "O campo E-mail não pode estar vazio." };
        }

        if (typeof data.email === 'string' && !validator.isEmail(data.email)) {
            return { error: "E-mail inválido. Por favor, insira um e-mail válido." };
        }

        if (!data.password) {
            return { error: "O campo Senha não pode estar vazio." };
        }

        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/publica/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            return { error: result.message || "Erro ao tentar criar a conta." };
        }

        return { confirm: "Conta criada com sucesso. Verifique seu e-mail." };
    }

    return (
        <Container>
            <div className="flex items-center justify-center">
                <div className="w-full max-w-xl p-6 min-h-screen">
                    <h1 className="text-2xl font-bold text-center text-pink-700 mb-6 uppercase">Crie sua Conta</h1>
                    <div className="mb-6">
                        <GoogleLoginButton className="w-full" />
                    </div>
                    <div className="flex items-center mb-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-gray-500">ou</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <Form action={novoUsuario}>
                        <div className="mb-4">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Nome Completo"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        <div className="mb-4">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="E-mail válido"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Digite uma senha"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                        </div>
                        <Submit
                            type="submit"
                            className="w-full py-3 bg-pink-700 text-white font-semibold uppercase rounded-md hover:bg-pink-600"
                        >
                            Criar conta
                        </Submit>
                    </Form>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4 mr-1"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 9V5.25a2.25 2.25 0 00-2.25-2.25h-3a2.25 2.25 0 00-2.25 2.25V9m-3.75 0h13.5m-13.5 0a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25h13.5a2.25 2.25 0 002.25-2.25V11.25a2.25 2.25 0 00-2.25-2.25m-13.5 0V5.25"
                                />
                            </svg>
                            Já tem uma conta?{' '}
                            <Link href="/login" className="text-black font-medium hover:underline ml-1">
                                Acesse a loja
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </Container>
    );
}
