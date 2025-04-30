import { Container } from "@/app/components/container";
import Form from "@/components/Form";
import Submit from "@/components/Submit";
import Link from "next/link";
import validator from 'validator';

export default function Registro() {
    async function nuevoUsuario(prevState: any, formData: FormData): Promise<{ success?: string; error?: string; confirm?: string}> {
        "use server";

        const data = Object.fromEntries(formData.entries());

        if (!data.name) {
            return { error: "El campo Nombre no puede estar vacío." };
        }

        if (!data.email) {
            return { error: "El campo Correo Electrónico no puede estar vacío." };
        }

        if (typeof data.email === 'string' && !validator.isEmail(data.email)) {
            return { error: "Correo Electrónico inválido. Por favor, ingresa un correo electrónico válido." };
        }

        if (!data.password) {
            return { error: "El campo Contraseña no puede estar vacío." };
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
            return { error: result.message || "Error al intentar crear cuenta." };
        }

        return { confirm: "Cuenta creada con éxito. Verifica tu correo." };
    }

    return (
        <Container>
            <div className="flex items-center justify-center">
                <div className="w-full max-w-xl p-6 min-h-screen">
                    <h1 className="text-2xl font-bold text-center text-pink-700 mb-6 uppercase">Crea tu Cuenta</h1>
                    <Form action={nuevoUsuario}>
                        <div className="mb-4">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Nombre Completo"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        <div className="mb-4">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Correo Electrónico válido"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Ingresa una contraseña"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                        </div>
                        <Submit
                            type="submit"
                            className="w-full py-3 bg-pink-700 text-white font-semibold uppercase rounded-md hover:bg-pink-600"
                        >
                            Crear cuenta
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
                            ¿Ya tienes una cuenta?{' '}
                            <Link href="/login" className="text-black font-medium hover:underline ml-1">
                                Ingresa a la tienda
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </Container>
    );
}
