"use client";

import React, { useState } from "react";
import { MapPin, User, Check, Truck, Store, Clock } from "lucide-react";
import Link from "next/link";
import { useAddress } from '@/context/addressContext';

export function EnderecoEntrega() {
  const [selected, setSelected] = useState<"endereco" | "retirada">("endereco");
  const { address, setAddress } = useAddress();

  const formatEndereco = (end: any) => {
    if (!end) return "";
    return `${end.logradouro}, ${end.numero}${end.complemento ? ` - ${end.complemento}` : ""}, ${end.bairro}, ${end.cidade} - ${end.estado}, ${end.cep}`;
  };

  return (
    <form className="space-y-5 w-full mx-auto">
      <div className="text-start">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Forma de Entrega</h1>
        <p className="text-gray-600 text-base">Escolha como prefere receber seu pedido</p>
      </div>

      <div className="space-y-4">
        <label className="block cursor-pointer">
          <input
            type="radio"
            name="tipoEntrega"
            value="endereco"
            className="sr-only"
            checked={selected === "endereco"}
            onChange={() => setSelected("endereco")}
          />
          <div className={`rounded-xl bg-white transition-all ${selected === "endereco" ? "border border-gray-600 shadow-sm" : "border border-gray-300"}`}>
            <div className="flex items-start p-5">
              <div className={`flex-shrink-0 mt-1 w-6 h-6 rounded-full border flex items-center justify-center mr-4 ${selected === "endereco" ? "bg-gray-700 border-gray-700" : "border-gray-400 bg-white"}`}>
                {selected === "endereco" && <Check className="w-3.5 h-3.5 text-white" />}
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Entrega em casa</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <User className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-600">Endereço:</p>
                      <p className="text-gray-800 font-medium">{formatEndereco(address)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-5 py-3 bg-gray-50">
              <Link href="/checkout/endereco" className="text-sm font-bold text-blue-500 hover:text-blue-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-700" />
                Alterar ou escolher outro Endereço
              </Link>
            </div>
          </div>
        </label>

        <label className="block cursor-pointer">
          <input
            type="radio"
            name="tipoEntrega"
            value="retirada"
            className="sr-only"
            checked={selected === "retirada"}
            onChange={() => setSelected("retirada")}
          />
          <div className={`rounded-xl bg-white transition-all ${selected === "retirada" ? "border border-gray-600 shadow-sm" : "border border-gray-300"}`}>
            <div className="flex items-start p-5">
              <div className={`flex-shrink-0 mt-1 w-6 h-6 rounded-full border flex items-center justify-center mr-4 ${selected === "retirada" ? "bg-gray-700 border-gray-700" : "border-gray-400 bg-white"}`}>
                {selected === "retirada" && <Check className="w-3.5 h-3.5 text-white" />}
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Retirada na loja</h3>
                  </div>
                  <span className="text-sm px-2 py-0.5 rounded bg-green-600 text-white">Grátis</span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-600">Loja:</p>
                      <p className="text-gray-800 font-medium">Rua Oscar Freire, 1800 - Jardins, São Paulo - SP</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-600">Horário:</p>
                      <p className="text-gray-800 font-medium">Segunda a Sábado: 10:00 às 22:00 | Domingo: 11:00 às 20:00</p>
                      <p className="text-gray-500 text-xs mt-1">Retire em até 1 hora</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </label>
      </div>

      <div className="pt-2 text-end">
        {selected === "retirada" ? (
          <Link href="/checkout/confirmacao" className="bg-gray-700 hover:bg-gray-800 text-white py-4 px-5 text-base font-medium rounded-xl">Continuar</Link>
        ) : (
          <Link href="/checkout/confirmacao" className="bg-gray-700 hover:bg-gray-800 text-white py-4 px-5 text-base font-medium rounded-xl">Continuar</Link>
        )}
      </div>
    </form>
  );
}
