import Link from "next/link";
import LinksMenu from "./components/LinksMenu";
import HeaderActions from "./components/HeaderActions";

export default function Header() {
  return (
    <header className="w-full z-50">
     <div className="bg-pink-500 text-gray-900">
        <div className="max-w-[1400px] mx-auto px-4 text-center sm:px-6 lg:px-8 text-gray-900">
          Frete Grátis para compras acima de R$ 100,00
        </div>
      </div>
      <div className="bg-white text-gray-900 font-bold shadow-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 pb-2">
            <div className="flex-shrink-0">
              <Link href="/" className="text-3xl font-bold text-pink-600">
                Elegance
              </Link>
            </div>

            <LinksMenu />

            <div>
              <HeaderActions />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}