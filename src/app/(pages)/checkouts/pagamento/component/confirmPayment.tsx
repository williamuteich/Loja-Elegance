import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";

export default function ConfirmPayment() {
  return (
    <div className="flex flex-col items-center  p-8 bg-white rounded-lg h-screen">
      <CheckCircleIcon className="w-12 h-12 text-green-600 mb-4" />
      <h2 className="text-2xl font-semibold text-pink-700">¡Felicitaciones! Tu pedido ha sido confirmado</h2>
      <p className="mt-4 text-gray-700 text-center">
        Tu pedido está en análisis y será procesado en breve. ¡Gracias por comprar con nosotros!
      </p>
      <div className="mt-6">
        <Link href="/order" className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg">
          Ver estado del pedido
        </Link>
      </div>
    </div>
  )
}
