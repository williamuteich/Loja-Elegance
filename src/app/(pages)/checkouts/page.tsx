"use client";

import { useForm } from "react-hook-form";
import { useCart } from "@/context/cartContext";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import Link from "next/link";
import ResumoPedido from "./component/resumoPedido";
import LocalRetirada from "./component/localRetirada";
import CarrinhoVazio from "./component/carrinhoVazio";

export default function CheckoutProduto() {
  const { cart } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [localEndereco, setLocalEndereco] = useState<string | null>(null);
  const [selectedPickupLocation, setSelectedPickupLocation] = useState<string | null>(null);

  const {
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    setIsMounted(true);

    const endereco = localStorage.getItem("selectedPickupLocation");
    setLocalEndereco(endereco);
  }, []);

  const isButtonEnabled = selectedPickupLocation !== null;

  if (!isMounted) {
    return null;
  }

  if (cart.length === 0) {
    return (
      <CarrinhoVazio/>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-pink-600 text-xl">Información de Pago</CardTitle>
        </CardHeader>
        <LocalRetirada
          setSelectedPickupLocation={(location) =>
            setSelectedPickupLocation(location ? location.id : null)
          }
        />
      </Card>
      <ResumoPedido cart={cart} />
      <Link
        href="/checkouts/pagamento"
        className={`${isButtonEnabled
            ? 'bg-blue-900 hover:bg-blue-800'
            : 'bg-gray-400 cursor-not-allowed'
          } text-white text-sm rounded-lg p-2 block text-center`}
      >
        Elegir método de pago
      </Link>
    </div>
  );
}
