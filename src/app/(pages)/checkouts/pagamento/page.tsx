"use client"

import { useState, useEffect } from "react";
import { useCart } from "@/context/cartContext";
import { redirect } from "next/navigation";
import PaymentSelection from "./component/paymentSelection";
import ResumoPedido from "../component/resumoPedido";
import PaymentModal from "./component/paymentModal";
import CashModal from "./component/cashModal";
import { CardTitle } from "@/components/ui/card";

export default function CheckoutPagamento() {
  const [pagamento, setPagamento] = useState("");
  const [troco, setTroco] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { cart } = useCart();
  const [pagamentoDetalhado, setPagamentoDetalhado] = useState("");
  
  // Estado para controlar o novo layout final (após confirmação)
  const [finalLayout, setFinalLayout] = useState(false);
  // Estado para armazenar as informações do CashModal
  const [finalCashInfo, setFinalCashInfo] = useState({ cashInHand: "", change: 0 });
  const [pickupLocation, setPickupLocation] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const endereco = localStorage.getItem("selectedPickupLocation");
      if (!endereco || endereco === "") {
        redirect("/checkouts");
      }
      setPickupLocation(endereco || "");
    }
  }, []);

  useEffect(() => {
    setModalOpen(pagamento === "dinheiro" || pagamento === "outros");
  }, [pagamento]);

  if (finalLayout) {
    return (
      <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto p-6">
        <div className="flex-1 p-6 border rounded-lg shadow-lg bg-white">
        <CardTitle className="text-pink-600 text-xl">Confirmar Dados</CardTitle>
  
          <div className="space-y-4">
            <p className="text-lg font-medium text-gray-800">
              <span className="font-medium">Método de Pagamento: </span>
              {pagamento === "dinheiro" ? "Dinheiro" : pagamentoDetalhado}
            </p>
  
            {/* Pagamento em dinheiro */}
            {pagamento === "dinheiro" && finalCashInfo.cashInHand ? (
              <div className="space-y-4 mt-4">
                <div className="flex gap-2">
                  <span className="font-medium">Valor Total: </span>
                  <span className="font-bold">
                    {new Intl.NumberFormat("es-UY", {
                      style: "currency",
                      currency: "UYU",
                    }).format(cart.reduce((total, item) => total + item.price * item.quantity, 0))}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium">Valor Entregue: </span>
                  <span className="font-bold">{finalCashInfo.cashInHand}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium">Troco: </span>
                  <span className="font-bold">
                    {new Intl.NumberFormat("es-UY", {
                      style: "currency",
                      currency: "UYU",
                    }).format(finalCashInfo.change || 0)}
                  </span>
                </div>
              </div>
            ) : pagamento === "dinheiro" ? (
              <p className="mt-4 text-sm text-gray-600">Pagamento em dinheiro sem troco solicitado.</p>
            ) : null}
          </div>
  
          <div className="mt-6">
            <p className="text-lg font-medium text-gray-800">
              <span className="font-semibold">Local de Retirada: </span>
              {pickupLocation}
            </p>
          </div>
        </div>
  
        <div className="flex-1">
          <ResumoPedido cart={cart} />
        </div>
      </div>
    );
  }
  
  
  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto p-6">
      <div className="w-full md:w-1/2">
        <PaymentSelection pagamento={pagamento} setPagamento={setPagamento} />
      </div>
      <div className="w-full md:w-1/2">
        <ResumoPedido cart={cart} />
      </div>
      <PaymentModal
        pagamento={pagamento}
        setPagamentoDetalhado={setPagamentoDetalhado}
        setTroco={setTroco}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        setFinalLayout={setFinalLayout}
        setFinalCashInfo={setFinalCashInfo}
      />
      {troco === "sim" && (
        <CashModal
          isOpen={true}
          onClose={() => setTroco("")}
          orderAmount={cart.reduce((total, item) => total + item.price * item.quantity, 0)}
          onConfirm={(info) => {
            setFinalCashInfo(info);
            setFinalLayout(true);
            setModalOpen(false);
            setTroco("");
          }}
        />
      )}
    </div>
  );
}
