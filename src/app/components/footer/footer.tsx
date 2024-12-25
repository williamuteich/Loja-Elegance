"use client"
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { usePathname } from "next/navigation";

interface dadosContatoProps{
  id: string;
  name: string;
  type: string;
  url: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export default function Footer({data}: { data: dadosContatoProps[] }) {
  const rotaUrl = usePathname();
  const resUrl = rotaUrl.includes("/dashboard");

  if (resUrl) {
    return null;
  }
  
  return (
    <footer className="bg-gray-800 relative text-white py-10">
      <Link className="fixed bottom-32 right-32" href="https://wa.me/51998682733" target="_blank" rel="noopener noreferrer">
        <FaWhatsapp
          className="w-16 h-16 text-green-500 hover:text-green-700 animate-pulse opacity-80 hover:opacity-100 transition-all"
        />
      </Link>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Links úteis</h3>
            <ul>
              <li><a href="/about" className="hover:text-blue-400">Sobre nós</a></li>
              <li><a href="/shop" className="hover:text-blue-400">Loja</a></li>
              <li><a href="/terms" className="hover:text-blue-400">Termos de serviço</a></li>
              <li><a href="/privacy" className="hover:text-blue-400">Política de privacidade</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Siga-nos</h3>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-500">
                <FaFacebookF className="h-6 w-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-500">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400">
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-700">
                <FaLinkedinIn className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Contato</h3>
            <ul>
              <li>Email: <a href="mailto:contato@ecommerce.com" className="hover:text-blue-400">contato@ecommerce.com</a></li>
              <li>Telefone: <a href="tel:+1234567890" className="hover:text-blue-400">+12 345 678 90</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Receba novidades</h3>
            <p className="text-gray-400 mb-4">Cadastre-se para receber nossas promoções e novidades diretamente no seu e-mail.</p>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none">
              Inscreva-se
            </button>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Ecommerce. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
