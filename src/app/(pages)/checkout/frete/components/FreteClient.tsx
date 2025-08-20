"use client";

import React, { useEffect, useState } from "react";
import { useAddress } from "@/context/addressContext";
import { useCart } from "@/context/newCartContext";
import { Loader2, Truck } from "lucide-react";
import { ResumoCompra } from "@/app/(pages)/checkout/components/ResumoCompra";
import { calculateShippingAndCreatePayment } from "@/app/actions/calculateShipping";

export function FreteClient({ userID }: { userID?: string }) {
  const { address, fetchAddress } = useAddress();
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [backendTotal, setBackendTotal] = useState<{
    subtotal: number;
    freight: number;
    total: number;
    itemCount: number;
  } | null>(null);

  // RESETAR seleção de frete quando componente monta
  useEffect(() => {
    console.log('🔄 Resetando seleção de frete');
    setSelected(null);
  }, []);

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
        // Buscar sessionId
        let sessionId;
        try {
          sessionId = localStorage.getItem('cart_session_id');
          if (!sessionId) {
            sessionId = crypto.randomUUID();
            localStorage.setItem('cart_session_id', sessionId);
          }
        } catch (e) {
          sessionId = 'temp-session-' + Date.now();
        }

        // Buscar carrinho do backend
        const cartRes = await fetch(`/api/cart?sessionId=${sessionId}`);
        const cartData = cartRes.ok ? await cartRes.json() : null;

        // Preparar produtos para cálculo de frete
        const products = (cartData?.items || []).map((it: any) => ({
          id: it.productId || it.id || '23',
          width: it.product?.width || 11,
          height: it.product?.height || 11,
          length: it.product?.length || 17,
          weight: it.product?.weight || 3,
          insurance_value: 5, // Valor fixo mínimo (sem seguro)
          quantity: it.quantity || 1,
        }));

        // Calcular opções de frete
        const res = await fetch('/api/melhor-envio/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            products, 
            to_postal_code: address.cep, 
            cartId: cartData?.id 
          }),
        });

        if (!mounted) return;
        if (!res.ok) {
          const err = await res.json();
          setError(err?.error || 'Erro ao calcular frete');
          setShippingOptions([]);
        } else {
          const data = await res.json();
          const arr = Array.isArray(data.shippingOptions) ? 
            data.shippingOptions : (Array.isArray(data) ? data : []);
          
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

  // Calcular total inicial (sem frete)
  useEffect(() => {
    const calculateInitialTotal = async () => {
      console.log('🎯 Calculando total inicial SEM FRETE');
      
      try {
        sessionStorage.removeItem('selected_shipping_price');
        sessionStorage.removeItem('selected_shipping_id');
      } catch (e) {}
      
      if (cart.length === 0) {
        console.log('⚠️ Carrinho vazio no contexto');
        setBackendTotal({
          subtotal: 0,
          freight: 0,
          total: 0,
          itemCount: 0
        });
        return;
      }

      const contextSubtotal = cart.reduce((acc, item) => 
        acc + (item.price * item.quantity), 0);
      
      setBackendTotal({
        subtotal: contextSubtotal,
        freight: 0,
        total: contextSubtotal,
        itemCount: cart.length
      });
    };

    calculateInitialTotal();
  }, [cart]);

  const handleFreteSelection = (option: any) => {
    setSelected(option);
    
    const shippingPrice = Number(option.price || option.price_in_cents || 0);
    const contextSubtotal = cart.reduce((acc, item) => 
      acc + (item.price * item.quantity), 0);
    
    setBackendTotal({
      subtotal: contextSubtotal,
      freight: shippingPrice,
      total: contextSubtotal + shippingPrice,
      itemCount: cart.length
    });
  };

  const handleContinue = async () => {
    if (!selected || !address?.cep) return;
    
    setCalculating(true);
    setError(null);
    
    try {
      //  SEGURO: Server action busca carrinho via userId automaticamente
      const result = await calculateShippingAndCreatePayment(
        selected.id,
        address.cep
      );

      if (result.success && result.init_point) {
        // Redirecionar para o Mercado Pago
        window.location.href = result.init_point;
      } else {
        throw new Error('Erro ao processar pagamento');
      }
    } catch (err: any) {
      console.error('Erro no processamento:', err);
      setError(err.message || 'Erro ao processar pedido');
    } finally {
      setCalculating(false);
    }
  };

  // Persistir frete selecionado no sessionStorage
  useEffect(() => {
    try {
      if (selected) {
        sessionStorage.setItem('selected_shipping_price', 
          String(selected.price || selected.price_in_cents || 0));
        sessionStorage.setItem('selected_shipping_id', 
          String(selected.id || selected.service_id || ''));
      }
    } catch (e) {}
  }, [selected]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
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
                  <input 
                    type="radio" 
                    name="shipping" 
                    className="sr-only" 
                    onChange={() => handleFreteSelection(opt)} 
                  />
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
                        <p className="font-bold text-lg text-gray-800">
                          {opt.price ? `R$ ${Number(opt.price).toFixed(2)}` : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="pt-8 text-end">
            <button 
              onClick={handleContinue} 
              disabled={!selected || calculating}
              className="bg-gray-700 text-white py-4 px-8 text-base font-medium rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {calculating ? (
                <>
                  <Loader2 className="w-5 h-5 inline-block mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Truck className="w-5 h-5 inline-block mr-2" /> 
                  Continuar para Pagamento
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:w-80 lg:flex-shrink-0">
          <ResumoCompra backendTotal={backendTotal} />
        </div>
      </div>
    </div>
  );
}