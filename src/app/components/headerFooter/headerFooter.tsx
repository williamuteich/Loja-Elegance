"use client"
import Link from 'next/link';
import { FaHome, FaUser, FaBoxOpen, FaFire } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
const CheckoutHeader = dynamic(() => import('@/app/components/header/components/checkoutHeader'), { ssr: false });

export default function HeaderFooter() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-pink-50 to-rose-100 border-t border-rose-200 shadow-2xl flex justify-between items-center px-2 py-1 md:hidden">
      <Link href="/" className="flex flex-col items-center flex-1 py-2">
        <div className={`flex flex-col items-center w-full rounded-md p-1 ${isActive('/') ? 'bg-pink-100' : 'hover:bg-pink-50'}`}>
          <FaHome size={24} className={`${isActive('/') ? 'text-pink-600' : 'text-gray-700 group-hover:text-pink-600'}`} />
          <span className={`text-xs mt-1 font-semibold ${isActive('/') ? 'text-pink-600' : 'text-gray-700'}`}>Home</span>
        </div>
      </Link>
      <Link href="/profile" className="flex flex-col items-center flex-1 py-2">
        <div className={`flex flex-col items-center w-full rounded-md p-1 ${isActive('/profile') ? 'bg-pink-100' : 'hover:bg-pink-50'}`}>
          <FaUser size={24} className={`${isActive('/profile') ? 'text-pink-600' : 'text-gray-700 group-hover:text-pink-600'}`} />
          <span className={`text-xs mt-1 font-semibold ${isActive('/profile') ? 'text-pink-600' : 'text-gray-700'}`}>Perfil</span>
        </div>
      </Link>
      <div className="relative flex-1 flex flex-col items-center z-10">
        <div className="flex flex-col items-center group">
          <span className={`relative -top-10 flex items-center justify-center w-16 h-16 rounded-full shadow-xl border-4 border-white group-hover:scale-105 transition-transform ${isActive('/cart') ? 'bg-gradient-to-br from-pink-600 to-rose-600' : 'bg-gradient-to-br from-pink-500 to-rose-500'}`}>
            <Suspense fallback={<span className="w-6 h-6 animate-pulse bg-pink-200 rounded-full" />}> 
            <CheckoutHeader />
            </Suspense>
          </span>
          <span className={`text-xs mt-[-35px] font-semibold ${isActive('/cart') ? 'text-pink-600' : 'text-gray-700'}`}>Carrinho</span>
        </div>
      </div>
      <Link href="/order" className="flex flex-col items-center flex-1 py-2">
        <div className={`flex flex-col items-center w-full rounded-md p-1 ${isActive('/order') ? 'bg-pink-100' : 'hover:bg-pink-50'}`}>
          <FaBoxOpen size={24} className={`${isActive('/order') ? 'text-pink-600' : 'text-gray-700 group-hover:text-pink-600'}`} />
          <span className={`text-xs mt-1 font-semibold ${isActive('/order') ? 'text-pink-600' : 'text-gray-700'}`}>Pedidos</span>
        </div>
      </Link>
      <Link href="/promocoes" className="flex flex-col items-center flex-1 py-2">
        <div className={`flex flex-col items-center w-full rounded-md p-1 ${isActive('/promocoes') ? 'bg-pink-100' : 'hover:bg-pink-50'}`}>
          <FaFire size={24} className={`${isActive('/promocoes') ? 'text-pink-600' : 'text-gray-700 group-hover:text-pink-600'}`} />
          <span className={`text-xs mt-1 font-semibold ${isActive('/promocoes') ? 'text-pink-600' : 'text-gray-700'}`}>Promoções</span>
        </div>
      </Link>
    </footer>
  );
}