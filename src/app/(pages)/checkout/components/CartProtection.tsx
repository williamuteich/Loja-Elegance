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

export default function CartProtection({
  children,
  redirectTo = "/produtos",
  message = "Adicione produtos ao carrinho antes de prosseguir"
}: CartProtectionProps) {
  const { cart, isHydrated, isLoading } = useCart();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isHydrated || isLoading) {
      return;
    }

    if (cart.length === 0) {
      toast.warning(message);
      router.push(redirectTo);
      return;
    }

    setIsChecking(false);
  }, [cart, isHydrated, isLoading, router, redirectTo, message]);

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

  return <>{children}</>;
}
