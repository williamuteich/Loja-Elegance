"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cartContext";
import ResumoPedido from "../component/resumoPedido";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, CreditCard, Banknote, Landmark, QrCode, Check } from "lucide-react";

export default function CheckoutPagamento() {
  const [pagamento, setPagamento] = useState("");
  const [troco, setTroco] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    if (pagamento === "dinheiro" || pagamento === "outros") {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [pagamento]);

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto p-6">
      {/* Seção de pagamento */}
      <div className="w-full md:w-1/2">
        <Card className="mb-6 border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-pink-600 text-xl font-bold">Forma de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Dinheiro */}
              <label 
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  pagamento === "dinheiro" 
                    ? "border-pink-600 bg-pink-50" 
                    : "border-gray-200 hover:border-pink-200"
                }`}
                onClick={() => setPagamento("dinheiro")}
              >
                <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                  pagamento === "dinheiro" ? "border-pink-600 bg-pink-600" : "border-gray-400"
                }`}>
                  {pagamento === "dinheiro" && <Check className="w-4 h-4 text-white" />}
                </div>
                <div className="flex items-center gap-3">
                  <Wallet className="w-6 h-6 text-pink-600" />
                  <span className="text-lg font-medium">Dinheiro</span>
                </div>
              </label>

              {/* Outras formas de pagamento */}
              <label 
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  pagamento === "outros" 
                    ? "border-pink-600 bg-pink-50" 
                    : "border-gray-200 hover:border-pink-200"
                }`}
                onClick={() => setPagamento("outros")}
              >
                <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                  pagamento === "outros" ? "border-pink-600 bg-pink-600" : "border-gray-400"
                }`}>
                  {pagamento === "outros" && <Check className="w-4 h-4 text-white" />}
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-pink-600" />
                  <span className="text-lg font-medium">Outras Formas</span>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        <Button 
          className="w-full py-4 text-lg font-bold bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors shadow-md"
          disabled={!pagamento}
        >
          Confirmar Pagamento
        </Button>
      </div>

      {/* Resumo do pedido */}
      <div className="w-full md:w-1/2">
        <ResumoPedido cart={cart} />
      </div>

      {/* Modal de pagamento */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="rounded-lg max-w-md p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-pink-600 font-bold text-xl">
              {pagamento === "dinheiro" ? "Precisa de Troco?" : "Métodos de Pagamento"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* Modal para Dinheiro */}
            {pagamento === "dinheiro" && (
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input 
                    type="radio"
                    name="troco"
                    value="sim"
                    checked={troco === "sim"}
                    onChange={(e) => setTroco(e.target.value)}
                    className="w-5 h-5 text-pink-600"
                  />
                  <span className="text-gray-700">Sim, Eu preciso de troco</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="radio"
                    name="troco"
                    value="nao"
                    checked={troco === "nao"}
                    onChange={(e) => setTroco(e.target.value)}
                    className="w-5 h-5 text-pink-600"
                  />
                  <span className="text-gray-700">Não, Eu não preciso de troco</span>
                </label>
              </div>
            )}

            {/* Modal para Outras Formas de Pagamento */}
            {pagamento === "outros" && (
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-5 h-5 text-pink-600" />
                  <span className="text-gray-700">Depósito en ABITAB o RED PAGOS</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-5 h-5 text-pink-600" />
                  <span className="text-gray-700">Transferencia bancaria</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-5 h-5 text-pink-600" />
                  <span className="text-gray-700">Tarjetas de crédito: podés pagar en cuotas a través de Mercado Pago</span>
                </label>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
