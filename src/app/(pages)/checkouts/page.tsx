"use client";

import { useForm } from "react-hook-form";
import { useCart } from "@/context/cartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import Link from "next/link";
import { IMaskInput } from "react-imask";
import PagamentoBrick from "./component/pagamentos";

type FormData = {
  name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
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
  const { cart, clearCart } = useCart();
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

  const generateOrderNumber = () => {
    return `ORD-${Date.now().toString(36).toUpperCase()}`;
  };

  const onSubmit = async (data: FormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newOrderNumber = generateOrderNumber();
      clearCart();
    } catch (error) {
      console.error("Erro no checkout:", error);
      alert("Erro ao processar pedido");
    } 
  };



  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-pink-600 mb-4">Seu carrinho está vazio</h1>
        <Link href="/produtos">
          <Button className="bg-pink-600 hover:bg-pink-700">
            Voltar para a Loja
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-pink-600">Informações de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Dados Pessoais</h3>
              <div>
                <Input
                  {...register("name", { required: "Nome obrigatório" })}
                  placeholder="Nome Completo"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Input
                  {...register("email", {
                    required: "E-mail obrigatório",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "E-mail inválido"
                    }
                  })}
                  placeholder="E-mail"
                  type="email"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Endereço de Entrega</h3>
              <div>
                <Input
                  {...register("street", { required: "Rua obrigatória" })}
                  placeholder="Rua e Número"
                />
                {errors.street && (
                  <p className="text-red-600 text-sm mt-1">{errors.street.message}</p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Input
                    {...register("city", { required: "Cidade obrigatória" })}
                    placeholder="Cidade"
                  />
                  {errors.city && (
                    <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <Input
                    {...register("state", { required: "Estado obrigatório" })}
                    placeholder="Estado"
                  />
                  {errors.state && (
                    <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>
                  )}
                </div>
                <div>
                  {isMounted && (
                    <MaskedInput
                      mask="00000-000"
                      name="zip"
                      register={register}
                      errors={errors}
                      placeholder="CEP"
                      validation={{
                        
                        pattern: {
                          value: /^\d{5}-?\d{3}$/,
                          message: "CEP inválido"
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <PagamentoBrick publicKey={"TEST-767d0973-fd90-4fda-8773-6af0531356e7"} preferenceId={""} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

