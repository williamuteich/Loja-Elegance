"use client";

import React from "react";
import { MapPin, User, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAddress } from '@/context/addressContext';

export function EnderecoEntrega() {
  const { address } = useAddress();
  const router = useRouter();

  const formatEndereco = (end: any) => {
    if (!end) return "";
    return `${end.logradouro}, ${end.numero}${end.complemento ? ` - ${end.complemento}` : ""}, ${end.bairro}, ${end.cidade} - ${end.estado}, ${end.cep}`;
  };

  return (
    <div className="space-y-5 w-full mx-auto">
      <div className="text-start">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Endereço de Entrega</h1>
        <p className="text-gray-600 text-base">Confirme ou adicione seu endereço de entrega</p>
      </div>

      <div className="space-y-4">
        {address ? (
          <div className="rounded-xl bg-white border border-gray-300">
            <div className="flex items-start p-5">
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
        ) : (
          <div className="rounded-xl bg-white border border-gray-300 p-6 text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-6 h-6 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-800">Nenhum endereço cadastrado</h3>
              </div>
              <p className="text-gray-600 text-sm">Adicione um endereço para continuar com sua compra</p>
              <Link 
                href="/checkout/endereco" 
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 text-base font-medium rounded-xl transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Adicionar endereço
              </Link>
            </div>
          </div>
        )}
      </div>

      {address && (
        <div className="pt-2 text-end">
          <Link href="/checkout/frete" className="bg-gray-700 hover:bg-gray-800 text-white py-4 px-5 text-base font-medium rounded-xl">
            Continuar
          </Link>
        </div>
      )}
    </div>
  );
}
