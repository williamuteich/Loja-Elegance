import {
  Sheet,
  SheetContent,

  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ShoppingCart } from "lucide-react";


export default function CheckoutHeader() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div
          role="button"
          aria-label="Meu Carrinho"
          className="w-6 h-6 cursor-pointer hover:text-pink-600 transition-colors"
        >
          <ShoppingCart className="w-6 h-6" />
        </div>
      </SheetTrigger>
      <SheetContent aria-describedby={undefined} side="right" className="bg-white p-6">
        <SheetTitle className="text-center">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">MEU CARRINHO</h1>
          </div>
        </SheetTitle>
        <div className="border-b mb-4" />
        <div className="space-y-6">
          <div className="flex gap-4">
            <img
              src="https://img.freepik.com/fotos-gratis/closeup-tiro-de-um-moderno-relogio-digital-preto-legal-com-uma-pulseira-de-couro-marrom_181624-3545.jpg?t=st=1736711185~exp=1736714785~hmac=8d109c7fcab1b7fa7b44adeea9bcb0ff5fb9adf499ba7b6d4f192a6f8b1e0ae7&w=740"
              alt="Relógio Tymos Eminence"
              className="w-28 h-28 object-cover"
            />

            <div className="flex-1">
              <h2 className="text-sm font-semibold">Relógio Tymos Eminence</h2>
              <p className="text-xs text-gray-500">Silver</p>
              <p className="font-semibold text-sm mt-2">R$ 239,71</p>
              <div className="flex items-center gap-2 mt-1">
                <button className="w-6 h-6 flex justify-center items-center bg-gray-200 rounded-full">
                  -
                </button>
                <span className="text-sm font-medium">1</span>
                <button className="w-6 h-6 flex justify-center items-center bg-gray-200 rounded-full">
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <p className="text-sm">Subtotal</p>
              <p className="font-semibold text-sm">R$ 239,71</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">Frete</p>
              <p className="font-semibold text-sm text-green-500">GRÁTIS</p>
            </div>
            <div className="flex justify-between font-semibold text-base">
              <p>Total</p>
              <p>R$ 280,46</p>
            </div>
          </div>
          <button className="w-full py-2 bg-black text-white font-semibold text-sm text-center rounded-md">
            FINALIZAR COMPRA
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}