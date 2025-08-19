"use client";
import {
  FaHome, FaUserCircle, FaQuestionCircle, FaBoxOpen, FaCog,
  FaTag, FaIndustry, FaImages, FaRegImage,
  FaGift, FaShippingFast, FaClipboardList, FaInstagram,
  FaShieldAlt, FaRocket
} from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutDashboard } from '@/app/components/logoutAccount';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlignJustify } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const items = [
    { href: "/", label: "Home", icon: <FaHome className="w-6 h-6" /> },
    { href: "/dashboard", label: "Dados Gerais", icon: <FaRocket className="w-6 h-6" /> },
    { href: "/dashboard/seguranca", label: "Segurança/2FA", icon: <FaShieldAlt className="w-6 h-6" /> },
    { href: "/dashboard/usuarios", label: "Usuários", icon: <FaUserCircle className="w-6 h-6" /> },
    { href: "/dashboard/produtos", label: "Produtos", icon: <FaBoxOpen className="w-6 h-6" /> },
    { href: "/dashboard/promocao", label: "Promoção", icon: <FaGift className="w-6 h-6" /> },
    { href: "/dashboard/faq", label: "FAQ", icon: <FaQuestionCircle className="w-6 h-6" /> },
    { href: "/dashboard/marca", label: "Marca", icon: <FaIndustry className="w-6 h-6" /> },
    { href: "/dashboard/categoria", label: "Categoria", icon: <FaTag className="w-6 h-6" /> },
    { href: "/dashboard/galeria", label: "Galeria", icon: <FaImages className="w-6 h-6" /> },
    { href: "/dashboard/banners", label: "Banners", icon: <FaRegImage className="w-6 h-6" /> },
    { href: "/dashboard/envio", label: "Endereços", icon: <FaShippingFast className="w-6 h-6" /> },
    { href: "/dashboard/pedidos", label: "Pedidos", icon: <FaClipboardList className="w-6 h-6" /> },
    { href: "/dashboard/instagram", label: "Instagram", icon: <FaInstagram className="w-6 h-6" /> },
  ];

  const config = { href: "/dashboard/setup", label: "Configurações", icon: <FaCog size={24} /> };

  return (
    <>
      <div className="xl:min-w-56 xl:flex hidden bg-gray-900">
        <div className="text-white xl:min-w-56 flex flex-col min-h-screen fixed w-[inherit] max-h-screen overflow-y-auto custom-scrollbar">
          <div className="p-4 text-center">
            <h2 className="text-2xl font-extrabold animated-title">Bazar Elegance</h2>
          </div>
          <ul className="space-y-2 p-2 xl:p-4">
            {items.map(item => (
              <li key={item.href}>
                <Link href={item.href}>
                  <div className={`flex items-center gap-2 p-2 rounded-md ${isActive(item.href) ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                    {item.icon}
                    <span className="hidden xl:block">{item.label}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mb-6 space-y-2 p-2 xl:p-4">
            <Link href={config.href} className="text-white">
              <div className={`flex items-center gap-2 p-2 rounded-md ${isActive(config.href) ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                {config.icon}
                <span className="hidden xl:block">{config.label}</span>
              </div>
            </Link>
            <LogoutDashboard />
          </div>
        </div>
      </div>

      <div className="xl:hidden absolute left-4 top-3 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <AlignJustify className="w-6 h-6 text-gray-800" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-gray-900 p-6 h-screen flex flex-col max-h-screen overflow-y-auto custom-scrollbar"
          >
            <SheetHeader>
              <SheetTitle className="text-center">
                <span className="text-3xl font-bold animated-title">Bazar Elegance</span>
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-6 min-h-screen py-4">
              <div className="flex flex-col gap-1">
                {items.map(item => (
                  <Link key={item.href} href={item.href}>
                    <div className={`flex text-white items-center gap-2 p-2 rounded-md ${isActive(item.href) ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-16 space-y-2 flex flex-col">
                <Link href={config.href}>
                  <div className={`flex text-white items-center gap-2 p-2 rounded-md ${isActive(config.href) ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                    {config.icon}
                    <span>{config.label}</span>
                  </div>
                </Link>
                <LogoutDashboard />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
