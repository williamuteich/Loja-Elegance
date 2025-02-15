"use client";

import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/cartContext";
import Link from "next/link";

export default function CheckoutHeader() {
  const { cart, removeFromCart, addToCart, cartOpen, setCartOpen } = useCart();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Meu Carrinho"
          className="relative w-6 h-6 cursor-pointer hover:text-pink-600 transition-colors"
          onClick={() => setCartOpen(true)}
        >
          <ShoppingCart className="w-6 h-6" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="bg-white p-6 w-96" aria-label="Conteúdo do carrinho">
        <SheetTitle className="text-center">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">MEU CARRINHO</h1>
          </div>
        </SheetTitle>
        <div className="border-b mb-4" />

        {cart.length === 0 ? (
          <p className="flex items-center justify-center gap-2 text-black font-bold text-lg">
            <ShoppingCart size={24} className="mb-2 text-gray-800" />
            Seu carrinho está vazio.
          </p>
        ) : (
          <div className="space-y-6">
            <div className="overflow-y-auto max-h-[60vh]">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 border-b pb-4">
                  <Link href={`/produtos/${item.id}`} className="cursor-pointer">
                    <Image
                      src={item.imagePrimary}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-cover rounded-md w-auto h-auto"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link href={`/produtos/${item.id}`} className="cursor-pointer">
                    <h2 className="text-sm font-semibold">{item.name}</h2>
                    <p className="text-xs text-gray-500">Quantidade: {item.quantity}</p>
                    <p className="font-semibold text-sm mt-2">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.price * item.quantity)}
                    </p>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        className="w-6 h-6 flex justify-center items-center bg-gray-200 rounded-full"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <button
                        className="w-6 h-6 flex justify-center items-center bg-gray-200 rounded-full"
                        onClick={() => addToCart(item)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <p className="text-sm">Subtotal</p>
                <p className="font-semibold text-sm">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(subtotal)}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Frete</p>
                <p className="font-semibold text-sm text-green-500">GRÁTIS</p>
              </div>
              <div className="flex justify-between font-semibold text-base">
                <p>Total</p>
                <p>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(subtotal)}
                </p>
              </div>
            </div>
            <button className="w-full py-2 bg-black text-white font-semibold text-sm text-center rounded-md">
              FINALIZAR COMPRA
            </button>
          </div>
        )}
      </SheetContent>
      <SheetDescription className="sr-only">
        Este é o seu carrinho de compras. Aqui você pode ver os itens que você adicionou, incluindo suas quantidades e preços. Você pode remover itens ou ajustar a quantidade. O total da compra e o frete grátis também estão sendo exibidos. Finalize sua compra clicando no botão "Finalizar Compra".
      </SheetDescription>
    </Sheet>
  );
}
