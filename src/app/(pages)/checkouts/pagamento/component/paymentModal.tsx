import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PaymentModalProps {
  pagamento: string;
  setPagamentoDetalhado: (value: string) => void;
  setTroco: (value: string) => void;
  setFinalLayout: (value: boolean) => void;
  setFinalCashInfo: (info: { cashInHand: string; change: number }) => void;
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
}

const paymentMethods = [
  "Depósito en ABITAB o RED PAGOS",
  "Transferência bancária",
  "Tarjetas de crédito: podés pagar en cuotas a través de Mercado Pago"
];

export default function PaymentModal({ pagamento, setPagamentoDetalhado, setTroco, setFinalLayout, setFinalCashInfo, modalOpen, setModalOpen }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState("");
  
  const handleMethodSelection = (method: string) => {
    setSelectedMethod(method);
    setPagamentoDetalhado(method);
  };
  
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="rounded-lg max-w-md p-6 bg-white">
        <DialogHeader>
          <DialogTitle className="text-pink-600 font-bold text-xl">
            {pagamento === "dinheiro" ? "¿Necesita cambio?" : "Otras formas de pago"}
          </DialogTitle>
        </DialogHeader>
        {pagamento === "dinheiro" && (
          <div className="flex gap-4 mt-4">
            <Button
              className="w-1/2 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg"
              onClick={() => setTroco("sim")}
            >
              Si
            </Button>
            <Button
              className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg"
              onClick={() => {
                setTroco("nao");
                setModalOpen(false);
                setFinalLayout(true);
                setFinalCashInfo({ cashInHand: "0.00", change: 0 });
              }}
            >
              No
            </Button>
          </div>
        )}
        {pagamento === "outros" && (
          <div className="space-y-3 mt-4">
            {paymentMethods.map((method) => (
              <label
                key={method}
                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedMethod === method ? "border-pink-600 bg-pink-50" : "border-gray-200 hover:border-pink-200"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  className="hidden"
                  onChange={() => handleMethodSelection(method)}
                  checked={selectedMethod === method}
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedMethod === method ? "border-pink-600 bg-pink-600" : "border-gray-400"
                }`}>
                  {selectedMethod === method && <div className="w-3 h-3 bg-white rounded-full" />}
                </div>
                <span className="text-lg font-medium">{method}</span>
              </label>
            ))}
            <Button
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg mt-4"
              onClick={() => {
                setModalOpen(false);
                setFinalLayout(true);
              }}
              disabled={!selectedMethod}
            >
              Confirmar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
