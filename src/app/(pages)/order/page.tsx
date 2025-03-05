import NavProfile from "@/app/components/navProfile";
import { FaCheckCircle, FaHourglassHalf, FaBan, FaListAlt } from "react-icons/fa";

export default function OrdersPage() {
    return (
        <div className="w-full mx-auto py-12 flex gap-4 flex-col lg:flex-row">
            <NavProfile />
            <div className="flex w-full flex-col bg-white rounded-lg ">
                <h2 className="text-2xl font-semibold mb-6 text-pink-700 flex gap-3 items-center">
                    <FaListAlt size={28} />
                    Mis Pedidos
                </h2>
                
                <div className="w-full bg-white border border-gray-300 rounded-xl shadow-lg p-6">
                    <div className="space-y-6">
                        <div className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all duration-300">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-xl text-pink-700 font-semibold">Pedido #12345</p>
                                <span className="text-sm text-gray-500">Fecha: 15/02/2025</span>
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center gap-2 text-green-600 mb-2">
                                    <FaCheckCircle size={18} />
                                    <p className="text-gray-700">Estado: <span className="font-medium">Enviado</span></p>
                                </div>
                                <p className="text-gray-700">Producto: <span className="font-medium text-pink-700">Camiseta Blanca</span></p>
                                <p className="text-gray-700">Cantidad: 3 artículos</p>
                                <p className="text-gray-700">Total: R$ 250,00</p>
                            </div>
                        </div>

                        <div className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all duration-300">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-xl text-pink-700 font-semibold">Pedido #12346</p>
                                <span className="text-sm text-gray-500">Fecha: 10/02/2025</span>
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                                    <FaHourglassHalf size={18} />
                                    <p className="text-gray-700">Estado: <span className="font-medium">En Proceso</span></p>
                                </div>
                                <p className="text-gray-700">Producto: <span className="font-medium text-pink-700">Zapatillas Deportivas</span></p>
                                <p className="text-gray-700">Cantidad: 2 artículos</p>
                                <p className="text-gray-700">Total: R$ 150,00</p>
                            </div>
                        </div>

                        <div className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all duration-300">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-xl text-pink-700 font-semibold">Pedido #12347</p>
                                <span className="text-sm text-gray-500">Fecha: 05/02/2025</span>
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center gap-2 text-red-500 mb-2">
                                    <FaBan size={18} />
                                    <p className="text-gray-700">Estado: <span className="font-medium">Cancelado</span></p>
                                </div>
                                <p className="text-gray-700">Producto: <span className="font-medium text-pink-700">Reloj de Pulsera</span></p>
                                <p className="text-gray-700">Cantidad: 1 artículo</p>
                                <p className="text-gray-700">Total: R$ 0,00</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
