"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Home, Package, Info, Phone, HelpCircle, Truck, User, ShoppingCart, AlignJustify } from "lucide-react";
import SearchHeaderItems from "./components/searchHeaderItems";
import CheckoutHeader from "./components/checkoutHeader";

export default function Header() {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const freteGratuitoSection = document.querySelector('.frete-gratuito');
      const fretePosition = freteGratuitoSection?.getBoundingClientRect().bottom;

      console.log("Altura de rolagem:", window.scrollY);
      console.log("Posição do Frete Grátis:", fretePosition);

      if (fretePosition && fretePosition <= 0) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full z-50">
      <div className="bg-pink-700 frete-gratuito">
        <div className="max-w-[1400px] py-1 mx-auto px-4 font-medium text-center text-sm sm:text-base sm:px-6 lg:px-8 text-white">
          Frete Grátis para compras acima de R$ 100,00
        </div>
      </div>

      <div
        className={`hidden md:block ${isFixed ? "hidden md:block sm:fixed z-10 top-0 left-0 w-full" : "relative"
          } transition-all bg-white text-gray-900 font-bold shadow-md shadow-pink-100`}
      >
        <div className="max-w-[1400px] mx-auto w-full sm:px-6 lg:px-8">
          <div className="flex items-center justify-between w-full h-16 pb-2">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-3xl font-bold text-pink-700 hover:text-pink-800 transition-all"
              >
                Elegance
              </Link>
            </div>

            <nav className="flex gap-8">
              <Link
                href="/"
                title="Inicio"
                className="text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
              >
                Inicio
              </Link>
              <Link
                href="/produtos"
                title="Produtos"
                className="text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
              >
                Produtos
              </Link>
              <Link
                href="/sobre"
                title="Sobre"
                className="text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
              >
                Sobre
              </Link>
              <Link
                href="/contato"
                title="Contato"
                className="text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
              >
                Contato
              </Link>
              <Link
                href="/faq"
                title="FAQ"
                className="text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
              >
                FAQ
              </Link>
            </nav>


            <div className="flex gap-4 text-gray-600">
              <SearchHeaderItems />

              <Link
                href="/rastreamento"
                className="hover:text-pink-600 transition-colors duration-300"
              >
                <Truck className="w-6 h-6" />
              </Link>
              <Link
                href="/login"
                className="hover:text-pink-600 transition-colors duration-300"
              >
                <User className="w-6 h-6" />
              </Link>
              <CheckoutHeader />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${isFixed ? "fixed z-10 top-0 left-0 w-full" : "relative"
          } transition-all bg-white text-gray-900 font-bold shadow-md shadow-pink-100 md:hidden`}
      >
        <div className="flex justify-between md:hidden max-w-[1400px] mx-auto w-full px-4 py-4 bg-white text-gray-900 font-bold shadow-md">
          <div className="flex justify-between items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <AlignJustify className="w-6 h-6 text-gray-700" />
              </SheetTrigger>

              <SheetContent aria-describedby={undefined} side="left" className="bg-white p-6">
                <SheetHeader>
                  <SheetTitle className="text-center">
                    <span className="text-3xl font-bold text-pink-600 hover:text-pink-800 transition-all">
                      Elegance
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <div className="grid gap-6 py-4 border-t-[1px] border-gray-300 mt-6">
                  <nav className="flex flex-col gap-6">
                    <Link
                      href="/rastreamento"
                      aria-label="Rastreamento de pedidos"
                      className="flex items-center gap-3 text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
                    >
                      <Truck className="w-6 h-6" aria-hidden="true" />
                      <span>Rastrear Pedido</span>
                    </Link>
                    <span className="font-medium text-xl">Explore</span>
                    <Link
                      href="/"
                      title="Início"
                      aria-label="Início"
                      className="flex items-center gap-3 text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
                    >
                      <Home className="w-6 h-6" aria-hidden="true" />
                      <span>Início</span>
                    </Link>

                    <Link
                      href="/produtos"
                      title="Produtos"
                      aria-label="Produtos"
                      className="flex items-center gap-3 text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
                    >
                      <Package className="w-6 h-6" aria-hidden="true" />
                      <span>Produtos</span>
                    </Link>

                    <Link
                      href="/sobre"
                      title="Sobre"
                      aria-label="Sobre"
                      className="flex items-center gap-3 text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
                    >
                      <Info className="w-6 h-6" aria-hidden="true" />
                      <span>Sobre</span>
                    </Link>

                    <Link
                      href="/contato"
                      title="Contato"
                      aria-label="Contato"
                      className="flex items-center gap-3 text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
                    >
                      <Phone className="w-6 h-6" aria-hidden="true" />
                      <span>Contato</span>
                    </Link>

                    <Link
                      href="/faq"
                      title="FAQ"
                      aria-label="FAQ"
                      className="flex items-center gap-3 text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
                    >
                      <HelpCircle className="w-6 h-6" aria-hidden="true" />
                      <span>FAQ</span>
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <SearchHeaderItems />
          </div>

          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-bold text-pink-600 cursor-pointer hover:text-pink-800 transition-all">
              Elegance
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4 text-gray-600">
            <button title="Usuários" className="hover:text-pink-600 cursor-pointer transition-colors duration-300">
              <User className="w-6 h-6" />
            </button>

            <CheckoutHeader />

          </div>
        </div>
      </div>
    </header>
  );
}
