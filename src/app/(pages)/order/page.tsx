import NavProfile from "@/app/components/navProfile";
import { FaCheckCircle, FaListAlt } from "react-icons/fa";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.userID) {
    redirect("/login");
  }

  const pedidos = await prisma.order.findMany({
    // incluir pedidos pagos e pendentes para que compras ainda não pagas apareçam no perfil
    where: { userId: session.user.userID, status: { in: ["paid", "pending"] } },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      status: true,
      subtotal: true,
      shippingPrice: true,
      total: true,
      updatedAt: true,
      createdAt: true,
      items: {
        select: {
          productId: true,
          productVariantId: true,
          name: true,
          imageUrl: true,
          unitPrice: true,
          quantity: true,
        },
      },
    },
  })

  // Buscar detalhes de produtos e variantes para enriquecer os itens
  const productIds = Array.from(new Set(pedidos.flatMap(o => o.items.map(i => i.productId)))).filter(Boolean) as string[];
  const variantIds = Array.from(new Set(pedidos.flatMap(o => o.items.map(i => i.productVariantId).filter(Boolean))));

  const [products, variants] = await Promise.all([
    productIds.length
      ? prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, imagePrimary: true },
      })
      : Promise.resolve([] as any[]),
    (variantIds as string[]).length
      ? prisma.productVariant.findMany({
        where: { id: { in: variantIds as string[] } },
        select: { id: true, color: { select: { name: true, hexCode: true } } },
      })
      : Promise.resolve([] as any[]),
  ]);

  const productMap = new Map(products.map(p => [p.id, p] as const));
  const variantMap = new Map(variants.map(v => [v.id, v] as const));

  const orders = pedidos.map(o => ({
    ...o,
    items: o.items.map(i => ({
      ...i,
      product: productMap.get(i.productId) || null,
      variant: i.productVariantId ? variantMap.get(i.productVariantId) || null : null,
    })),
  }));

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <NavProfile />
        <div className="space-y-12 w-full mt-6 lg:mt-0 bg-white p-6 border rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-full">
              <FaListAlt className="text-pink-700 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-pink-700">Meus Pedidos</h1>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-14 border border-gray-200 rounded-xl bg-white">
              <p className="text-gray-500 mb-4">Nenhum pedido encontrado.</p>
              <a href="/" className="inline-flex items-center justify-center rounded-md bg-pink-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-800 transition-colors">
                Voltar à loja
              </a>
            </div>
          ) : (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-gray-50 px-4 py-3 flex flex-wrap gap-3 justify-between items-center border-b border-gray-200">
                    <div>
                      <h2 className="font-semibold text-pink-700">Pedido #{order.id.slice(-6).toUpperCase()}</h2>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString("pt-BR")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.status === "paid" ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-green-500 px-3 py-1 rounded-full text-xs font-semibold">
                          <FaCheckCircle className="text-green-600" /> Pago
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                          Pendente
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                        {order.items.reduce((s, it) => s + it.quantity, 0)} itens
                      </span>
                    </div>
                  </div>

                  <div className="p-4 divide-y divide-gray-100">
                      {order.items.map((item, idx) => {
                      // se não houver imagem, manter null para renderizar o placeholder visual
                      const img = item.imageUrl || item.product?.imagePrimary || null;
                      const title = item.product?.name ?? item.name;
                      const colorName = item.variant?.color?.name;
                      const colorHex = item.variant?.color?.hexCode;
                      const lineTotal = (item.unitPrice * item.quantity).toFixed(2).replace(".", ",");
                      const unit = item.unitPrice.toFixed(2).replace(".", ",");
                      return (
                        <div key={idx} className="flex flex-wrap items-start sm:items-center gap-4 py-3">
                          {img ? (
                            <img src={img} alt={title} className="w-16 h-16 rounded-lg object-cover ring-1 ring-gray-200" />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center ring-1 ring-gray-200">
                            </div>
                          )}
                          <div className="flex-1 min-w-0 order-2 sm:order-none">
                            <p className="font-medium text-gray-900 truncate">{title}</p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mt-1">
                              {colorName && (
                                <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                                  <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: colorHex || "#eee" }} />
                                  {colorName}
                                </span>
                              )}
                              <div className="flex items-center gap-2">
                                <span className="bg-gray-100 px-2 py-1 rounded-md">Qtd: {item.quantity}</span>
                                <span className="text-xs text-gray-600">R$ {unit}</span>
                              </div>
                            </div>
                          </div>
                        
                        </div>
                      );
                    })}
                  </div>

                  <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                        <span className="text-pink-600 font-semibold">Subtotal</span>
                        <span className="font-medium text-gray-900">R$ {order.subtotal.toFixed(2).replace(".", ",")}</span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                        <span className="text-pink-600 font-semibold">Frete</span>
                        <span className="font-medium text-gray-900">R$ {order.shippingPrice.toFixed(2).replace(".", ",")}</span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-1">
                        <span className="text-pink-600 font-semibold">Total:</span>
                        <span className="text-base font-semibold text-neutral-700">R$ {order.total.toFixed(2).replace(".", ",")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}