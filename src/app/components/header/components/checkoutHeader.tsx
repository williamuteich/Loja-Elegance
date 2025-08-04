"use client";

import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/cartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import GoogleLoginButtonSmall from "@/components/auth/GoogleLoginButtonSmall";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Produto } from "@/utils/types/produto";

export default function CheckoutHeader() {
  const { cart, removeFromCart, addToCart, cartOpen, setCartOpen } = useCart();
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { data: session } = useSession();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Mi Carrito"
          className="relative w-6 h-6 cursor-pointer hover:text-pink-600 transition-colors"
          onClick={() => setCartOpen(true)}
        >
          <ShoppingCart className="w-6 h-6 md:text-gray-500 text-white" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-700 border border-white text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="bg-white p-6 w-full h-full max-w-full rounded-none md:w-96 md:max-w-[24rem] md:rounded-lg z-[99]">
        <SheetTitle className="text-center">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-pink-800">MI CARRITO</h1>
          </div>
        </SheetTitle>
        <div className="border-b mb-4" />

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="flex items-center justify-center gap-2 text-pink-800 font-bold text-lg">
              <ShoppingCart size={24} className="mb-2 text-pink-800" />
              Tu carrito está vacío.
            </p>
            <Button
              className="mt-2 px-4 py-2 bg-pink-600 border border-pink-700 text-white font-semibold text-base rounded-md transition-colors hover:bg-pink-700 hover:text-white focus:bg-pink-700 focus:text-white"
              onClick={() => setCartOpen(false)}
            >
              Cerrar Carrito
            </Button>
          </div>
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
                      <h2 className="text-sm font-semibold text-pink-800">{item.name}</h2>

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
                        className={`w-6 h-6 flex justify-center items-center bg-gray-200 rounded-full ${
                          removingId === item.id ? "opacity-50" : ""
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
                          <Trash2 className="w-4 h-4 text-red-500" />
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
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
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
                <p className="text-sm">Envío</p>
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
                  className="w-full mt-4 py-2 bg-pink-700 text-white font-semibold text-sm text-center rounded-md hover:bg-pink-600"
                  onClick={() => setCartOpen(false)}
                >
                  Confirmar Compra
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
                  <span className="mx-4 text-gray-500">o</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div className="space-y-1 flex flex-col">
                  <Link href={`/login`}>
                    <Button
                      className="w-full py-2 bg-pink-700 text-white font-semibold text-sm text-center rounded-md hover:bg-pink-600"
                      onClick={() => setCartOpen(false)}
                    >
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href={`/cadastro`}>
                    <Button
                      className="w-full py-2 bg-green-600 text-white font-semibold text-sm text-center rounded-md hover:bg-green-500"
                      onClick={() => setCartOpen(false)}
                    >
                      Crear Cuenta
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
      <SheetDescription className="sr-only">
        Este es tu carrito de compras. Aquí puedes ver los productos que agregaste, incluyendo sus cantidades y
        precios. Puedes eliminar artículos o ajustar las cantidades. El total de la compra y el envío gratuito también
        se muestran. Finaliza tu compra haciendo clic en el botón "Finalizar Compra".
      </SheetDescription>
    </Sheet>
  );
}
