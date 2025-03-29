"use client";

import { useForm } from "react-hook-form";
import { useCart } from "@/context/cartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import Link from "next/link";
import { IMaskInput } from "react-imask";
import { useSession } from "next-auth/react";

type FormData = {
  name: string;
  email: string;
  street: string;
  city: string;
  department: string;
  zip: string;
  addressDetails: string;
  cardNumber: string;
  cardExp: string;
  cardCvc: string;
  paymentMethod: string;
  store: string;
  pickupLocation: string;
};

const MaskedInput = ({ mask, name, register, errors, placeholder, validation }: any) => {
  const [value, setValue] = useState("");

  return (
    <div>
      <IMaskInput
        mask={mask}
        value={value}
        onAccept={(value: string) => setValue(value)}
        {...register(name, validation)}
        placeholder={placeholder}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
      {errors[name] && (
        <p className="text-red-600 text-sm mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
};

const DeliveryMethod = ({ register, errors, watch }: any) => {
  const deliveryMethod = watch("paymentMethod");
  const selectedStore = watch("store");
  const selectedPickup = watch("pickupLocation");

  useEffect(() => {
    console.log("Método de entrega selecionado:", deliveryMethod);
  }, [deliveryMethod]);

  useEffect(() => {
    if (deliveryMethod === "store-pickup") {
      console.log("Loja selecionada:", selectedStore);
    }
  }, [selectedStore]);

  useEffect(() => {
    if (deliveryMethod === "shipping") {
      console.log("Ponto de retirada selecionado:", selectedPickup);
    }
  }, [selectedPickup]);

  return (
    <>
      <div className="space-y-2">
        <h3 className="font-medium">Método de Entrega</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              {...register("paymentMethod", { required: "Método de entrega obrigatório" })}
              value="store-pickup"
              className="h-4 w-4"
            />
            <div className="flex-1">
              <p className="font-semibold">Retirada na Loja</p>
              <p className="text-sm text-gray-500">Escolha uma de nossas lojas físicas</p>
            </div>
          </label>

          <label className="flex items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              {...register("paymentMethod", { required: "Método de entrega obrigatório" })}
              value="shipping"
              className="h-4 w-4"
            />
            <div className="flex-1">
              <p className="font-semibold">Envio por Correio</p>
              <p className="text-sm text-gray-500">Selecione um ponto de retirada</p>
            </div>
          </label>
        </div>
      </div>

      <div className="mt-4">
        {deliveryMethod === "store-pickup" && (
          <div className="space-y-2">
            <h3 className="font-medium">Selecione uma Loja para Retirada</h3>
            <div className="space-y-2">
              {[{ id: "store-1", name: "Loja 1 - Rua A", description: "Retire seu pedido na Loja 1" }].map((store) => (
                <label
                  key={store.id}
                  className="border p-4 rounded-md flex items-center justify-between cursor-pointer hover:bg-gray-50"
                >
                  <div>
                    <p className="font-semibold">{store.name}</p>
                    <p className="text-sm text-gray-500">{store.description}</p>
                  </div>
                  <input
                    type="radio"
                    {...register("store", { required: deliveryMethod === "store-pickup" ? "Selecione uma loja para retirada" : false })}
                    value={store.id}
                    className="h-4 w-4"
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {deliveryMethod === "shipping" && (
          <div className="space-y-2">
            <h3 className="font-medium">Selecione um Ponto de Retirada</h3>
            <div className="space-y-2">
              {[
                { id: "pickup-1", name: "Punto de Retiro 1 - Montevideo", description: "Retire seu pedido no ponto 1, Montevideo" },
                { id: "pickup-2", name: "Punto de Retiro 2 - Paysandú", description: "Retire seu pedido no ponto 2, Paysandú" },
                { id: "pickup-3", name: "Punto de Retiro 3 - Maldonado", description: "Retire seu pedido no ponto 3, Maldonado" }
              ].map((location) => (
                <label
                  key={location.id}
                  className="border p-4 rounded-md flex items-center justify-between cursor-pointer hover:bg-gray-50"
                >
                  <div>
                    <p className="font-semibold">{location.name}</p>
                    <p className="text-sm text-gray-500">{location.description}</p>
                  </div>
                  <input
                    type="radio"
                    {...register("pickupLocation", { required: deliveryMethod === "shipping" ? "Selecione um ponto de retirada" : false })}
                    value={location.id}
                    className="h-4 w-4"
                  />
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default function CheckoutProduto() {
  const { data: session } = useSession();
  const { cart } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const {
    register,
    handleSubmit,
    watch,
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
            id: item.id,
            title: item.name,
            description: item.description,
            picture_url: item.imagePrimary,
            category_id: item.categories[0]?.id || 'default-category-id',
            quantity: item.quantity,
            currency_id: 'BRL',
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
          <CardTitle className="text-pink-600">Información de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <DeliveryMethod
              register={register}
              errors={errors}
              watch={watch}
            />
          </form>
        </CardContent>

        <button
          className="bg-blue-900 text-white text-sm rounded-lg p-2 m-4"
          onClick={handlePayment}
        >
          Fazer pagamento
        </button>
      </Card>

      <div className="space-y-6">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="text-pink-600">Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imagePrimary}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x{" "}
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.price)}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(item.price * item.quantity)}
                  </p>
                </div>
              ))}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(subtotal)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}