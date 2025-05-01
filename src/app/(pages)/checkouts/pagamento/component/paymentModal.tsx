import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Landmark, Banknote, CreditCard, QrCode } from "lucide-react"; // Ícones para métodos de pagamento


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
  {
    label: "Depósito en ABITAB o RED PAGOS",
    icon: <Landmark className="w-6 h-6 text-pink-600 mr-3" />,
    value: "Depósito en ABITAB o RED PAGOS"
  },
  {
    label: "Transferencia bancaria",
    icon: <Banknote className="w-6 h-6 text-pink-600 mr-3" />,
    value: "Transferencia bancaria"
  },
  {
    label: "Tarjeta de crédito: puedes pagar en cuotas a través de Mercado Pago",
    icon: <CreditCard className="w-6 h-6 text-pink-600 mr-3" />,
    value: "Tarjeta de crédito: puedes pagar en cuotas a través de Mercado Pago"
  },
  {
    label: "PIX",
    icon: <QrCode className="w-6 h-6 text-pink-600 mr-3" />,
    value: "PIX"
  }
];

export default function PaymentModal({ pagamento, setPagamentoDetalhado, setTroco, setFinalLayout, setFinalCashInfo, modalOpen, setModalOpen }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState("");
  
  const handleMethodSelection = (method: string) => {
    setSelectedMethod(method);
    setPagamentoDetalhado(method);
  };
  
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="rounded-lg max-w-md p-6 bg-white shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-pink-600 font-bold text-xl">
            {pagamento === "dinheiro" ? "¿Necesita cambio?" : "Otros métodos de pago"}
          </DialogTitle>
          <p className="text-gray-500 text-sm mt-1" id="payment-modal-desc">
            {pagamento === "dinheiro"
              ? "Por favor, indícanos si necesitas cambio para tu pago en efectivo."
              : "Selecciona tu método de pago preferido para continuar con tu compra."}
          </p>
        </DialogHeader>
        {pagamento === "dinheiro" && (
          <div className="flex gap-4 mt-4">
            <Button
              className="w-1/2 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg"
              onClick={() => setTroco("sim")}
            >
              Sí
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
                key={method.value}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedMethod === method.value ? "border-pink-600 bg-pink-50" : "border-gray-200 hover:border-pink-200"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.value}
                  className="hidden"
                  onChange={() => handleMethodSelection(method.value)}
                  checked={selectedMethod === method.value}
                />
                {method.value === 'PIX' ? (
                  <div className="relative">
                    <QrCode className="w-6 h-6 text-pink-600 mr-3" />
                  </div>
                ) : method.icon}
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-gray-800">{method.label.split(':')[0]}</span>
                  {method.label.includes(':') && (
                    <span className="text-sm text-gray-500 mt-1">
                      {method.label.split(':')[1].trim()}
                    </span>
                  )}
                </div>
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