import { Order, OrderItem } from "@/utils/types/order";
import { headers } from "next/headers";
import { FaArrowUp, FaDollarSign } from "react-icons/fa";

export default async function TotalVendidos() {
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/order`, {
        method: "GET",
        headers: await headers(),
      });
    
      const result = await response.json();
      const pedidos = result.orders;

      const totalVendidos = pedidos
      .filter((pedido: Order) => pedido.status !== "cancelled" && pedido.status !== "pending")
      .flatMap((pedido: Order) => pedido.items)
      .reduce(
        (acc: number, item: { price: number; quantity: number }) =>
          acc + item.price * item.quantity,
        0
      );
    
    return (
        <div className="bg-white p-6 shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <p className="text-md text-gray-500 font-semibold">Total Vendido</p>
            <div className="flex items-center justify-between">
                <span className="text-2xl text-blue-600 font-extrabold">
                    {Number(totalVendidos).toLocaleString("es-UY", {
                    style: "currency",
                    currency: "UYU",
                  })}
                </span>
                <div className="bg-blue-50 p-4 rounded-full">
                    <FaDollarSign size={40} className="text-blue-500" />
                </div>
            </div>
            <div className="mt-1 flex gap-2 items-center">
                <div className="flex gap-2">
                    <span className="bg-green-500 font-bold text-sm p-2 rounded-full"></span>
                </div>
                <span className="text-gray-500 font-medium text-sm">Total de Vendido</span>
            </div>
        </div>
    )
}