"use client"

import { useState, useEffect } from "react";
import { useCart, CartItem } from "@/context/cartContext";
import { redirect } from "next/navigation";
import PaymentSelection from "./component/paymentSelection";
import ResumoPedido from "../component/resumoPedido";
import PaymentModal from "./component/paymentModal";
import CashModal from "./component/cashModal";
import ConfirmOrderLayout from "./component/confirmOrderLayout";
import CarrinhoVazio from "../component/carrinhoVazio";

type PickupLocation = {
  id: string;
  title: string;
  description: string;
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

  if (finalLayout && pickupLocation) {
    return (
      <ConfirmOrderLayout
        cart={cart}
        pagamento={pagamento}
        finalCashInfo={finalCashInfo}
        pagamentoDetalhado={pagamentoDetalhado}
        pickupLocation={pickupLocation}
      />
    );
  }

  if (cart.length === 0) {
    return (
      <CarrinhoVazio />
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
