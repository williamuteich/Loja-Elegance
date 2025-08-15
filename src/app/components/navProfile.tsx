"use client";
import { LogoutButton } from '@/app/components/logoutAccount';
import Link from 'next/link';
import { FaUserAlt, FaListAlt, FaKey, FaTachometerAlt } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";

export default function NavProfile() {
    const { data: session } = useSession();
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const fullName = session?.user.name || "";

    const getInitials = (name: string) => {
        if (!name) return '';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    };

    const initials = getInitials(fullName);

    return (
        <div className="lg:w-1/3 w-full bg-white border border-gray-300 rounded-xl shadow-lg h-fit">
            <div className="flex gap-4 items-center p-6 border-b border-gray-300">
                <h1 className="text-xl font-semibold bg-pink-700 p-3 text-white rounded-2xl uppercase">
                    {initials}
                </h1>
                <div className="flex flex-col">
                    <p className="text-pink-700 font-bold text-lg">{fullName}</p>
                    <p className="text-sm text-gray-500">{session?.user.email}</p>
                </div>
            </div>

            <div className="py-4 px-8">
                <nav className="space-y-1">
                    {session?.user.role === 'admin' && (
                        <Link
                            href="/dashboard"
                            className={`flex items-center gap-3 text-sm text-pink-700 px-2 py-1 rounded-md ${
                                isActive('/dashboard') ? 'bg-gray-100' : 'hover:bg-gray-100'
                            }`}
                        >
                            <FaTachometerAlt size={20} />
                            <span>Painel</span>
                        </Link>
                    )}

                    <Link
                        href="/profile"
                        className={`flex items-center gap-3 text-sm text-pink-700 px-2 py-1 rounded-md ${
                            isActive('/profile') ? 'bg-gray-100' : 'hover:bg-gray-100'
                        }`}
                    >
                        <FaUserAlt size={20} />
                        <span>Perfil</span>
                    </Link>

                    <Link
                        href="/order"
                        className={`flex items-center gap-3 text-sm text-pink-700 px-2 py-1 rounded-md ${
                            isActive('/order') ? 'bg-gray-100' : 'hover:bg-gray-100'
                        }`}
                    >
                        <FaListAlt size={20} />
                        <span>Meus Pedidos</span>
                    </Link>

                    <Link
                        href="/reset-password"
                        className={`flex items-center gap-3 text-sm text-pink-700 px-2 py-1 rounded-md ${
                            isActive('/reset-password') ? 'bg-gray-100' : 'hover:bg-gray-100'
                        }`}
                    >
                        <FaKey size={20} />
                        <span>Minha Senha</span>
                    </Link>

                    <LogoutButton />
                </nav>
            </div>
        </div>
    );
}
