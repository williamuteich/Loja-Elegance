import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Header() {
  return (
    <header className="w-full z-50">
      <div className="bg-gray-800 text-white py-2">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex space-x-6">
            <Link href="https://facebook.com" target="_blank" className="hover:text-blue-400">
              <FaFacebook className="h-6 w-6" />
            </Link>
            <Link href="https://twitter.com" target="_blank" className="hover:text-blue-400">
              <FaTwitter className="h-6 w-6" />
            </Link>
            <Link href="https://instagram.com" target="_blank" className="hover:text-blue-400">
              <FaInstagram className="h-6 w-6" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="hover:text-blue-400">
              <FaLinkedin className="h-6 w-6" />
            </Link>
          </div>
          <div>
            <span>Seja bem-vindo(a)</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 text-white shadow-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-blue-400">
                Ecommerce
              </Link>
            </div>

            <div className="flex items-center space-x-6 ml-auto">
              <Link href="/sobre" className="hover:text-blue-400">
                Sobre
              </Link>
              <Link href="/contato" className="hover:text-blue-400">
                Contato
              </Link>
              <Link href="/faq" className="hover:text-blue-400">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
