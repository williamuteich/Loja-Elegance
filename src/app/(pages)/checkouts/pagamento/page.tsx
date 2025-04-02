"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cartContext";
import ResumoPedido from "../component/resumoPedido";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, CreditCard, Check } from "lucide-react";
import { redirect } from 'next/navigation'
import CashModal from "./component/cashModal";

export default function CheckoutPagamento() {
  const [pagamento, setPagamento] = useState("");
  const [troco, setTroco] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const endereco = localStorage.getItem("selectedPickupLocation");
      if (!endereco || endereco === "") {
        redirect("/checkouts");
      }
    }
  }, []);

  useEffect(() => {
    setModalOpen(pagamento === "dinheiro" || pagamento === "outros");
  }, [pagamento]);

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto p-6">
      <div className="w-full md:w-1/2">
        <Card className="mb-6 border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-pink-600 text-xl font-bold">Forma de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["dinheiro", "outros"].map((tipo) => (
                <label
                  key={tipo}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    pagamento === tipo
                      ? "border-pink-600 bg-pink-50"
                      : "border-gray-200 hover:border-pink-200"
                  }`}
                  onClick={() => setPagamento(tipo)}
                >
                  <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    pagamento === tipo ? "border-pink-600 bg-pink-600" : "border-gray-400"
                  }`}>
                    {pagamento === tipo && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex items-center gap-3">
                    {tipo === "dinheiro" ? <Wallet className="w-6 h-6 text-pink-600" /> : <CreditCard className="w-6 h-6 text-pink-600" />}
                    <span className="text-lg font-medium">{tipo === "dinheiro" ? "Dinheiro" : "Outras Formas"}</span>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="w-full md:w-1/2">
        <ResumoPedido cart={cart} />
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="rounded-lg max-w-md p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-pink-600 font-bold text-xl">
              {pagamento === "dinheiro" ? "Precisa de Troco?" : "Métodos de Pagamento"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {pagamento === "dinheiro" && (
              <div className="flex gap-4">
                <Button 
                  className="w-1/2 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg"
                  onClick={() => setTroco("sim")}
                >
                  Sim
                </Button>
                <Button 
                  className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg"
                  onClick={() => setTroco("nao")}
                >
                  Não
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {troco === "sim" && <CashModal isOpen={true} onClose={() => setTroco("")} orderAmount={cart.reduce((total, item) => total + item.price * item.quantity, 0)} products={cart} />}
    </div>
  );
}