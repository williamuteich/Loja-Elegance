"use client";
import { LogoutButton } from '@/app/components/logoutAccount';
import Link from 'next/link';
import { FaUserAlt, FaListAlt, FaKey, FaTachometerAlt } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import { useEffect } from 'react';

export default function NavProfile() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    const fullName = session?.user.name;

    const getInitials = (name: string) => {
        if (!name) return '';
        const nameParts = name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];

        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };

    const initials = getInitials(fullName || '');

    return (
        <div className="lg:w-1/3 bg-white border border-gray-300 rounded-xl shadow-lg h-fit w-full">
            <div className="flex gap-4 items-center p-6 border-b border-gray-300">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-semibold bg-pink-700 p-3 px-3 text-white rounded-2xl uppercase">{initials}</h1>
                    <div className="flex flex-col">
                        <p className="text-pink-700 font-bold text-lg">{session?.user.name}</p>
                        <p className="text-sm text-gray-500">{session?.user.email}</p>
                    </div>
                </div>
            </div>

            <div className="py-4 px-8">
                <nav className="space-y-1">
                    {session?.user.role === 'admin' && (
                        <Link
                            href="/dashboard"
                            className={`flex items-center gap-3 text-sm text-pink-700 ${isActive('/dashboard') ? 'bg-gray-100 ' : 'hover:bg-gray-100 '} cursor-pointer px-2 py-1 rounded-md`}
                        >
                            <FaTachometerAlt size={20} className="text-pink-700" />
                            <span>Dashboard</span>
                        </Link>
                    )}

                    <Link
                        href="/profile"
                        className={`flex items-center gap-3 text-sm text-pink-700 ${isActive('/profile') ? 'bg-gray-100 ' : 'hover:bg-gray-100 '} cursor-pointer px-2 py-1 rounded-md`}
                    >
                        <FaUserAlt size={20} className="text-pink-700" />
                        <span>Perfil</span>
                    </Link>
                    <Link
                        href="/order"
                        className={`flex items-center gap-3 text-sm text-pink-700 ${isActive('/order') ? 'bg-gray-100 ' : 'hover:bg-gray-100 '} cursor-pointer px-2 py-1 rounded-md`}
                    >
                        <FaListAlt size={20} className="text-pink-700" />
                        <span>Mis Pedidos</span>
                    </Link>
                    <Link
                        href="/reset-password"
                        className={`flex items-center gap-3 text-sm text-pink-700 ${isActive('/reset-password') ? 'bg-gray-100 ' : 'hover:bg-gray-100 '} cursor-pointer px-2 py-1 rounded-md`}
                    >
                        <FaKey size={20} className="text-pink-700" />
                        <span>Mi Contraseña</span>
                    </Link>

                    <LogoutButton />
                </nav>
            </div>
        </div>
    );
}
