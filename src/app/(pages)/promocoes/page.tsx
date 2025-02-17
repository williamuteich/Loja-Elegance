"use client";

import * as React from "react";
import { Produto } from "@/utils/types/produto";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/app/components/addTocartButton";
import { FaSlidersH  } from 'react-icons/fa';

export default function Promocoes() {
    const [produtos, setProdutos] = React.useState<Produto[]>([]);
    const [produtosFiltrados, setProdutosFiltrados] = React.useState<Produto[]>([]);
    const [categorias, setCategorias] = React.useState<{ id: string, name: string }[]>([]);
    const [search, setSearch] = React.useState<string>("");
    const [precoMinimo, setPrecoMinimo] = React.useState<number | string>("");
    const [precoMaximo, setPrecoMaximo] = React.useState<number | string>("");
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await await fetch(`/api/product?fetchAll=true`);
                if (!response.ok) throw new Error("Erro ao buscar produtos");
                const { produtos } = await response.json();

                const emPromocao = produtos.filter((p: Produto) => p.priceOld && p.priceOld > p.price);

                setProdutos(emPromocao);
                setProdutosFiltrados(emPromocao);
                setLoading(false);
            } catch (error) {
                console.error("Erro:", error);
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const categoriesRes = await fetch("/api/category");
                const categoriesData = await categoriesRes.json();
                setCategorias(categoriesData.category);
            } catch (error) {
                console.error("Erro ao carregar categorias:", error);
            }
        };

        fetchData();
        fetchCategories();
    }, []);

    React.useEffect(() => {
        aplicarFiltros();
    }, [search, precoMinimo, precoMaximo, produtos]);

    const aplicarFiltros = () => {
        let filtrados = produtos.filter(p =>
            p.priceOld && p.priceOld > p.price
        );

        if (search) {
            filtrados = filtrados.filter(p =>
                p.categories.some(c => c.category.name === search)
            );
        }

        if (precoMinimo) {
            filtrados = filtrados.filter(p => p.price >= Number(precoMinimo));
        }

        if (precoMaximo) {
            filtrados = filtrados.filter(p => p.price <= Number(precoMaximo));
        }

        setProdutosFiltrados(filtrados);
    };

    return (
        <div className="flex mx-auto py-10 sm:px-0">
            <div className="w-1/4 p-4 bg-neutral-100 border-r">
                <div className="sticky top-16 max-h-screen overflow-y-auto p-4">
                    <h3 className="text-lg font-semibold text-pink-700 mb-4 flex gap-2 border-b-[1px] border-gray-400 pb-2 items-center">
                        <FaSlidersH  size={16} /> Filtros de Promoções
                    </h3>
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-neutral-700">Categoria</h4>
                        <select
                            className="w-full p-2 mt-2 border rounded-md bg-neutral-200"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        >
                            <option value="">Todas</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.name}>
                                    {categoria.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-neutral-700">Faixa de Preço</h4>
                        <input
                            type="number"
                            className="w-full p-2 mt-2 border rounded-md bg-neutral-200"
                            placeholder="Preço mínimo"
                            value={precoMinimo}
                            onChange={(e) => setPrecoMinimo(e.target.value)}
                        />
                        <input
                            type="number"
                            className="w-full p-2 mt-2 border rounded-md bg-neutral-200"
                            placeholder="Preço máximo"
                            value={precoMaximo}
                            onChange={(e) => setPrecoMaximo(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="w-3/4 pl-6">
                <h2 className="text-2xl uppercase font-extrabold text-pink-700 mb-6 text-start">
                    Produtos em Promoção
                </h2>

                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-lg text-pink-800 font-bold">Carregando promoções...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {produtosFiltrados.length > 0 ? (
                            produtosFiltrados.map((produto: Produto) => {
                                const percentualDesconto = produto.priceOld
                                    ? Math.round((produto.priceOld - produto.price) / produto.priceOld * 100)
                                    : 0;

                                return (
                                    <div key={produto.id} className="flex flex-col bg-neutral-100 border-neutral-300 hover:bg-pink-100 transition-all hover:scale-[1.02]">
                                        <div className="group relative flex flex-col border border-gray-50">
                                            <Link href={`/produtos/${produto.id}`} className="relative flex aspect-[300/300] items-center justify-center">
                                                <Image
                                                    alt={produto.name}
                                                    src={produto.imagePrimary}
                                                    fill
                                                    priority
                                                    quality={100}
                                                    className="object-contain"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </Link>
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
                                                            <p className="text-md font-bold text-pink-700 line-through flex-wrap">
                                                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(produto.priceOld)}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <p className="text-xs truncate font-medium text-neutral-700 sm:text-sm">
                                                        {produto.description}
                                                    </p>
                                                </Link>
                                                <div className="mt-3">
                                                    <AddToCartButton produto={produto} />
                                                </div>
                                            </div>
                                            <p className="absolute left-3 top-3 z-20 flex items-center bg-pink-700 px-3 py-1 text-sm font-semibold text-white">
                                                {percentualDesconto}% OFF
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-5 text-center py-8">
                                <p className="text-lg text-neutral-600">Nenhuma promoção encontrada com esses filtros</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}