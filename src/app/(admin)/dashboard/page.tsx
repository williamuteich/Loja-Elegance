import TotalVendidos from "./(page)/components/totalVendidos";
import SendPushNotification from "./components/SendPushNotification";
import TotalUsuarios from "./(page)/components/totalUsuarios";
import TotalProdutos from "./(page)/components/totalProdutos";
import OrderDashboard from "./(page)/components/order";
import GraficoDashboard from "./(page)/components/grafico";
import TopProducts from "./(page)/components/topProducts";
import DailyVisits from "./(page)/components/dailyVisits";
import { cookies } from "next/headers";
import { JSX } from "react";
export default async function Dashboard(): Promise<JSX.Element> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/privada/order`,
    {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    }
  );

  const result = await response.json();
  const pedidos = result.orders;

  return (
    <div className="p-8 px-10 bg-gray-50">
      <div className="mb-8">
        {/* Envio de notificação push para todos os inscritos */}
        <SendPushNotification />
      </div>
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