import { getServerSession } from "next-auth";
import { auth as authOptions} from "@/lib/auth-config";
import { redirect } from 'next/navigation';
import Formulario from "./component/formulario";

export default async function LoginAdmin() {
    const session = await getServerSession(authOptions)
    const isLoggedIn = !!session;

    if (isLoggedIn) {
        redirect("/");
    }

    return (
        <div className="flex items-center justify-center py-10">
            <div className="w-full max-w-xl p-6 min-h-screen">
                <Formulario />
            </div>
        </div>
    );
}
