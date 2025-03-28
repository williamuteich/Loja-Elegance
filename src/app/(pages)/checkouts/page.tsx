"use client";

import { useForm } from "react-hook-form";
import { useCart } from "@/context/cartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import Link from "next/link";
import { IMaskInput } from "react-imask";

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

export default function CheckoutProduto() {
  const { cart } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    setIsMounted(true);
  }, []);


  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-pink-600 mb-4">Tu carrito está vacío</h1>
        <Link href="/produtos">
          <Button className="bg-pink-600 hover:bg-pink-700">
            Volver a la tienda
          </Button>
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
            <div className="space-y-2">
              <h3 className="font-medium">Dirección de Envío</h3>
              <div>
                <Input
                  {...register("street", { required: "Calle obligatoria" })}
                  placeholder="Calle y Número"
                />
                {errors.street && (
                  <p className="text-red-600 text-sm mt-1">{errors.street.message}</p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Input
                    {...register("city", { required: "Ciudad obligatoria" })}
                    placeholder="Ciudad"
                  />
                  {errors.city && (
                    <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <Input
                    {...register("department", { required: "Departamento obligatorio" })}
                    placeholder="Departamento"
                  />
                  {errors.department && (
                    <p className="text-red-600 text-sm mt-1">{errors.department.message}</p>
                  )}
                </div>
                <div>
                  {isMounted && (
                    <MaskedInput
                      mask="00000"
                      name="zip"
                      register={register}
                      errors={errors}
                      placeholder="Código Postal"
                      validation={{
                        pattern: {
                          value: /^\d{5}(-\d{3})?$/,
                          message: "Código Postal inválido"
                        }
                      }}
                    />
                  )}
                </div>
              </div>
              <div>
                <Input
                  {...register("addressDetails")}
                  placeholder="Piso o Apartamento (opcional)"
                />
              </div>
            </div>
          </form>
        </CardContent>

        <button className="bg-blue-900 text-white text-sm rounded-lg p-2 m-4">Fazer pagamento</button>
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
                        {new Intl.NumberFormat("es-UY", {
                          style: "currency",
                          currency: "UYU",
                        }).format(item.price)}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">
                    {new Intl.NumberFormat("es-UY", {
                      style: "currency",
                      currency: "UYU",
                    }).format(item.price * item.quantity)}
                  </p>
                </div>
              ))}

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    {new Intl.NumberFormat("es-UY", {
                      style: "currency",
                      currency: "UYU",
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
                    {new Intl.NumberFormat("es-UY", {
                      style: "currency",
                      currency: "UYU",
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
