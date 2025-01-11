import Link from "next/link";

export default function LinksMenu() {
  return (
    <div className="flex items-center justify-between gap-10">
      <Link href="/Inicio" className="text-gray-900 hover:text-pink-600 transition-colors duration-300">
        Inicio
      </Link>
      <Link href="/produtos" className="text-gray-900 hover:text-pink-600 transition-colors duration-300">
        Produtos
      </Link>
      <Link href="/sobre" className="text-gray-900 hover:text-pink-600 transition-colors duration-300">
        Sobre
      </Link>
      <Link href="/contato" className="text-gray-900 hover:text-pink-600 transition-colors duration-300">
        Contato
      </Link>
      <Link href="/faq" className="text-gray-900 hover:text-pink-600 transition-colors duration-300">
        FAQ
      </Link>
    </div>
  );
}
