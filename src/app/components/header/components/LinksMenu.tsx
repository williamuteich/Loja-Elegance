import Link from "next/link";

export default function LinksMenu() {
  return (
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
  );
}
