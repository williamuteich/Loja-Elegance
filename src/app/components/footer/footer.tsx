"use client"

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) {
      return null;
  }

  return (
    <footer className="bg-black text-white py-10">
      <div className="container mx-auto px-4">
        <div>
          <div>
            <h2 className="font-bold text-xl mb-6">Elegance</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
            <div>
              <h3 className="font-semibold mb-4">Explore a Loja</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:underline">Masculino</Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">Feminino</Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">Mais Vendidos</Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">Todos os Produtos</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Nossas Políticas</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:underline">Envio e Entrega</Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">Devolução e Reembolso</Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">Privacidade</Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">Termos de Serviço</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Minha conta</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:underline">Entrar</Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">Criar conta</Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">Meus pedidos</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="mailto:contato@tymos.com.br" className="hover:underline">contato@tymos.com.br</Link>
                </li>
                <li>Atendimento das 8h às 17h</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Formas de Pagamento</h3>
              <div className="flex flex-wrap gap-4">
                <Image src="/visa.svg" alt="Visa" width={16} priority={false} height={16} className="h-8 w-auto" />
                <Image src="/mastercard.svg" width={16} height={16} priority={false} alt="Mastercard" className="h-8 w-auto" />
                <Image src="/pix.svg" width={16} height={16} priority={false} alt="Pix" className="h-8 w-auto" />
                <Image src="/boleto.svg" width={16} height={16} priority={false} alt="Boleto" className="h-8 w-auto" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm">© 2024 | Elegance | Todos os direitos reservados.</p>
          <Link className="text-sm hover:underline" href="https://wa.me/5196615024" target="_blank" rel="noopener noreferrer">
            &lt;/&gt; William Uteich       
          </Link>

        </div>
      </div>
    </footer>
  );
}
