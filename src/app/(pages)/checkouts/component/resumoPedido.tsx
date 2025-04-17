import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CartItem {
  id: string;
  selectedVariantId: string;
  name: string;
  price: number;
  quantity: number;
  imagePrimary: string;
}

interface CartItem {
  id: string;
  selectedVariantId: string;
  name: string;
  price: number;
  quantity: number;
  imagePrimary: string;
  variantDetails: {
    color: string;
    hexCode: string;
    availableStock: number;
  };
}


interface ResumoPedidoProps {
  cart: CartItem[];
}

export default function ResumoPedido({ cart }: ResumoPedidoProps) {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="space-y-6">
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-pink-600 mb-6 border-b-2 border-pink-100 pb-4">Resumen del Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={`${item.id}-${item.selectedVariantId}`} className="flex justify-between items-start lg:items-center gap-3">
                <div className="flex items-center gap-4">
                  <img
                    src={item.imagePrimary}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>

                    {/* COR DA VARIANTE */}
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: item.variantDetails.hexCode }}
                      />
                      <span className="text-xs text-gray-600">{item.variantDetails.color}</span>
                    </div>

                    <p className="text-sm text-gray-500">
                      {item.quantity} x{" "}
                      {new Intl.NumberFormat("es-UY", {
                        style: "currency",
                        currency: "UYU",
                      }).format(item.price)}
                    </p>
                  </div>
                </div>
                <p className="font-medium">
                  {new Intl.NumberFormat("es-UY", {
                    style: "currency",
                    currency: "UYU",
                  }).format(item.price * item.quantity)}
                </p>
              </div>
            ))}

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {new Intl.NumberFormat("es-UY", {
                    style: "currency",
                    currency: "UYU",
                  }).format(subtotal)}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>
                  {new Intl.NumberFormat("es-UY", {
                    style: "currency",
                    currency: "UYU",
                  }).format(subtotal)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
