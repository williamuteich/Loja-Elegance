"use client";

import { useCart } from "@/context/newCartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CartProtectionProps {
  children: React.ReactNode;
  redirectTo?: string;
  message?: string;
}

/**
 * Componente de proteção que impede acesso a páginas quando o carrinho está vazio
 * 
 * PROPÓSITO:
 * - Proteger rotas de checkout contra acesso sem produtos
 * - Redirecionar usuário para página apropriada
 * - Exibir mensagem explicativa
 * 
 * USO:
 * <CartProtection>
 *   <CheckoutPage />
 * </CartProtection>
 */
export default function CartProtection({
  children,
  redirectTo = "/produtos",
  message = "Adicione produtos ao carrinho antes de prosseguir"
}: CartProtectionProps) {
  const { cart, isHydrated, isLoading } = useCart();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Aguardar hidratação do carrinho
    if (!isHydrated || isLoading) {
      return;
    }

    // Verificar se carrinho tem produtos
    if (cart.length === 0) {
      toast.warning(message);
      router.push(redirectTo);
      return;
    }

    // ✅ Carrinho tem produtos, permitir acesso
    setIsChecking(false);
  }, [cart, isHydrated, isLoading, router, redirectTo, message]);

  // Mostrar loading enquanto verifica o carrinho
  if (isChecking || !isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando carrinho...</p>
        </div>
      </div>
    );
  }

  // ✅ Carrinho válido, renderizar página
  return <>{children}</>;
}
