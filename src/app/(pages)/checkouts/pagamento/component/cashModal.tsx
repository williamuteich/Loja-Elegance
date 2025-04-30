"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CashModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderAmount: number;
  onConfirm: (info: { cashInHand: string; change: number }) => void;
}

export default function CashModal({ isOpen, onClose, orderAmount, onConfirm }: CashModalProps) {
  const [cashInHand, setCashInHand] = useState(orderAmount.toFixed(2));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "").slice(0, 10);
    setCashInHand(value);
  };

  const cashValue = parseFloat(cashInHand) || 0;
  const change = cashValue >= orderAmount ? cashValue - orderAmount : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 bg-white rounded-lg shadow-lg max-w-sm">
        <DialogTitle className="text-lg font-semibold text-gray-900 text-center">
          ¿Cuánto cambio?
        </DialogTitle>
        <p className="text-center text-gray-700 text-lg font-medium">
          Total: UYU {orderAmount.toFixed(2)}
        </p>
        <div className="mt-4 text-center">
          <div className="flex justify-center items-center text-4xl font-semibold text-gray-900">
            <span className="pr-1">$U</span>
            <span className="inline-block">{cashInHand || "0.00"}</span>
          </div>
          <p className="text-sm text-gray-500">Ingrese el monto que tiene en mano.</p>
        </div>
        <input
          type="text"
          className="w-full text-center text-xl border border-gray-300 rounded p-2 mt-4"
          value={cashInHand}
          onChange={handleChange}
          placeholder="Ingrese el monto"
          maxLength={10}
        />
        <p className="mt-2 text-gray-700 text-center font-medium">
          CAMBIO: UYU {change.toFixed(2)}
        </p>
        <Button
          className="w-full mt-4 py-3 font-bold rounded bg-pink-600 hover:bg-pink-700 text-white transition"
          disabled={cashValue < orderAmount}
          onClick={() => onConfirm({ cashInHand, change })}  
        >
          Confirmar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
