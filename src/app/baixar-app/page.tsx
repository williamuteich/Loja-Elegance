
"use client";
import Image from "next/image";
import InstallAppButton from "./InstallAppButton";

export default function BaixarAppPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center border border-gray-200">
        <Image src="/favicon-16x16.png.jpg" alt="Logo Loja Elegance" width={64} height={64} className="mb-4 rounded-full shadow" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Leve a Loja Elegance com você!</h1>
        <p className="text-gray-600 text-center mb-6">Instale nosso app no seu celular e tenha acesso rápido às promoções, novidades e muito mais.</p>
        <InstallAppButton />
        <p className="text-xs text-gray-400 mt-6 text-center">Ao instalar, você aceita nossos <a href="/politica" className="underline text-blue-600">termos de privacidade</a>.</p>
      </div>
    </main>
  );
}
