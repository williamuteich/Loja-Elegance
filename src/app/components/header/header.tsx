import Link from "next/link";
import { FaBars, FaHome, FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  return (
    <header className="w-full z-50">
      <div className="bg-pink-500">
        <div className="max-w-[1400px] py-1 mx-auto px-4 font-medium text-center sm:px-6 lg:px-8 text-white">
          Frete Grátis para compras acima de R$ 100,00
        </div>
      </div>
      <div className="bg-white text-gray-900 font-bold shadow-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="flex items-center justify-between h-16 pb-2">
              <div className="flex-shrink-0">
                <Link
                  href="/"
                  className="text-3xl font-bold text-pink-600 hover:text-pink-800 transition-all monsieur-la-doulaise-regular"
                >
                  Elegance
                </Link>
              </div>
              <div className="hidden md:flex items-center justify-between gap-10">
                <Link href="/" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">
                  Inicio
                </Link>
                <Link href="/produtos" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">
                  Produtos
                </Link>
                <Link href="/sobre" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">
                  Sobre
                </Link>
                <Link href="/contato" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">
                  Contato
                </Link>
                <Link href="/faq" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">
                  FAQ
                </Link>
              </div>
              <div className="flex md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline"><FaBars size={16} /></Button>
                  </SheetTrigger>
                  <SheetContent className="bg-white p-6">
                    {/* Área de nome de usuário e ícone com fundo rosa */}
                    <div className="bg-pink-600 p-6 rounded-lg mb-6">
                      <div className="flex flex-col items-center text-white">
                        <FaUser size={30} />
                        <p className="font-semibold">William</p>
                      </div>
                    </div>

                    {/* Links do menu com ícones */}
                    <div className="space-y-4 mb-6">
                      <Link href="/" className="flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-800 transition-colors duration-300">
                        <FaHome size={20} />
                        Home
                      </Link>
                      <Link href="/produtos" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors duration-300">
                        <FaShoppingCart size={20} />
                        Produtos
                      </Link>
                      <Link href="/sobre" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors duration-300">
                        <FaUser size={20} />
                        Sobre
                      </Link>
                      <Link href="/contato" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors duration-300">
                        <FaUser size={20} />
                        Contato
                      </Link>
                      <Link href="/faq" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors duration-300">
                        <FaUser size={20} />
                        FAQ
                      </Link>
                    </div>

                    {/* Botão de sair */}
                    <Link href="/logout">
                      <Button variant="outline" className="w-full mt-4">
                        <FaSignOutAlt size={20} className="mr-2" />
                        Sair
                      </Button>
                    </Link>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
