import * as React from "react";
import { Produto } from "@/utils/types/produto";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/app/components/addTocartButton";

export default async function ListAllProdutos() {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/product`);

    if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
    }

    const { produtos }: { produtos: Produto[] } = await response.json();

    const produtosAleatorios = produtos.sort(() => Math.random() - 0.5).filter(produto => produto.availableStock! > 0);

    return (
        <div className="mx-auto py-10 sm:px-0">
            <h2 className="text-2xl relative uppercase font-extrabold text-pink-700 mb-6 text-start">
                Nossos Produtos
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {produtosAleatorios.length > 0 ? (
                    produtosAleatorios.map((produto: Produto) => {
                        const percentualDesconto = produto.priceOld && produto.priceOld > produto.price
                            ? Math.round(((produto.priceOld - produto.price) / produto.priceOld) * 100)
                            : 0;

                        return (
                            <div
                                key={produto.id}
                                className="flex flex-col bg-neutral-100 border-neutral-300 hover:bg-pink-100 transition-all hover:scale-[1.02]"
                            >
                                <div

                                    className="group relative flex flex-col border border-gray-50"
                                >
                                    <div className="relative flex aspect-[300/300] items-center justify-center">
                                        <Image
                                            alt={produto.name}
                                            src={produto.imagePrimary}
                                            fill
                                            priority
                                            quality={100}
                                            className="object-contain"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                    <div className="flex flex-col w-full justify-between bg-white px-3 py-3 rounded-sm shadow-sm">
                                        <Link href={`/produtos/${produto.id}`} className="flex flex-col gap-2 w-full">
                                            <h3 className="truncate text-sm sm:text-base md:text-lg font-extrabold text-pink-700">
                                                {produto.name}
                                            </h3>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-wrap">
                                                <p className="text-xl font-bold text-pink-600">
                                                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(produto.price)}
                                                </p>
                                                {produto.priceOld && (
                                                    <p className="text-md font-bold text-pink-700 line-through">
                                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(produto.priceOld)}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="text-xs truncate font-medium text-neutral-700 sm:text-sm">
                                                {produto.description}
                                            </p>
                                            <div
                                                className={`mt-2 text-xs font-semibold text-white ${produto.availableStock! > 0
                                                    ? "bg-green-700"
                                                    : "bg-red-700 text-white"
                                                    } px-2 py-1 rounded-md w-max`}
                                            >
                                                {produto.availableStock! > 0
                                                    ? produto.availableStock! > 1
                                                        ? `${produto.availableStock!} Disponíveis`
                                                        : "Última Unidade"
                                                    : "Indisponível"}
                                            </div>
                                        </Link>
                                        <div className="mt-3">
                                            <AddToCartButton produto={produto} />
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
                    <div className="text-red-800 pl-10">Nenhum produto encontrado</div>
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
