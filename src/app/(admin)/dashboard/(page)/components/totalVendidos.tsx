import { FaArrowUp, FaDollarSign } from "react-icons/fa";

export default function TotalVendidos() {
    return (
        <div className="bg-white p-6 shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <p className="text-md text-gray-500 font-semibold">Total Vendido</p>
            <div className="flex items-center justify-between">
                <span className="text-2xl text-blue-600 font-extrabold">R$ 3000,00</span>
                <div className="bg-blue-50 p-4 rounded-full">
                    <FaDollarSign size={40} className="text-blue-500" />
                </div>
            </div>
            <div className="mt-1 flex gap-2 items-center">
                <div className="flex gap-2">
                    <FaArrowUp size={20} className="text-green-500" />
                    <span className="text-green-500 font-bold text-sm">+25%</span>
                </div>
                <span className="text-gray-500 font-medium text-sm">Esta Semana</span>
            </div>
        </div>
    )
}