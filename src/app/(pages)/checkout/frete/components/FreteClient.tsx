"use client";

import React, { useEffect, useState } from "react";
import { useAddress } from "@/context/addressContext";
import { useCart } from "@/context/newCartContext";
import { useRouter } from "next/navigation";
import { Loader2, Truck } from "lucide-react";
import { ResumoCompra } from "@/app/(pages)/checkout/components/ResumoCompra";

export function FreteClient({ userID }: { userID?: string }) {
  const { address, fetchAddress } = useAddress();
  const { cart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const [serverSubtotal, setServerSubtotal] = useState<number | null>(null);

  useEffect(() => {
    if (!address?.cep) return;

    let mounted = true;
    const fetchOptions = async () => {
      setLoading(true);
      setError(null);
      try {
        // fetch current cart from backend to build products
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

        const cartRes = await fetch(`/api/cart?sessionId=${sessionId}`);
        const cartData = cartRes.ok ? await cartRes.json() : null;

  const products = (cartData?.items || [{ id: '23', quantity: 1 }]).map((it: any) => ({
          id: it.productId || it.id || '23',
          width: it.width || 11,
          height: it.height || 11,
          length: it.length || 17,
          weight: it.weight || 3,
          insurance_value: it.insurance_value || 5,
          quantity: it.quantity || 1,
        }));

        const res = await fetch('/api/melhor-envio/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products, to_postal_code: address.cep, cartId: cartData?.id }),
        });

        if (!mounted) return;
        if (!res.ok) {
          const err = await res.json();
          setError(err?.error || 'Erro ao calcular frete');
          setShippingOptions([]);
        } else {
          const data = await res.json();
          // data.shippingOptions contains Melhor Envio response
          const arr = Array.isArray(data.shippingOptions) ? data.shippingOptions : (Array.isArray(data) ? data : []);
          const filtered = arr.filter((opt: any) => {
            if (opt.price) return true;
            if (opt.packages && opt.packages.some((p: any) => p.price)) return true;
            return false;
          });
          setShippingOptions(filtered);

          // if backend returned subtotal, store it locally for ResumoCompra and local state
          if (data?.subtotal !== undefined) {
            try { sessionStorage.setItem('cart_subtotal', String(data.subtotal)); } catch(e) {}
            setServerSubtotal(Number(data.subtotal));
          }
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

  // Função para calcular total no backend
  const calculateTotal = async (cartId: string, shippingPrice: number = 0) => {
    try {
      console.log('🔍 Calculando total - cartId:', cartId, 'shippingPrice:', shippingPrice);
      const response = await fetch('/api/checkout/calculate-total', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, shippingPrice })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Total calculado no backend:', data);
        setBackendTotal(data);
      } else {
        console.error('❌ Erro na API, usando carrinho do contexto como fallback');
        
        // Fallback: calcular com o carrinho do contexto
        const contextSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const fallbackData = {
          subtotal: contextSubtotal,
          freight: shippingPrice,
          total: contextSubtotal + shippingPrice,
          itemCount: cart.length
        };
        
        console.log('🔄 Usando dados do contexto:', fallbackData);
        setBackendTotal(fallbackData);
      }
    } catch (error) {
      console.error('❌ Erro ao calcular total, usando contexto:', error);
      
      // Fallback: calcular com o carrinho do contexto
      const contextSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const fallbackData = {
        subtotal: contextSubtotal,
        freight: shippingPrice,
        total: contextSubtotal + shippingPrice,
        itemCount: cart.length
      };
      
      console.log('🔄 Usando dados do contexto (catch):', fallbackData);
      setBackendTotal(fallbackData);
    }
  };

  // Quando selecionar frete, recalcular total
  const handleFreteSelection = async (option: any) => {
    setSelected(option);
    
    // Buscar cartId
    try {
      // Tentar pegar sessionId do localStorage ou gerar um novo
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

      const cartRes = await fetch(`/api/cart?sessionId=${sessionId}`);
      const cartData = cartRes.ok ? await cartRes.json() : null;
      const cartId = cartData?.id;
      
      console.log('🛒 Cart data:', cartData, 'cartId:', cartId);
      
      if (cartId) {
        const shippingPrice = Number(option.price || option.price_in_cents || 0);
        await calculateTotal(cartId, shippingPrice);
      } else {
        console.error('❌ Não foi possível obter cartId');
      }
    } catch (error) {
      console.error('❌ Erro ao buscar cart:', error);
    }
  };

  // Calcular total inicial (sem frete)
  useEffect(() => {
    const calculateInitialTotal = async () => {
      console.log('🎯 Calculando total inicial SEM FRETE, carrinho do contexto:', cart);
      
      // LIMPAR qualquer frete anterior do sessionStorage
      try {
        sessionStorage.removeItem('selected_shipping_price');
        sessionStorage.removeItem('selected_shipping_id');
        console.log('🧹 Limpou frete anterior do sessionStorage');
      } catch (e) {}
      
      // Se o carrinho do contexto está vazio, não faz sentido calcular
      if (cart.length === 0) {
        console.log('⚠️ Carrinho vazio no contexto');
        const emptyData = {
          subtotal: 0,
          freight: 0, // SEM FRETE INICIAL
          total: 0,
          itemCount: 0
        };
        setBackendTotal(emptyData);
        return;
      }

      // Calcular apenas o subtotal dos produtos, SEM FRETE
      const contextSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const initialData = {
        subtotal: contextSubtotal,
        freight: 0, // INICIALMENTE SEM FRETE
        total: contextSubtotal, // TOTAL = APENAS SUBTOTAL
        itemCount: cart.length
      };
      
      console.log('✅ Dados iniciais (SEM FRETE):', initialData);
      setBackendTotal(initialData);
    };

    calculateInitialTotal();
  }, [cart]); // Dependência do cart para recalcular quando mudar

  const handleContinue = () => {
    if (!selected) return;

    (async () => {
      try {
        // read cart id from api/cart
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

        const cartRes = await fetch(`/api/cart?sessionId=${sessionId}`);
        const cartData = cartRes.ok ? await cartRes.json() : null;
        const cartId = cartData?.id;

        const shippingPrice = Number(selected.price || selected.price_in_cents || 0);
        
        // Usar o total já calculado do backend se disponível
        const totalFromBackend = backendTotal?.total;
        const subtotalFromBackend = backendTotal?.subtotal;
        
        const body = { 
          cartId, 
          shippingId: selected.id, 
          shippingPrice,
          total: totalFromBackend, // ENVIAR O TOTAL CALCULADO
          subtotal: subtotalFromBackend // ENVIAR O SUBTOTAL CALCULADO
        };
        
        console.log('💳 ENVIANDO para create-payment:', {
          cartId,
          shippingId: selected.id,
          shippingPrice,
          total: totalFromBackend,
          subtotal: subtotalFromBackend,
          selectedOption: selected,
          backendTotalCompleto: backendTotal
        });

        const res = await fetch('/api/checkout/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const err = await res.json();
          setError(err?.error || 'Erro ao iniciar pagamento');
          return;
        }

        const data = await res.json();
        if (data?.init_point) {
          window.location.href = data.init_point;
        } else {
          setError('Erro ao obter link de pagamento');
        }
      } catch (e) {
        console.error(e);
        setError('Erro ao iniciar pagamento');
      }
    })();
  };

  // persist selected shipping so resumo can read it
  useEffect(() => {
    try {
      if (selected) {
        sessionStorage.setItem('selected_shipping_price', String(selected.price || selected.price_in_cents || 0));
        sessionStorage.setItem('selected_shipping_id', String(selected.id || selected.service_id || ''));
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
                  <input type="radio" name="shipping" className="sr-only" onChange={() => handleFreteSelection(opt)} />
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
              <Truck className="w-5 h-5 inline-block mr-2" /> Continuar para Pagamento
            </button>
          </div>
        </div>

        <div className="lg:w-80 lg:flex-shrink-0">
          <ResumoCompra 
            backendTotal={backendTotal}
          />
        </div>
      </div>
    </div>
  );
}
