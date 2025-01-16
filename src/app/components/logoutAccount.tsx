"use client"

import { signOut } from "next-auth/react"
import { FaSignOutAlt } from "react-icons/fa"

export function LogoutButton() {
    return (
        <button
            onClick={() => signOut()}
            className="sm:flex sm:pt-[5px] sm:px-2 sm:pb-[5px] px-4 p-1 flex items-center gap-2 text-slate-800 hover:text-white focus:text-white rounded-md transition duration-200"
        >
            <FaSignOutAlt className="md:w-[24px] md:h-[24px] w-4 h-4" /> Sair
        </button>
    )
}

export function LogoutDashboard() {
    return (
        <button
            onClick={() => signOut()}
            title='Configurações'
            className="flex items-center w-full gap-2 p-2 rounded-md text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200">
            <FaSignOutAlt size={24} />
            <span className='hidden xl:block'>Sair</span>
        </button>
    )
}

export function LogoutMenu() {
    return (
        <button
            onClick={() => signOut()}
            className="flex p-2 pt-[5px] pb-[5px] text-slate-800 text-base items-center gap-2 hover:bg-slate-300 rounded-md"
        >
            <FaSignOutAlt size={24} className="text-slate-500" /> Sair
        </button>
    )
}