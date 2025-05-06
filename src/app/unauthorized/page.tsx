"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const { useState, useEffect } = require("react");

export default function Unauthorized() {
    const [timing, setTiming] = useState(50);

    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            setTiming((prev: number) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleRedirect = () => {

        router.push("/");
    };

    if (timing === 0 || timing < 0) {
        router.push("/");
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="h-screen py-10">
                <div className="text-center">
                    <h1 className="text-6xl font-extrabold text-gray-800 mb-3">
                        403
                    </h1>
                    <h2 className="text-3xl font-semibold text-red-600 mb-4">
                        Acceso Denegado
                    </h2>
                    <p className="text-lg text-gray-500 mb-8">
                        No tienes permiso para acceder a esta página. Si crees que esto es un error, contacta al administrador.
                    </p>
                    <div className="flex flex-col gap-4 justify-center items-center">
                        <p className="mt-4 text-md text-gray-700 font-medium">Redirigiendo: <span className="text-blue-700 text-base font-bold">{timing}</span></p>
                        <Button
                            onClick={handleRedirect}
                            className="bg-pink-700 w-1/4 text-white text-lg px-6 py-4 hover:bg-pink-600 transition duration-300 ease-in-out"
                        >
                            Volver al Home
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
