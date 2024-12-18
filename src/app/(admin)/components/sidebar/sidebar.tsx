import { FaHome, FaUserCircle, FaQuestionCircle, FaBoxOpen, FaSignOutAlt, FaCog } from 'react-icons/fa';
import Link from 'next/link';

export default function Sidebar() {
    return (
        <div className="w-64 bg-gray-800">
            <div className='text-white flex flex-col min-h-screen fixed w-[inherit] justify-between'>
                <div>
                    <div className="p-4 text-center">
                        <h2 className="text-lg font-semibold underline">Admin Dashboard</h2>
                    </div>
                    <ul className="space-y-2 p-4">
                        <li>
                            <Link href="/dashboard">
                                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
                                    <FaHome size={24} /> Inicio
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/usuarios">
                                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
                                    <FaUserCircle size={24} /> Usuários
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/produtos">
                                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
                                    <FaBoxOpen size={24} /> Produtos
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/faq">
                                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
                                    <FaQuestionCircle  size={24} /> FAQ
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="mb-6 p-4">
                    <Link href="/dashboard/setup" className='text-white'>
                        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
                            <FaCog size={24} /> Configurações
                        </div>
                    </Link>
                    <button
                        className="flex items-center gap-2 p-2 rounded-md text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200">
                        <FaSignOutAlt size={24} />
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
}