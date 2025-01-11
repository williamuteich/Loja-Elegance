import Link from "next/link";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";

export default function HeaderActions() {
  return (
    <div className="flex items-center gap-6">
      <Link 
        href="/" 
        className="text-pink-600 hover:text-pink-700 transition-colors duration-300"
        aria-label="Pesquisar"
      >
        <FaSearch size={20} />
      </Link>

      <Link 
        href="/carrinho" 
        className="text-pink-600 hover:text-pink-700 transition-colors duration-300"
        aria-label="Carrinho de compras"
      >
        <FaShoppingCart size={20} />
      </Link>

      <Link 
        href="/login" 
        className="text-pink-600 hover:text-pink-700 transition-colors duration-300"
        aria-label="Acessar conta"
      >
        <FaUser size={20} />
      </Link>
    </div>
  );
}
