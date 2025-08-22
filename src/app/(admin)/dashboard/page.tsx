import TotalVendidos from "./(page)/components/totalVendidos";
import TotalUsuarios from "./(page)/components/totalUsuarios";
import TotalProdutos from "./(page)/components/totalProdutos";
import OrderDashboard from "./(page)/components/order";
import GraficoDashboard from "./(page)/components/grafico";
import TopProducts from "./(page)/components/topProducts";
import DailyVisits from "./(page)/components/dailyVisits";
import { JSX } from "react";
import { prisma } from "@/lib/prisma";
export default async function Dashboard(): Promise<JSX.Element> {
  // Busca direta no banco: pedidos recentes com campos mínimos para os cards/gráficos
  const pedidos = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      total: true,
      items: {
        select: {
          name: true,
          unitPrice: true,
          quantity: true,
        },
      },
    },
  });

  return (
    <div className="p-8 px-10 bg-gray-50">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TotalVendidos pedidos={pedidos} />
          <TotalUsuarios />
          <TotalProdutos />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyVisits />
        <TopProducts />
      </div>

      <div className="mt-16 flex flex-col md:flex-row gap-6 justify-between">
        <div className="p-8 rounded-xl border border-gray-200 shadow-lg bg-white w-full">
          <OrderDashboard pedidos={pedidos} />
        </div>
        <div className="w-full md:w-1/5 p-8 rounded-xl border border-gray-200 shadow-lg bg-white">
          <GraficoDashboard pedidos={pedidos} />
        </div>
      </div>
    </div>
  );
}