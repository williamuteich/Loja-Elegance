import * as React from "react";
import { Produto, VariantProps } from "@/utils/types/produto";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingBag } from "react-icons/fa";

export default async function ListAllProdutos() {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/publica/product?random=true&randomLimit=15`,
        {
            next: { tags: ["loadProduct"] },
            cache: "force-cache",
        }
    );

    if (!response.ok) {
        console.log("Erro ao buscar produtos");
        return null;
    }

    const { produtos }: { produtos: Produto[] } = await response.json();

    const produtosAleatorios = produtos.filter(produto =>
        Array.isArray(produto.variants) &&
        produto.variants.some((variant: any) =>
            (variant.availableStock ?? variant.stock?.quantity ?? 0) > 0
        )
    );

    return (
        <div className="mx-auto py-10 sm:px-0">
            <h2 className="text-2xl relative uppercase font-extrabold text-pink-700 mb-6 text-start">
                Nuestros Productos
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {produtosAleatorios.length > 0 ? (
                    produtosAleatorios.map((produto: Produto) => {
                        const totalEstoque = produto.variants.reduce(
                            (total: number, variant: VariantProps) =>
                                total + (variant.availableStock ?? variant.stock?.quantity ?? 0), 0
                        );

                        const percentualDesconto = produto.priceOld && produto.priceOld > produto.price
                            ? Math.round(((produto.priceOld - produto.price) / produto.priceOld) * 100)
                            : 0;

                        return (
                            <div
                                key={produto.id}
                                className="flex flex-col border-neutral-300 hover:bg-pink-100 transition-all hover:scale-[1.02]"
                            >
                                <div className="group relative flex flex-col border border-gray-50 flex-1">
                                    <div className="relative flex aspect-[1/1] w-full items-center justify-center overflow-hidden">
                                        {produto.imagePrimary ? (
                                            <Image
                                                alt={produto.name}
                                                src={produto.imagePrimary}
                                                fill
                                                priority
                                                quality={100}
                                                className="object-contain rounded-lg"
                                                sizes="100%"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg">
                                                <FaShoppingBag className="text-gray-400" size={110} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col w-full justify-between bg-white px-3 py-3 rounded-sm shadow-sm flex-1">
                                        <Link href={`/produtos/${produto.id}`} className="flex flex-col gap-2 w-full">
                                            <h3 className="truncate text-sm sm:text-base md:text-lg font-extrabold text-pink-700">
                                                {produto.name}
                                            </h3>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-wrap">
                                                <p className="text-xl font-bold text-pink-600">
                                                    {new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU" }).format(produto.price)}
                                                </p>
                                                {produto.priceOld && (
                                                    <p className="text-md font-bold text-pink-700 line-through">
                                                        {new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU" }).format(produto.priceOld)}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="text-xs truncate font-medium text-neutral-700 sm:text-sm">
                                                {produto.description}
                                            </p>
                                        </Link>

                                        <div
                                            className={`mt-2 text-xs font-semibold text-white ${totalEstoque > 1
                                                ? "bg-green-700"
                                                : totalEstoque === 1
                                                    ? "bg-yellow-600"
                                                    : "bg-red-700"}   
                                            px-2 py-1 rounded-md w-max`}
                                        >
                                            {totalEstoque > 1
                                                ? `${totalEstoque} Disponibles`
                                                : totalEstoque === 1
                                                    ? "Última Unidad"
                                                    : "Indisponible"}
                                        </div>

                                        <div className="mt-3">
                                            <Link href={`/produtos/${produto.id}`}>
                                                <button
                                                    className="w-full py-2 bg-pink-600 text-white text-sm font-semibold rounded-md hover:bg-pink-700 transition-all"
                                                >
                                                    Ver detalles
                                                </button>
                                            </Link>
                                        </div>
                                    </div>

                                    {produto.onSale && percentualDesconto > 0 && (
                                        <p className="absolute left-3 top-3 z-20 flex items-center bg-pink-700 px-3 py-1 text-sm font-semibold text-white">
                                            {percentualDesconto}% OFF
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-red-800 pl-10">No se encontró ningún producto</div>
                )}
            </div>

            <div className="mt-6 text-end">
                <Link href="/produtos">
                    <button className="py-3 px-12 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition-all shadow-lg">
                        Ver Todos
                    </button>
                </Link>
            </div>
        </div>
    );
}