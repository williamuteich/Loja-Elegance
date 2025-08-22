import Container from "../components/Container";
import Paginacao from "@/app/components/Paginacao";
import Link from "next/link";
import { cookies } from "next/headers";
import SearchItems from "../components/searchItems";

const BadgeStatus = ({ status }: { status: string }) => {
  const statusMap: { [key: string]: { label: string; color: string } } = {
    pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "Confirmado", color: "bg-green-100 text-green-800" },
    shipped: { label: "Enviado", color: "bg-blue-100 text-blue-800" },
    delivered: { label: "Entregue", color: "bg-purple-100 text-purple-800" },
    cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800" }
  };

  const { label, color } = statusMap[status?.toLowerCase()] || { 
    label: "Desconhecido", 
    color: "bg-gray-100 text-gray-800" 
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
};

export default async function Pedidos({ searchParams }: { searchParams: Promise<{ search?: string, page?: string }> }) {
  const { search = "", page = "1" } = await searchParams;

  const query: Record<string, string> = {};
  if (search) query.search = search;
  if (page) query.page = page;
  const queryString = new URLSearchParams(query).toString();

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/privada/order?${queryString}`,
    {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return (
      <Container>
        <h2 className="text-3xl font-semibold mb-3 text-gray-800">Pedidos</h2>
        <p className="text-red-600">Erro ao carregar pedidos.</p>
      </Container>
    );
  }

  const result = await response.json();
  const pedidos = Array.isArray(result.orders) ? result.orders : [];
  const totalRecords = typeof result.totalRecords === "number" ? result.totalRecords : 0;

  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Pedidos</h2>
      <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
        Gerencie todos os pedidos realizados pelos clientes. Acompanhe status e detalhes dos pedidos.
      </p>

      <div className="flex gap-2 mb-6">
        <SearchItems />
      </div>

      <div>
        <p className="text-gray-700 text-base mb-3">
          <span className="font-semibold text-gray-800">Total de Pedidos: </span>
          <span className="font-medium text-blue-600">{totalRecords}</span>
        </p>

        {/* TABELA PARA DESKTOP */}
        <table className="hidden md:table min-w-full table-auto border-collapse rounded-md border-t border-b border-gray-300">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-medium">ID</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Cliente</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Telefone</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Data</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Total</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Produtos</th>
              <th className="py-3 px-4 text-left text-sm font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {pedidos.map((pedido: any) => (
              <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-medium text-sm text-blue-600">
                  <Link href={`/dashboard/pedidos/${pedido.id}`} className="hover:underline">
                    #{pedido.id.slice(-6).toUpperCase()}
                  </Link>
                </td>
                <td className="py-3 px-4 font-medium text-sm text-gray-700">
                  {pedido.user?.name || "Cliente"}
                </td>
                <td className="py-3 px-4 font-medium text-sm text-gray-700">
                  {pedido.user?.telefone || "Não informado"}
                </td>
                <td className="py-3 px-4 font-medium text-sm text-gray-700">
                  {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="py-3 px-4 font-medium text-sm text-gray-700">
                  <BadgeStatus status={pedido.status} />
                </td>
                <td className="py-3 px-4 font-medium text-sm text-gray-700">
                  {Number(pedido.total).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </td>
                <td className="py-3 px-4 font-medium text-sm text-gray-700">
                  {pedido.items?.length > 0 ? (
                    <ul className="space-y-2">
                      {pedido.items.map((item: any, index: number) => (
                        <li key={index}>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-800">x{item.quantity || 0}</span>
                            {item.name && (
                              <span className="text-gray-700 text-sm truncate max-w-[200px]">{item.name}</span>
                            )}
                            {item.color && (
                              <div className="flex items-center gap-1 text-sm">
                                <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: item.color?.hexCode || '#ccc' }} />
                                <span className="text-gray-600">{item.color?.name || 'Cor'}</span>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400 italic">Sem itens</span>
                  )}
                </td>
                <td className="py-3 px-4 font-medium text-sm text-gray-700">
                  <div className="flex justify-end items-center space-x-3">
                    <Link
                      href={`/dashboard/pedidos/${pedido.id}`}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm shadow h-9 bg-blue-800 text-white hover:bg-blue-700 font-semibold py-1 px-3 rounded-md transition duration-300"
                    >
                      Visualizar
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* CARDS PARA MOBILE */}
        <div className="md:hidden flex flex-col gap-4">
          {pedidos.map((pedido: any) => (
            <div key={pedido.id} className="bg-white rounded-lg shadow border p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-blue-700">#{pedido.id.slice(-6).toUpperCase()}</span>
                <BadgeStatus status={pedido.status} />
              </div>
              <div className="text-gray-800 text-sm">
                <span className="block"><b>Cliente:</b> {pedido.user?.name || "Cliente"}</span>
                <span className="block"><b>Telefone:</b> {pedido.user?.telefone || "Não informado"}</span>
                <span className="block"><b>Data:</b> {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</span>
                <span className="block"><b>Total:</b> {Number(pedido.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                <span className="block"><b>Produtos:</b> {pedido.items?.length ?? 0}</span>
              </div>
              <div>
                <Link
                  href={`/dashboard/pedidos/${pedido.id}`}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm shadow h-9 bg-blue-800 text-white hover:bg-blue-700 font-semibold py-1 px-3 rounded-md transition duration-300 w-full"
                >
                  Visualizar
                </Link>
              </div>
            </div>
          ))}
        </div>

        <Paginacao totalRecords={totalRecords} data={pedidos} />
      </div>
    </Container>
  );
}