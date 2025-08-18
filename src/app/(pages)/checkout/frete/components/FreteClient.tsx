"use client";

import React, { useEffect, useState } from "react";
import { useAddress } from "@/context/addressContext";
import { useRouter } from "next/navigation";
import { Loader2, Truck } from "lucide-react";

export function FreteClient({ userID }: { userID?: string }) {
  const { address, fetchAddress } = useAddress();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    if (!userID) return;
    if (address) return;
    (async () => {
      try {
        await fetchAddress(userID);
      } catch (err) {
        console.error('Erro ao buscar endereço no contexto', err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID]);

  useEffect(() => {
    if (!address?.cep) return;

    let mounted = true;
    const fetchOptions = async () => {
      setLoading(true);
      setError(null);
      try {
        // build products from cart or mock: only sending ids, rest fixed
        const products = [{ id: '23', width: 11, height: 11, length: 17, weight: 3, insurance_value: 5, quantity: 1 }];

        const res = await fetch('/api/melhor-envio/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products, to_postal_code: address.cep }),
        });

        if (!mounted) return;
        if (!res.ok) {
          const err = await res.json();
          setError(err?.error || 'Erro ao calcular frete');
          setShippingOptions([]);
        } else {
          const data = await res.json();
          // filter out options that don't have a price
          const arr = Array.isArray(data) ? data : [];
          const filtered = arr.filter((opt: any) => {
            if (opt.price) return true;
            if (opt.packages && opt.packages.some((p: any) => p.price)) return true;
            return false;
          });
          setShippingOptions(filtered);
        }
      } catch (err) {
        if (!mounted) return;
        setError('Erro ao calcular frete. Tente novamente.');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchOptions();
    return () => {
      mounted = false;
    };
  }, [address?.cep]);

  const handleContinue = () => {
    if (!selected) return;
    router.push("/checkout/confirmacao");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-start mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Escolha o Frete</h1>
        <p className="text-gray-600 text-base">Selecione a melhor opção de entrega para seu pedido.</p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center text-center p-10">
          <Loader2 className="w-12 h-12 animate-spin text-gray-500 mb-4" />
          <p className="text-gray-600 font-medium">Calculando opções de frete para seu endereço...</p>
        </div>
      )}

      {error && !loading && (
        <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && shippingOptions.length > 0 && (
        <div className="space-y-4">
          {shippingOptions.map((opt) => (
            <label key={opt.id} className="block cursor-pointer">
              <input type="radio" name="shipping" className="sr-only" onChange={() => setSelected(opt)} />
              <div className={`rounded-xl bg-white p-5 transition-all ${selected?.id === opt.id ? "border-2 border-gray-700 shadow-md" : "border border-gray-200 hover:border-gray-400"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {opt.company?.picture && (
                      <img src={opt.company.picture} alt={opt.company.name} className="w-10 h-10 object-contain" />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-800">{opt.name}</h3>
                      <p className="text-sm text-gray-500">Entrega em até {opt.delivery_time} dias úteis</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-800">{opt.price ? `R$ ${Number(opt.price).toFixed(2)}` : '—'}</p>
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      )}

      <div className="pt-8 text-end">
        <button onClick={handleContinue} disabled={!selected || loading} className="bg-gray-700 text-white py-4 px-8 text-base font-medium rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed">
          <Truck className="w-5 h-5 inline-block mr-2" /> Continuar para Confirmação
        </button>
      </div>
    </div>
  );
}
