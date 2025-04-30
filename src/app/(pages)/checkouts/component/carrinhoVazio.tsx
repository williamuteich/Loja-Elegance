import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CarrinhoVazio() {
    return (
        <div className="min-h-screen flex justify-center p-6 text-center">
            <div className="max-w-full sm:max-w-md md:max-w-lg lg:max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-pink-600 mb-4">Tu carrito está vacío</h1>
                <Link href="/produtos">
                    <Button className="bg-pink-600 hover:bg-pink-700 text-white">Volver a la tienda</Button>
                </Link>
            </div>
        </div>
    )
}