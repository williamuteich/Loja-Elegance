import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-pink-700 text-white py-6 sm:py-8 lg:py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center sm:text-left">
        <div>
          <h2 className="font-bold text-2xl mb-4">Elegance</h2>
          <div className="flex justify-center sm:justify-start space-x-4 mt-4">
            <Link href="#" aria-label="Facebook" className="hover:text-pink-200">
              <FaFacebook size={24} />
            </Link>
            <Link href="#" aria-label="Instagram" className="hover:text-pink-200">
              <FaInstagram size={24} />
            </Link>
            <Link href="#" aria-label="Twitter" className="hover:text-pink-200">
              <FaTwitter size={24} />
            </Link>
            <Link href="#" aria-label="LinkedIn" className="hover:text-pink-200">
              <FaLinkedin size={24} />
            </Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4">Explore a Loja</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:text-pink-200 transition-colors">
                Masculino
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-pink-200 transition-colors">
                Feminino
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-pink-200 transition-colors">
                Mais Vendidos
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-pink-200 transition-colors">
                Todos os Produtos
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4">Nossas Políticas</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:text-pink-200 transition-colors">
                Envio e Entrega
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-pink-200 transition-colors">
                Devolução e Reembolso
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-pink-200 transition-colors">
                Privacidade
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-pink-200 transition-colors">
                Termos de Serviço
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4">Minha conta</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:text-pink-200 transition-colors">
                Entrar
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-pink-200 transition-colors">
                Criar conta
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-pink-200 transition-colors">
                Meus pedidos
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4">Contato</h3>
          <p className="mb-2">contato@tymos.com.br</p>
          <p className="text-sm">Atendimento das 8h às 17h</p>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-10 border-t border-pink-500 pt-6 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 text-center sm:text-left">
        <p className="text-sm order-2 sm:order-1">© 2024 | Elegance | Todos os direitos reservados.</p>
        <div className="flex flex-col justify-center gap-4 order-1 sm:order-2">
          <p>Formas de pagamentos</p>
          <div className="flex gap-2">
            <img src="/visa.svg" alt="Visa" className="h-8" />
            <img src="/mastercard.svg" alt="Mastercard" className="h-8" />
            <img src="/mercadoPago.svg" alt="Mercado Pago" className="h-8" />
            <img src="/pix.svg" alt="Pix" className="h-8" />
            <img src="/boleto.svg" alt="Boleto" className="h-8" />
          </div>
        </div>
      </div>

    </footer>
  );
}
