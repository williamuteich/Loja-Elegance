import { FaBoxes } from "react-icons/fa";

export default function TotalProdutos() {
    return (
        <div className="bg-white p-6 shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <p className="text-md text-gray-500 font-semibold">Produtos Cadastrados</p>
            <div className="flex items-center justify-between">
                <span className="text-2xl text-blue-600 font-extrabold">120</span>
                <div className="bg-blue-50 p-4 rounded-full">
                    <FaBoxes size={40} className="text-blue-500" />
                </div>
            </div>
            <div className="mt-1 flex gap-2 items-center">
                <span className="text-gray-600 font-medium text-sm">Total De Produtos Cadastrados.</span>
            </div>
        </div>
    )
}