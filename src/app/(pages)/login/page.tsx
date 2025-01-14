import Link from 'next/link';
import Formulario from './components/formulario';

import { getServerSession } from "next-auth";
import { auth as authOptions} from "@/lib/auth-config";
import { redirect } from 'next/navigation';

export default async function Login() {
    const session = await getServerSession(authOptions)
    const isLoggedIn = !!session;

    if (isLoggedIn) {
        redirect("/");
    }

    console.log("está logado", isLoggedIn)
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-xl p-6">
                <h1 className="text-2xl font-bold text-center text-black mb-6">BEM VINDO DE VOLTA!</h1>
                <Formulario />
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
            </div>
        </div>
    );
}
