"use client";

import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/cartContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GoogleLoginButtonSmall from "@/components/auth/GoogleLoginButtonSmall";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Produto } from "@/utils/types/produto";

export default function CheckoutHeader() {
  const { cart, removeFromCart, addToCart, cartOpen, setCartOpen } = useCart();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { data: session } = useSession();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Meu Carrinho"
          className="relative w-6 h-6 cursor-pointer hover:text-red-600 transition-colors"
          onClick={() => setCartOpen(true)}
        >
          <ShoppingCart className="w-6 h-6 text-white md:text-neutral-600" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-700 border border-white md:border-none text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="bg-white p-6 w-96">
        <SheetTitle className="text-center">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-neutral-600">MEU CARRINHO</h1>
          </div>
        </SheetTitle>
        <div className="border-b mb-4" />

        {cart.length === 0 ? (
          <p className="flex items-center justify-center gap-2 text-pink-800 font-bold text-lg">
            <ShoppingCart size={24} className="mb-2 text-red-800" />
            Seu carrinho está vazio.
          </p>
        ) : (
          <div className="space-y-6">
            <div className="overflow-y-auto max-h-[60vh]">
              {cart.map((item) => (
                <div key={`${item.id}-${item.selectedVariantId}`} className="flex gap-4 border-b pb-4">
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
                      <h2 className="text-sm font-semibold text-red-800">{item.name}</h2>

                      <div className="flex items-center gap-2 mt-1 mb-1">
                        <span
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: item.variantDetails.hexCode }}
                        />
                        <span className="text-xs text-gray-700 font-medium">{item.variantDetails.color}</span>
                      </div>

                      <p className="text-xs text-gray-700">Quantidade: {item.quantity}</p>
                      <p className="font-semibold text-sm mt-2">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.price * item.quantity)}
                      </p>
                    </Link>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        className={`w-6 h-6 flex justify-center items-center bg-gray-200 rounded-full ${removingId === item.id ? "opacity-50" : ""
                          }`}
                        onClick={async () => {
                          setRemovingId(item.id);
                          try {
                            await removeFromCart(item.id, item.selectedVariantId);
                          } finally {
                            setRemovingId(null);
                          }
                        }}
                        disabled={removingId === item.id}
                      >
                        {removingId === item.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-600" />
                        )}
                      </button>

                      <span className="text-sm font-medium">{item.quantity}</span>

                      <button
                        className="w-6 h-6 flex justify-center items-center bg-gray-200 rounded-full disabled:opacity-50"
                        onClick={async () => {
                          setLoadingId(item.id);
                          try {
                            await addToCart({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              imagePrimary: item.imagePrimary,
                              selectedVariantId: item.selectedVariantId,
                              variants: [
                                {
                                  id: item.selectedVariantId,
                                  color: {
                                    name: item.variantDetails.color,
                                    hexCode: item.variantDetails.hexCode,
                                  },
                                  availableStock: item.variantDetails.availableStock,
                                },
                              ],
                            } as Produto & { selectedVariantId: string });
                          } finally {
                            setLoadingId(null);
                          }
                        }}
                        disabled={loadingId === item.id}
                      >
                        {loadingId === item.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          "+"
                        )}
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
                <p className="text-sm text-green-700 font-bold">Frete</p>
                <p className="font-extrabold text-sm text-gray-500">-</p>
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

            {session ? (
              <Link href={`/checkouts`}>
                <Button
                  className="w-full mt-4 py-2 bg-red-700 text-white font-semibold text-sm text-center rounded-md hover:bg-red-600"
                  onClick={() => setCartOpen(false)}
                >
                  Finalizar Compra
                </Button>
              </Link>
            ) : (
              <div>
                <div className="mb-2">
                  <GoogleLoginButtonSmall
                    callbackUrl="/checkouts"
                    className="w-full"
                  />
                </div>
                <div className="flex items-center mb-4">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 text-gray-500">ou</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div className="space-y-1 flex flex-col">
                  <Link href={`/login`}>
                    <Button
                      className="w-full py-2 bg-red-700 text-white font-semibold text-sm text-center rounded-md hover:bg-red-600"
                      onClick={() => setCartOpen(false)}
                    >
                      Entrar
                    </Button>
                  </Link>
                  <Link href={`/cadastro`}>
                    <Button
                      className="w-full py-2 bg-green-600 text-white font-semibold text-sm text-center rounded-md hover:bg-green-500"
                      onClick={() => setCartOpen(false)}
                    >
                      Criar Conta
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
      <SheetDescription className="sr-only">
        Este é o seu carrinho de compras. Aqui você pode ver os produtos adicionados, suas quantidades e preços.
        Você pode remover itens ou ajustar a quantidade. O subtotal e o frete também são exibidos. Finalize a compra
        clicando no botão "Finalizar Compra".
      </SheetDescription>
    </Sheet>
  );
}
