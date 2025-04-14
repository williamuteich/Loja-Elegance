"use client"

import { useState, useEffect } from "react";
import { useCart } from "@/context/cartContext";
import { redirect } from "next/navigation";
import Link from "next/link";
import PaymentSelection from "./component/paymentSelection";
import ResumoPedido from "../component/resumoPedido";
import PaymentModal from "./component/paymentModal";
import CashModal from "./component/cashModal";
import { ArrowLeftIcon, CheckCircleIcon, CreditCardIcon, MapPinIcon } from "lucide-react";

type PickupLocation = {
  title: string
  description: string
}

export default function CheckoutPagamento() {
  const [pagamento, setPagamento] = useState("");
  const [troco, setTroco] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { cart } = useCart();
  const [pagamentoDetalhado, setPagamentoDetalhado] = useState("");
  
  const [finalLayout, setFinalLayout] = useState(false);
  const [finalCashInfo, setFinalCashInfo] = useState({ cashInHand: "", change: 0 });
  const [pickupLocation, setPickupLocation] = useState<PickupLocation | null>(null);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const endereco = localStorage.getItem("selectedPickupLocation");
      if (!endereco || endereco === "") {
        redirect("/checkouts");
      } else {
        try {
          const parsed: PickupLocation = JSON.parse(endereco);
          setPickupLocation(parsed);
        } catch (error) {
          console.error("Erro ao fazer parse do endereço:", error);
          redirect("/checkouts");
        }
      }
    }
  }, []);
  

  useEffect(() => {
    setModalOpen(pagamento === "dinheiro" || pagamento === "outros");
  }, [pagamento]);

  if (finalLayout) {
    return (
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex-1 bg-white rounded-xl shadow-lg p-2 md:p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-pink-600 mb-6 border-b-2 border-pink-100 pb-4">
            Confirmación Final del Pedido
          </h2>
  
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <CreditCardIcon className="w-5 h-5 text-pink-600" />
              Método de Pago
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tipo:</span>
                <strong className="text-pink-700">
                  {pagamento === "dinheiro" ? "Dinheiro" : pagamentoDetalhado}
                </strong>
              </div>
  
              {pagamento === "dinheiro" && (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  {finalCashInfo.cashInHand ? (
                    <>
                      <div className="flex justify-between">
                        <span>Importe Total:</span>
                        <span className="font-medium">
                          {new Intl.NumberFormat("es-UY", {
                            style: "currency",
                            currency: "UYU",
                          }).format(cart.reduce((total, item) => total + item.price * item.quantity, 0))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monto Entregado:</span>
                        <span className="font-medium">{finalCashInfo.cashInHand}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Vuelto:</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat("es-UY", {
                            style: "currency",
                            currency: "UYU",
                          }).format(finalCashInfo.change || 0)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-2">
                          Nenhum troco solicitado
                        </p>
                  )}
                </div>
              )}
            </div>
          </div>
  
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-pink-600" />
              Lugar de Retiro
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800 font-medium">{pickupLocation?.title || ""}</p>
              <p className="text-sm text-gray-500 mt-2">{pickupLocation?.description || ""}</p>
            </div>
          </div>
  
          <div className="flex flex-col sm:flex-row gap-4 mt-8 border-t border-gray-100 pt-6">
            <Link href="/checkouts" className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg transition-all duration-200">
                <ArrowLeftIcon className="w-5 h-5" />
                Modificar Pedido
              </button>
            </Link>
            <button
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              onClick={() => console.log("Pedido confirmado")}
            >
              <CheckCircleIcon className="w-5 h-5" />
              Confirmar la Orden
            </button>
          </div>
        </div>
  
        <div className="md:sticky md:top-8 h-fit flex-1">
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
