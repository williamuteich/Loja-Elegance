import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth as authOptions } from "@/lib/auth-config";
import { getServerSession } from "next-auth";
import { BsWhatsapp, BsBox, BsCreditCard, BsGeoAlt, BsCheckCircle } from "react-icons/bs";
import Container from "../../components/Container";
import UpdateStatus from "../components/updateStatus";

const prisma = new PrismaClient();

export default async function StatusPedido({ params }: { params: Promise<{ id: string }> }) {
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.userID && session?.user?.role !== "admin" && session?.user?.active !== true) {
      return NextResponse.redirect('/login');
    }

    const order = await prisma.order.findUnique({
        where: { id: (await params).id },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              telefone: true
            }
          },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imagePrimary: true
              }
            },
            productVariant: {
              include: {
                color: true
              }
            }
          }
        },
        pickupLocation: {
          select: {
            title: true,
            description: true
          }
        }
      }
    });

    if (!order) {
      return (
        <Container>
          <div className="p-6 text-red-600">Pedido não encontrado</div>
        </Container>
      );
    }

    if (session.user.role !== "admin" && order.userId !== session.user.userID) {
      return NextResponse.redirect('/unauthorized');
    }

    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <Container>
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <BsCheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pedido #{order.id}</h1>
              <p className="text-gray-500 text-sm">
                {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold mb-2 text-gray-700">
                      <BsBox className="text-blue-600" />
                      Status do Pedido
                    </h2>
                    <p className="text-sm text-gray-500">Status atual</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[order.status as keyof typeof statusStyles]}`}>
                    {order.status}
                  </span>
                </div>
                
                {session.user.role === "admin" && (
                  <div className="mt-4">
                    <UpdateStatus orderId={order.id} currentStatus={order.status} />
                  </div>
                )}
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h2 className="flex items-center gap-2 text-lg font-semibold mb-4 text-gray-700">
                  <BsBox className="text-green-600" />
                  Itens do Pedido
                  <span className="ml-auto text-sm text-gray-500">({order.items.length})</span>
                </h2>
                
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="group flex gap-4 pb-4 border-b last:border-b-0 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      {item.product.imagePrimary && (
                        <div className="flex-shrink-0">
                          <img
                            src={item.product.imagePrimary}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{item.product.name}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <span
                            className="w-4 h-4 rounded-full border shadow-sm"
                            style={{ backgroundColor: item.productVariant?.color?.hexCode || "transparent" }}
                          />
                          <span className="text-gray-600">{item.productVariant?.color?.name || "Sem cor específica"}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <span className="text-gray-600">Qtd: {item.quantity}</span>
                          <span className="text-gray-600">Preço: $ {item.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h2 className="flex items-center gap-2 text-lg font-semibold mb-4 text-gray-700">
                  <BsCreditCard className="text-purple-600" />
                  Pagamento
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Método:</span>
                    <span className="font-medium text-gray-900">{order.paymentMethod}</span>
                  </div>
                  {order.paymentDetail && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Detalhes:</span>
                      <span className="font-medium text-gray-900 truncate">{order.paymentDetail}</span>
                    </div>
                  )}
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-gray-700">Total:</span>
                      <span className="text-xl font-bold text-green-600">
                        $ {order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h2 className="flex items-center gap-2 text-lg font-semibold mb-4 text-gray-700">
                  <BsGeoAlt className="text-red-600" />
                  Retirada
                </h2>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">{order.pickupLocation.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {order.pickupLocation.description}
                  </p>
                </div>
              </div>

              {session.user.role === "admin" && order.user.telefone && (
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold mb-4 text-gray-700">Contato do Cliente</h2>
                  <div className="space-y-4">
                    <a
                      href={`https://wa.me/${order.user.telefone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                    >
                      <BsWhatsapp className="w-5 h-5" />
                      Contato WhatsApp
                    </a>
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-20 text-gray-600">Nome:</span>
                        <span className="font-medium text-gray-900">{order.user.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-20 text-gray-600">Email:</span>
                        <span className="font-medium text-gray-900 truncate">{order.user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-20 text-gray-600">Telefone:</span>
                        <span className="font-medium text-gray-900">
                            {order.user.telefone.replace(/\D/g, '')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    );
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    return (
      <Container>
        <div className="p-6 text-red-600">Erro ao carregar detalhes do pedido</div>
      </Container>
    );
  } finally {
    await prisma.$disconnect();
  }
}