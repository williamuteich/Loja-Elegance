"use client";

import { useForm } from "react-hook-form";
import { useCart } from "@/context/cartContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import Link from "next/link";
import ResumoPedido from "./component/resumoPedido";
import LocalRetirada from "./component/localRetirada";

export default function CheckoutProduto() {
  const { cart } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  const {
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
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
      </Card>
      <ResumoPedido cart={cart} />
      <button className="bg-blue-900 text-white text-sm rounded-lg p-2">
        Elegir método de pago
      </button>
    </div>
  );
}
