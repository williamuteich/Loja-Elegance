"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/newCartContext";
import Image from "next/image";

export function ResumoCompra() {
  const { cart } = useCart();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const frete = 0;
  const total = subtotal + frete;

  return (
    <Card className="sticky top-6 border-0 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gray-100 border-b">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
          </svg>
          Resumo da compra
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar pr-2">
          {cart.map((item) => (
            <div
              key={`${item.id}-${item.selectedVariantId}`}
              className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors bg-white border border-gray-200"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={item.imagePrimary}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 line-clamp-2">{item.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: item.variantDetails.hexCode }}
                  />
                  <span className="text-xs text-gray-600">{item.variantDetails.color}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600 bg-gray-100 rounded-full px-2 py-1">
                    Qtd: {item.quantity}
                  </span>
                  <span className="font-medium text-gray-800">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className="bg-gray-200" />

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'itens'})</span>
            <span className="font-medium text-gray-800">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(subtotal)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-green-600">Frete</span>
            <span className="font-medium text-green-600">
              {frete === 0 ? (
                <span className="text-green-600">A calcular</span>
              ) : (
                new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(frete)
              )}
            </span>
          </div>
        </div>

        <Separator className="bg-gray-200" />

        <div className="flex justify-between text-lg font-bold pt-1">
          <span className="text-gray-800">Total</span>
          <span className="text-gray-800">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total)}
          </span>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mt-4 border border-gray-200 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="text-sm text-gray-700">Compra 100% segura e protegida</p>
        </div>
      </CardContent>
    </Card>
  );
}
