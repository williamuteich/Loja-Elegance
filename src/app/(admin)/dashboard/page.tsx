import Container from "./(page)/components/Container";
import TotalVendidos from "./(page)/components/totalVendidos";
import TotalUsuarios from "./(page)/components/totalUsuarios";
import TotalProdutos from "./(page)/components/totalProdutos";
import OrderDashboard from "./(page)/components/order";
import GraficoDashboard from "./(page)/components/grafico";


export default async function Dashboard() {
  return (
    <div className="p-8 px-10 bg-gray-50">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TotalVendidos />
          <TotalUsuarios />
          <TotalProdutos />
        </div>
      </div>

      <div className="mt-16 flex gap-6 justify-between">
        <div className="p-8 rounded-xl border border-gray-200 shadow-lg bg-white">
          <OrderDashboard />
        </div>
        <div className="w-1/5 p-8 rounded-xl border border-gray-200 shadow-lg bg-white">
          <GraficoDashboard />
        </div>
      </div>
    </div>
  );
}
