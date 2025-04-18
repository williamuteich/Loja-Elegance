import TotalVendidos from "./(page)/components/totalVendidos";
import TotalUsuarios from "./(page)/components/totalUsuarios";
import TotalProdutos from "./(page)/components/totalProdutos";
import OrderDashboard from "./(page)/components/order";
import GraficoDashboard from "./(page)/components/grafico";
import { headers } from "next/headers";


export default async function Dashboard() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/order`, {
    method: "GET",
    headers: await headers(),
  });

  const result = await response.json();
  const pedidos = result.orders;

  return (
    <div className="p-8 px-10 bg-gray-50">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TotalVendidos pedidos={pedidos}/>
          <TotalUsuarios />
          <TotalProdutos />
        </div>
      </div>

      <div className="mt-16 flex gap-6 justify-between">
        <div className="p-8 rounded-xl border border-gray-200 shadow-lg bg-white w-full">
          <OrderDashboard pedidos={pedidos} />
        </div>
        <div className="w-1/5 p-8 rounded-xl border border-gray-200 shadow-lg bg-white">
          <GraficoDashboard pedidos={pedidos} />
        </div>
      </div>
    </div>
  );
}
