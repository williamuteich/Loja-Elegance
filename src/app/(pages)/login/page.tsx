"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Formulario from "./formulario";

export default function Login() {
    const { data: session, status } = useSession();
    const router = useRouter();

    console.log("Session data:", session);
    
    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status]);

    if (status === "loading") return null;

    return (
        <div className="flex items-center justify-center py-10">
            <div className="w-full max-w-xl p-6 min-h-screen">
                <Formulario />
            </div>
        </div>
    );
}
