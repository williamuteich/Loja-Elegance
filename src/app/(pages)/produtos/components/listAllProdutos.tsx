import * as React from "react";
import { Produto, VariantProps } from "@/utils/types/produto";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingBag } from "react-icons/fa";

export default async function ListAllProdutos() {
    const response = await fetch(
        `${process.env.NEXTAUTH_URL}/api/publica/product?random=true&randomLimit=15`,
        {
            next: { tags: ["loadProduct"], revalidate: 14400 }
        }
    );

    if (!response.ok) {
        return (
            <div className="py-10 px-4 max-w-7xl mx-auto text-center text-gray-500">
                Não foi possível carregar os produtos no momento. Tente novamente mais tarde.
            </div>
        );
    }

    const { produtos }: { produtos: Produto[] } = await response.json();

    const produtosDisponiveis = produtos.filter((produto) =>
        Array.isArray(produto.variants) &&
        produto.variants.some(
            (variant: any) =>
                (variant.availableStock ?? variant.stock?.quantity ?? 0) > 0
        )
    );

    if (produtosDisponiveis.length === 0) {
        return (
            <div className="py-10 px-4 max-w-7xl mx-auto text-center text-gray-500">
                Nenhum produto encontrado
            </div>
        );
    }

    return (
        <div className="mx-auto py-10 px-4 max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl relative uppercase font-extrabold text-pink-700">
                    Nossos Produtos
                </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {produtosDisponiveis.map((produto: Produto) => {
                    const totalEstoque = produto.variants.reduce(
                        (total: number, variant: VariantProps) =>
                            total +
                            (variant.availableStock ?? variant.stock?.quantity ?? 0),
                        0
                    );

                    const percentualDesconto =
                        produto.priceOld && produto.priceOld > produto.price
                            ? Math.round(
                                ((produto.priceOld - produto.price) / produto.priceOld) * 100
                            )
                            : 0;

                    return (
                        <div
                            key={produto.id}
                            className="group relative flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                        >
                            {produto.onSale && percentualDesconto > 0 && (
                                <div className="absolute top-3 left-3 z-[5]">
                                    <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold py-1 px-2 text-sm rounded-full shadow-md">
                                        -{percentualDesconto}% OFF
                                    </div>
                                </div>
                            )}

                            <Link
                                href={`/produtos/${produto.id}`}
                                className="relative aspect-square w-full flex items-center justify-center bg-gray-50 overflow-hidden"
                            >
                                {produto.imagePrimary ? (
                                    <Image
                                        alt={produto.name}
                                        src={produto.imagePrimary}
                                        fill
                                        quality={100}
                                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center bg-gray-100 rounded-lg w-full h-full">
                                        <FaShoppingBag className="text-gray-400" size={80} />
                                    </div>
                                )}
                            </Link>

                            <div className="flex flex-col flex-grow p-4">
                                <Link
                                    href={`/produtos/${produto.id}`}
                                    className="flex flex-col gap-2 flex-grow"
                                >
                                    <h3 className="font-bold text-sm sm:text-base line-clamp-2 text-gray-800 relative overflow-hidden">
                                        <span className="relative z-[5] group-hover:text-white transition-colors duration-300">
                                            {produto.name}
                                        </span>
                                        <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out z-0"></span>
                                    </h3>

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-rose-700">
                                                {new Intl.NumberFormat("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                }).format(produto.price)}
                                            </span>
                                            {produto.priceOld && (
                                                <span className="text-xs text-gray-500 line-through">
                                                    {new Intl.NumberFormat("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    }).format(produto.priceOld)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {produto.description && (
                                        <p className="text-gray-600 text-xs line-clamp-2">
                                            {produto.description
                                                .replace(/<[^>]*>/g, " ")
                                                .replace(/\s+/g, " ")
                                                .trim()}
                                        </p>
                                    )}

                                    <div className="mt-auto">
                                        <div
                                            className={`text-xs font-semibold px-2.5 rounded-full w-max ${totalEstoque > 1
                                                ? "bg-green-100 text-green-800"
                                                : totalEstoque === 1
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {totalEstoque > 1
                                                ? `${totalEstoque} Disponíveis`
                                                : totalEstoque === 1
                                                    ? "Última Unidade"
                                                    : "Esgotado"}
                                        </div>
                                    </div>
                                </Link>

                                <div className="mt-4">
                                    <Link href={`/produtos/${produto.id}`}>
                                        <button className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg">
                                            Ver Detalhes
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-12 text-end">
                <Link href="/produtos">
                    <button className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors shadow-md">
                        Ver Todos os Produtos
                    </button>
                </Link>
            </div>
        </div>
    );
}
