import Paginacao from "@/app/components/Paginacao";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SearchItems from "../searchItems";
import { FiltroBuscarItem } from "../FiltroBuscarItem";

// Dados de exemplo
const orders = [
  {
    product: "Produto 1",
    orderId: "ORD001",
    purchaseDate: "2025-02-19",
    totalAmount: "$250.00",
    status: "Pago",
  },
  {
    product: "Produto 2",
    orderId: "ORD002",
    purchaseDate: "2025-02-18",
    totalAmount: "$150.00",
    status: "Pendente",
  },
  {
    product: "Produto 3",
    orderId: "ORD003",
    purchaseDate: "2025-02-17",
    totalAmount: "$350.00",
    status: "Cancelado",
  },
  {
    product: "Produto 4",
    orderId: "ORD004",
    purchaseDate: "2025-02-16",
    totalAmount: "$450.00",
    status: "Pago",
  },
  {
    product: "Produto 5",
    orderId: "ORD005",
    purchaseDate: "2025-02-15",
    totalAmount: "$550.00",
    status: "Pago",
  },
  {
    product: "Produto 6",
    orderId: "ORD006",
    purchaseDate: "2025-02-14",
    totalAmount: "$200.00",
    status: "Pendente",
  },
  {
    product: "Produto 7",
    orderId: "ORD007",
    purchaseDate: "2025-02-13",
    totalAmount: "$300.00",
    status: "Cancelado",
  },
];

export default function OrderDashboard() {

  const totalAmount = orders.reduce((total, order) => total + parseFloat(order.totalAmount.replace('$', '').replace(',', '')), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "text-yellow-500";
      case "Cancelado":
        return "text-red-500";
      case "Pago":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <>
              <div className="flex justify-between">
            <h2 className="text-lg font-bold text-gray-600">Vendas recentes</h2>
            <div className="flex gap-4 items-center">
              <SearchItems />
              <FiltroBuscarItem />
            </div>
          </div>
      <Table className="w-full mt-6 border border-gray-200 shadow-lg">
        <TableCaption className="sr-only">Tabela de Ordens de Compra</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[350px] bg-gray-100 p-3 text-left text-sm font-bold text-gray-700 rounded-tl-lg">Produto</TableHead>
            <TableHead className="w-[350px] bg-gray-100 p-3 text-left text-sm font-bold text-gray-700">ID da Ordem</TableHead>
            <TableHead className="w-[250px] bg-gray-100 p-3 text-left text-sm font-bold text-gray-700">Data da Compra</TableHead>
            <TableHead className="w-[200px] bg-gray-100 p-3 text-left text-sm font-bold text-gray-700">Valor</TableHead>
            <TableHead className="w-[130px] bg-gray-100 p-3 text-left text-sm font-bold text-gray-700 rounded-tr-lg">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.orderId} className="border-b border-gray-200 hover:bg-gray-50">
              <TableCell className="font-medium p-3 text-sm text-gray-800">{order.product}</TableCell>
              <TableCell className="p-3 text-sm text-gray-800">{order.orderId}</TableCell>
              <TableCell className="p-3 text-sm text-gray-800">{order.purchaseDate}</TableCell>
              <TableCell className="p-3 text-sm text-gray-800">{order.totalAmount}</TableCell>
              <TableCell className={`font-semibold px-2 py-1 ${getStatusColor(order.status)} rounded-full text-sm`}>
                {order.status}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Paginacao data={orders.map(order => ({ id: order.orderId }))} totalRecords={orders.length} />
    </>
  );
}
