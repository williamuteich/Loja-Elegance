"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mostrar o banner apenas se o usuário ainda não consentiu
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem("cookieConsent");
      if (!consent) {
        setVisible(true);
      }
    }
  }, []);

  const acceptCookies = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cookieConsent", "true");
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-gray-900/90 text-white backdrop-blur-sm">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 text-sm">
        <p>
          Utilizamos cookies para mejorar tu experiencia. Al continuar navegando aceptas nuestra
          <Link href="/politica" className="underline ml-1 hover:text-blue-300">
            Política de Cookies
          </Link>
          .
        </p>
        <button
          onClick={acceptCookies}
          className="bg-white text-gray-900 font-medium px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
