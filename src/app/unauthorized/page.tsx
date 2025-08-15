"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Unauthorized() {
  const [tempo, setTempo] = useState(50);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setTempo((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (tempo <= 0) {
      router.push("/");
    }
  }, [tempo, router]);

  const handleRedirect = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="h-screen py-10">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-gray-800 mb-3">403</h1>
          <h2 className="text-3xl font-semibold text-red-600 mb-4">
            Acesso Negado
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Você não tem permissão para acessar esta página. Caso acredite que
            isso seja um erro, entre em contato com o administrador.
          </p>
          <div className="flex flex-col gap-4 justify-center items-center">
            <p className="mt-4 text-md text-gray-700 font-medium">
              Redirecionando em:{" "}
              <span className="text-blue-700 text-base font-bold">
                {tempo}
              </span>
            </p>
            <Button
              onClick={handleRedirect}
              className="bg-pink-700 w-1/4 text-white text-lg px-6 py-4 hover:bg-pink-600 transition duration-300 ease-in-out"
            >
              Voltar para a Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
