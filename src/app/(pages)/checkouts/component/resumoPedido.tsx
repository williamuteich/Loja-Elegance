import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imagePrimary: string;
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
            <CardTitle className="text-pink-600 text-xl">Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imagePrimary}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
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
                {/*<div className="flex justify-between">
                  <span>Envío</span>
                  <span className="text-green-600">Gratis</span>
                </div>*/}
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
    )
}