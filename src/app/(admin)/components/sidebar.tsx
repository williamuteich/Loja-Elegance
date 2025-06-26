"use client";
import { FaHome, FaUserCircle, FaQuestionCircle, FaBoxOpen, FaCog, FaTag, FaIndustry, FaFileAlt, FaImages, FaRegImage, FaGift, FaShippingFast, FaClipboardList, FaInstagram, FaShieldAlt } from 'react-icons/fa';
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

    return (
        <>
            <div className="xl:min-w-56 xl:flex hidden bg-gray-800">
                <div className='text-white xl:min-w-56 flex flex-col min-h-screen fixed w-[inherit] justify-between'>
                    <div>
                        <div className="p-4 text-center">
                            <h2 className="text-lg font-semibold underline hidden xl:block">Admin Dashboard</h2>
                        </div>
                        <ul className="space-y-2 p-2 xl:p-4">
                            <li>
                                <Link href="/">
                                    <div
                                        className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-700`}
                                        title='Ir para Home'
                                    >
                                        <FaHome size={24} />
                                        <span className='hidden xl:block'>Home</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/seguranca">
                                    <div
                                        className={`flex items-center gap-2 p-2 rounded-md ${isActive('/dashboard/seguranca') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                                        title='Segurança/2FA'
                                    >
                                        <FaShieldAlt size={24} />
                                        <span className='hidden xl:block'>Segurança/2FA</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard">
                                    <div
                                        className={`flex items-center gap-2 p-2 rounded-md ${isActive('/dashboard') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                                        title='Início'
                                    >
                                        <FaHome size={24} />
                                        <span className='hidden xl:block'>Inicio</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/usuarios">
                                    <div
                                        className={`flex items-center gap-2 p-2 rounded-md ${isActive('/dashboard/usuarios') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                                        title="Usuários"
                                    >
                                        <FaUserCircle size={24} />
                                        <span className="hidden xl:block">Usuários</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/produtos">
                                    <div
                                        className={`flex items-center gap-2 p-2 rounded-md ${isActive('/dashboard/produtos') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                                        title='Produtos'
                                    >
                                        <FaBoxOpen size={24} />
                                        <span className='hidden xl:block'>Produtos</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/faq">
                                    <div
                                        className={`flex items-center gap-2 p-2 rounded-md ${isActive('/dashboard/faq') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                                        title='FAQ'
                                    >
                                        <FaQuestionCircle size={24} />
                                        <span className='hidden xl:block'>FAQ</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/marca">
                                    <div
                                        className={`flex items-center gap-2 p-2 rounded-md ${isActive('/dashboard/marca') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                                        title='Marca'
                                    >
                                        <FaIndustry size={24} />
                                        <span className='hidden xl:block'>Marca</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/categoria">
                                    <div
                                        className={`flex items-center gap-2 p-2 rounded-md ${isActive('/dashboard/categoria') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                                        title='Categoria'
                                    >
                                        <FaTag size={24} />
                                        <span className='hidden xl:block'>Categoria</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/formulario">
                                    <div
                                        className={`flex items-center gap-2 p-2 rounded-md ${isActive('/dashboard/formulario') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                                        title='formulario'
                                    >
                                        <FaFileAlt size={24} />
                                        <span className='hidden xl:block'>Formulario</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/galeria">
                                    <div
                                        className={`flex items-center gap-2 p-2 rounded-md ${isActive('/dashboard/galeria') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                                        title='galeria'
                                    >
                                        <FaImages size={24} />
                                        <span className='hidden xl:block'>Galeria</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/banners">
                                    <div
                                        className={`flex items-center gap-2 p-2 rounded-md ${isActive('/dashboard/banners') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                                        title='banners'
                                    >
                                        <FaRegImage size={24} />
                                        <span className='hidden xl:block'>Banners</span>
                                    </div>
                                </Link>
                            </li>
                            {
                                <li>
                                    <Link href="/dashboard/envio">
                                        <div
                                            className={`flex items-center gap-2 p-2 rounded-md ${isActive('/dashboard/envio') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                                            title='envio'
                                        >
                                            <FaShippingFast size={24} />
                                            <span className='hidden xl:block'>Endereços</span>
                                        </div>
                                    </Link>
                                </li>
                            }
                            {
                                <li>
                                    <Link href="/dashboard/pedidos">
                                        <div
                                            className={`flex items-center gap-2 p-2 rounded-md ${isActive('/dashboard/pedidos') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                                            title='pedidos'
                                        >
                                            <FaClipboardList size={24} />
                                            <span className='hidden xl:block'>Pedidos</span>
                                        </div>
                                    </Link>
                                </li>
                            }
                            {
                                <li>
                                    <Link href="/dashboard/instagram">
                                        <div
                                            className={`flex items-center gap-2 p-2 rounded-md ${isActive('/dashboard/instagram') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                                            title='instagram'
                                        >
                                            <FaInstagram size={24} />
                                            <span className='hidden xl:block'>Instagram</span>
                                        </div>
                                    </Link>
                                </li>
                            }
                        </ul>
                    </div>

                    <div className="mb-6 space-y-2 p-2 xl:p-4">
                        <Link href="/dashboard/setup" className='text-white'>
                            <div
                                className={`flex items-center gap-2 p-2 rounded-md ${isActive('/dashboard/setup') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                                title='Configurações'
                            >
                                <FaCog size={24} />
                                <span className='hidden xl:block'>Configurações</span>
                            </div>
                        </Link>
                        <LogoutDashboard />
                    </div>
                </div>
            </div>

            <div className='xl:hidden absolute left-4 top-3'>
                <Sheet>
                    <SheetTrigger asChild>
                        <AlignJustify className="w-6 h-6 text-gray-800" />
                    </SheetTrigger>
                    <SheetContent
                        aria-describedby={undefined}
                        side="left"
                        className="bg-gray-800 p-6"
                    >
                        <SheetHeader>
                            <SheetTitle className="text-start">
                                <span className="text-2xl font-bold text-white">
                                    Dashboard
                                </span>
                            </SheetTitle>
                        </SheetHeader>

                        <div className="flex flex-col gap-6 min-h-screen py-4">
                            <div className="">
                                <Link href="/" className={`flex text-white items-center gap-2 p-2 rounded-md ${isActive('/') ? 'bg-gray-700' : ''}`}>
                                    <FaHome className="w-6 h-6" />
                                    <span>Home</span>
                                </Link>

                                <Link href="/dashboard/seguranca" className={`flex text-white items-center gap-2 p-2 rounded-md ${isActive('/dashboard/seguranca') ? 'bg-gray-700' : ''}`}>
                                    <FaShieldAlt className="w-6 h-6" />
                                    <span>Segurança/2FA</span>
                                </Link>
                            
                                <Link href="/dashboard" className={`flex text-white items-center gap-2 p-2 rounded-md ${isActive('/dashboard') ? 'bg-gray-700' : ''}`}>
                                    <FaHome className="w-6 h-6" />
                                    <span>Início</span>
                                </Link>
  
                                <Link href="/dashboard/usuarios" className={`flex text-white items-center gap-2 p-2 rounded-md ${isActive('/dashboard/usuarios') ? 'bg-gray-700' : ''}`}>
                                    <FaUserCircle className="w-6 h-6" />
                                    <span>Usuários</span>
                                </Link>

                                <Link href="/dashboard/produtos" className={`flex text-white items-center gap-2 p-2 rounded-md ${isActive('/dashboard/produtos') ? 'bg-gray-700' : ''}`}>
                                    <FaBoxOpen className="w-6 h-6" />
                                    <span>Produtos</span>
                                </Link>

                                <Link href="/dashboard/faq" className={`flex text-white items-center gap-2 p-2 rounded-md ${isActive('/dashboard/faq') ? 'bg-gray-700' : ''}`}>
                                    <FaQuestionCircle className="w-6 h-6" />
                                    <span>FAQ</span>
                                </Link>

                                <Link href="/dashboard/marca" className={`flex text-white items-center gap-2 p-2 rounded-md ${isActive('/dashboard/marca') ? 'bg-gray-700' : ''}`}>
                                    <FaIndustry className="w-6 h-6" />
                                    <span>Marca</span>
                                </Link>

                                <Link href="/dashboard/categoria" className={`flex text-white items-center gap-2 p-2 rounded-md ${isActive('/dashboard/categoria') ? 'bg-gray-700' : ''}`}>
                                    <FaTag className="w-6 h-6" />
                                    <span>Categoria</span>
                                </Link>

                                <Link href="/dashboard/formulario" className={`flex text-white items-center gap-2 p-2 rounded-md ${isActive('/dashboard/formulario') ? 'bg-gray-700' : ''}`}>
                                    <FaFileAlt className="w-6 h-6" />
                                    <span>Formulário</span>
                                </Link>

                                <Link href="/dashboard/galeria" className={`flex text-white items-center gap-2 p-2 rounded-md ${isActive('/dashboard/galeria') ? 'bg-gray-700' : ''}`}>
                                    <FaImages className="w-6 h-6" />
                                    <span>Galeria</span>
                                </Link>

                                <Link href="/dashboard/banners" className={`flex text-white items-center gap-2 p-2 rounded-md ${isActive('/dashboard/banners') ? 'bg-gray-700' : ''}`}>
                                    <FaRegImage className="w-6 h-6" />
                                    <span>Banners</span>
                                </Link>
                                <Link href="/dashboard/envio" className={`flex text-white items-center gap-2 p-2 rounded-md ${isActive('/dashboard/envio') ? 'bg-gray-700' : ''}`}>
                                    <FaShippingFast className="w-6 h-6" />
                                    <span>Endereços</span>
                                </Link>
                                <Link href="/dashboard/pedidos" className={`flex text-white items-center gap-2 p-2 rounded-md ${isActive('/dashboard/pedidos') ? 'bg-gray-700' : ''}`}>
                                    <FaClipboardList className="w-6 h-6" />
                                    <span>Pedidos</span>
                                </Link>
                                <Link href="/dashboard/instagram" className={`flex text-white items-center gap-2 p-2 rounded-md ${isActive('/dashboard/instagram') ? 'bg-gray-700' : ''}`}>
                                    <FaInstagram className="w-6 h-6" />
                                    <span>Instagram</span>
                                </Link>
                            </div>

                            <div className="mt-16 space-y-2 flex flex-col">
                                <Link href="/dashboard/setup" className={`flex text-white items-center gap-2 p-2 rounded-md ${isActive('/dashboard/setup') ? 'bg-gray-700' : ''}`}>
                                    <FaCog size={24} />
                                    <span>Configurações</span>
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
