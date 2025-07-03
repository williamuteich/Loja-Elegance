"use client";

import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";

interface GoogleLoginButtonSmallProps {
  callbackUrl?: string;
  className?: string;
}

export default function GoogleLoginButtonSmall({ callbackUrl = "/profile", className = "" }: GoogleLoginButtonSmallProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signIn("google", { callbackUrl });
      if (result?.error) {
        toast.error("Error al iniciar sesión con Google");
      } else if (result?.ok) {
        window.location.href = callbackUrl;
      }
    } catch (error) {
      toast.error("Error al iniciar sesión con Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-pink-700 text-center">
        Puedes iniciar sesión o crear una cuenta haciendo clic en el botón de Google abajo
      </p>
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className={`w-full py-2 bg-blue-600 text-white font-semibold text-sm text-center rounded-md flex items-center justify-center gap-2 ${className} ${
          loading ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-500"
        }`}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <>
            <FaGoogle className="w-4 h-4" />
            Google
          </>
        )}
      </button>
    </div>
  );
}
