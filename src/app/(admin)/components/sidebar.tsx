"use client";
import { FaHome, FaUserCircle, FaQuestionCircle, FaBoxOpen, FaSignOutAlt, FaCog, FaTag, FaIndustry } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { LogoutDashboard } from '@/app/components/logoutAccount';

export default function Sidebar() {
    const pathname = usePathname(); 

    const isActive = (path: string) => pathname === path;

    return (
        <>
            <div className="xl:w-64 xl:flex hidden bg-gray-800">
                <div className='text-white flex flex-col min-h-screen fixed w-[inherit] justify-between'>
                    <div>
                        <div className="p-4 text-center">
                            <h2 className="text-lg font-semibold underline hidden xl:block">Admin Dashboard</h2>
                        </div>
                        <ul className="space-y-2 p-2 xl:p-4">
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
        </>
    );
}
