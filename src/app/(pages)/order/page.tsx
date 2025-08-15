import NavProfile from "@/app/components/navProfile";
import { FaCheckCircle, FaHourglassHalf, FaBan, FaListAlt, FaMoneyBill, FaTruck, FaBoxOpen } from "react-icons/fa";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";
import { PrismaClient } from "@prisma/client";
import { Order } from "@/utils/types/order";

const prisma = new PrismaClient();

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.userID) {
    return (
      <div className="w-full text-center py-16 text-gray-600">
        Você precisa estar logado para ver seus pedidos.
      </div>
    );
  }

  const orders = (await prisma.order.findMany({
    where: { userId: session.user.userID },
    include: {
      items: {
        include: {
          product: true,
          productVariant: { include: { color: true } }
        },
      },
      pickupLocation: true,
    },
    orderBy: { createdAt: "desc" },
  })).map(order => ({
    ...order,
    items: order.items.map(item => ({
      ...item,
      variant: {
        color: {
          name: item.productVariant?.color?.name || "",
          hexCode: item.productVariant?.color?.hexCode || "",
        },
      },
    })),
  })) as Order[];

  const getStatus = (s: string) => {
    switch (s) {
      case "pending":
        return { icon: FaHourglassHalf, text: "Pendente", color: "text-yellow-700", bgColor: "bg-yellow-100" };
      case "confirmed":
        return { icon: FaCheckCircle, text: "Confirmado", color: "text-green-700", bgColor: "bg-green-100" };
      case "shipped":
        return { icon: FaTruck, text: "Enviado", color: "text-blue-700", bgColor: "bg-blue-100" };
      case "delivered":
        return { icon: FaBoxOpen, text: "Entregue", color: "text-purple-700", bgColor: "bg-purple-100" };
      case "cancelled":
        return { icon: FaBan, text: "Cancelado", color: "text-red-700", bgColor: "bg-red-100" };
      default:
        return { icon: FaHourglassHalf, text: "Processando", color: "text-gray-600", bgColor: "bg-gray-100" };
    }
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <NavProfile />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FaListAlt className="text-pink-600" /> Meus Pedidos
          </h1>

          {orders.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum pedido encontrado.</p>
          ) : (
            <div className="lg:max-h-[600px] lg:overflow-y-auto space-y-6 pr-2">
              {orders.map((order) => {
                const { icon: StatusIcon, text: statusText, color: statusColor } = getStatus(order.status);

                const grouped = order.items.reduce<{
                  [pid: string]: {
                    product: typeof order.items[0]["product"];
                    variants: Array<{ colorName: string; hex: string; qty: number }>;
                  };
                }>((acc, item) => {
                  const pid = item.productId;
                  if (!acc[pid]) acc[pid] = { product: item.product, variants: [] };
                  acc[pid].variants.push({ colorName: item.variant.color.name, hex: item.variant.color.hexCode, qty: item.quantity });
                  return acc;
                }, {});

                return (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h2 className="text-lg font-semibold text-pink-700">Pedido #{order.id.slice(-6).toUpperCase()}</h2>
                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className={`flex items-center gap-1 ${statusColor}`}>
                        <StatusIcon /> <span className="font-medium">{statusText}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {Object.values(grouped).map(({ product, variants }) => (
                        <div key={product.id} className="flex items-center gap-4">
                          <img src={product.imagePrimary || "/placeholder.png"} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
                          <div className="flex-1">
                            <p className="font-medium text-pink-700">{product.name}</p>
                            <div className="flex flex-wrap gap-2 mt-1 text-sm">
                              {variants.map((v, i) => (
                                <span key={i} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: v.hex }} />
                                  {v.qty}× {v.colorName}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded text-sm text-gray-700">
                      <p className="font-bold text-pink-700">{order.pickupLocation.category}</p>
                      <p className="font-bold">{order.pickupLocation.title}</p>
                      <span className="text-xs">{order.pickupLocation.description}</span>
                    </div>

                    <div className="mt-6 border-t pt-4 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaMoneyBill className="text-green-500" />
                        <span className="capitalize">{order.paymentMethod && order.paymentMethod !== "outros" ? order.paymentMethod : order.paymentDetail}</span>
                      </div>
                      <p className="font-semibold text-pink-700">Total: R$ {order.total.toFixed(2).replace(".", ",")}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
