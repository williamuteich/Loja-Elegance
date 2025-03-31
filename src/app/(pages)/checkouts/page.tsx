"use client";

import { useForm } from "react-hook-form";
import { useCart } from "@/context/cartContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ResumoPedido from "./component/resumoPedido";
import LocalRetirada from "./component/localRetirada";
import { redirect } from "next/navigation";

export default function CheckoutProduto() {
  const { data: session } = useSession();
  const { cart } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  const {
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePayment = async () => {
    try {
      const response = await fetch('/api/checkoutMercadoPago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            userID: session?.user.userID,
            id: item.id,
            title: item.name,
            description: item.description,
            picture_url: item.imagePrimary,
            category_id: item.categories[0]?.id || 'default-category-id',
            quantity: item.quantity,
            currency_id: 'UYU',
            unit_price: item.price,
          })),
          payer: {
            email: session?.user.email,
          },
        }),
      });

      const data = await response.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("Erro ao gerar a preferência de pagamento. Tente novamente.");
      }
    } catch (error) {
      alert("Houve um erro ao processar seu pagamento.");
    }
  };

  if (!isMounted) {
    return null;
  }

  if (!session) {
    redirect("/login");
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-pink-600 mb-4">Tu carrito está vacío</h1>
        <Link href="/produtos">
          <Button className="bg-pink-600 hover:bg-pink-700">Volver a la tienda</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-pink-600 text-xl">Información de Pago</CardTitle>
        </CardHeader>
        <LocalRetirada />
        <button
          className="bg-blue-900 text-white text-sm rounded-lg p-2 m-4"
          onClick={handlePayment}
        >
          Fazer pagamento
        </button>
      </Card>
      <ResumoPedido cart={cart} />
    </div>
  );
}
