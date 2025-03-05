"use client"

import { signOut } from "next-auth/react"
import { FaSignOutAlt } from "react-icons/fa"

export function LogoutButton() {
    return (
        <button
            onClick={() => signOut()}
            className=" px-2 py-1 text-sm flex items-center gap-2 text-pink-700 hover:text-red-700 hover:bg-gray-100 w-full focus:text-red-800 transition"
        >
            <FaSignOutAlt className="md:w-[24px] md:h-[24px] w-4 h-4" /> Salir
        </button>
    )
}

export function LogoutDashboard() {
    return (
        <button
            onClick={() => signOut()}
            title='sair'
            className="flex items-center w-full gap-2 p-2 rounded-md text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200">
            <FaSignOutAlt size={24} />
            <span>Sair</span>
        </button>
    )
}

export function LogoutMenu() {
    return (
        <button
            onClick={() => signOut()}
            aria-label="Log out"
            className="flex gap-1"
        >
            <FaSignOutAlt size={18} />
            Salir
        </button>
    )
}

export function LogoutMenuHome() {
    return (
        <button
            onClick={() => signOut()}
            aria-label="Log out"
        >
            <div className="flex gap-3  hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200">
                <FaSignOutAlt size={24}/>
                <p className="md:sr-only">Salir</p>
            </div>
        </button>
    )
}