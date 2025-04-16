import { FaShoppingCart } from "react-icons/fa";
import Container from "../components/Container";
import SearchItems from "../components/searchItems";
import Paginacao from "@/app/components/Paginacao";
import Link from "next/link";
import { headers } from "next/headers";

const BadgeStatus = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status.toUpperCase()) {
      case "PENDENTE":
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSANDO":
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "PAGO":
      case "PAID":
        return "bg-green-100 text-green-800";
      case "CANCELADO":
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status.toUpperCase()}
    </span>
  );
};

export default async function Pedidos() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/order`, {
    method: "GET",
    headers: await headers(),
    cache: "no-store"
  });

  const result = await response.json();
  const pedidos = result.orders;

  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Pedidos</h2>
      <p className="text-gray-600 mb-6 text-sm leading-[1.6]">
        Gerencie todos os pedidos realizados pelos clientes. Acompanhe status e detalhes dos pedidos.
      </p>

      <div className="flex gap-2 mb-6">
        <SearchItems />
      </div>

      <div>
        <p className="text-gray-700 text-base mb-4">
          <span className="font-semibold text-gray-800">Total de Pedidos: </span>
          <span className="font-medium text-blue-600">{pedidos.length}</span>
        </p>

        <table className="min-w-full table-auto border-collapse rounded-md border-t border-b border-gray-300">
          <thead className="bg-gray-800 text-white">
            <tr>
              {["ID", "Cliente", "Telefone", "Data", "Status", "Total", ""].map((header, idx) => (
                <th key={idx} className="py-3 px-4 text-left text-sm font-medium text-white">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300">
            {pedidos.map((pedido: any) => (
              <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-medium text-sm text-blue-600">
                  <Link href={`/admin/pedidos/${pedido.id}`} className="hover:underline">
                    {pedido.id.slice(-6).toUpperCase()}
                  </Link>
                </td>

                <td className="py-3 px-4 font-medium text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <FaShoppingCart size={18} className="text-gray-500" />
                    <Link href={`/admin/pedidos/${pedido.id}`} className="hover:underline">
                      {pedido.user?.name || "Cliente"}
                    </Link>
                  </div>
                </td>

                <td className="py-3 px-4 font-medium text-sm text-gray-700">
                  <Link href={`/admin/pedidos/${pedido.id}`} className="hover:underline">
                    {pedido.user?.phone || "Não informado"}
                  </Link>
                </td>

                <td className="py-3 px-4 font-medium text-sm text-gray-700">
                  {new Date(pedido.createdAt).toLocaleDateString("pt-BR")}
                </td>

                <td className="py-3 px-4 font-medium text-sm text-gray-700">
                  <BadgeStatus status={pedido.status} />
                </td>

                <td className="py-3 px-4 font-medium text-sm text-gray-700">
                  {Number(pedido.total).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>

                <td className="py-3 px-4 font-medium text-sm text-gray-700">
                  <div className="flex justify-end items-center space-x-3">
                    <Link
                      href={`/admin/pedidos/${pedido.id}`}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 bg-blue-800 text-white hover:bg-blue-700 font-semibold py-1 px-3 rounded-md transition duration-300 ease-in-out"
                    >
                      Visualizar Pedido
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Paginacao data={pedidos.map((p: any) => ({ ...p, id: p.id.toString() }))} totalRecords={pedidos.length} />
      </div>
    </Container>
  );
}
