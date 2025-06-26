"use client";

import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";

interface GoogleLoginButtonProps {
  callbackUrl?: string;
  className?: string;
}

export default function GoogleLoginButton({ callbackUrl = "/profile", className = "" }: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    console.log('Iniciando login com Google...');
    setLoading(true);
    try {
      const result = await signIn("google", { 
        callbackUrl,
        redirect: false
      });
      console.log('Resultado do signIn:', result);
      if (result?.error) {
        console.error('Erro no login com Google:', result.error);
        toast.error("Erro ao fazer login com Google");
      } else if (result?.ok) {
        console.log('Login com Google bem sucedido');
        window.location.href = callbackUrl;
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error("Erro ao fazer login com Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className={`w-full py-3 bg-blue-600 text-white font-semibold rounded-md flex items-center justify-center gap-2 ${className} ${
        loading ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-500"
      }`}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Carregando...
        </div>
      ) : (
        <>
          <FaGoogle className="w-5 h-5" />
          Iniciar sesión con Google
        </>
      )}
    </button>
  );
}
