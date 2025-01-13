import { Container } from "@/app/components/container";
import Link from "next/link";

export default function Cadastro() {
    return (
        <Container>
            <div className="flex items-center justify-center min-h-screen ">
                <div className="w-full max-w-xl p-6 ">
                    <h1 className="text-2xl font-bold text-center text-black mb-6">CRIE SUA CONTA</h1>
                    <form>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Nome"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Sobrenome"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="email"
                                placeholder="E-mail válido"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Digite uma senha"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
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
                            CRIAR CONTA
                        </button>
                    </form>
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
                                Entre na loja
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </Container>
    );
}
