"use client";

import * as React from "react";
import { Produto, VariantProps } from "@/utils/types/produto";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingBag, FaSlidersH } from 'react-icons/fa';

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
                const response = await fetch(`/api/publica/product?fetchAll=true`, { next: { revalidate: 600 } });
                if (!response.ok) throw new Error("Error al buscar productos");
                const { produtos } = await response.json();
                
                const produtosAtivosComEstoque = produtos.filter((p: Produto) =>
                    p.active && p.variants.some((variant: VariantProps) => variant.availableStock > 0) 
                );

                const emPromocao = produtosAtivosComEstoque.filter((p: Produto) => p.priceOld && p.priceOld > p.price);

                setProdutos(emPromocao);
                setProdutosFiltrados(emPromocao);
                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const categoriesRes = await fetch("/api/publica/category?fetchAll=true", { next: { revalidate: 600 } });
                const categoriesData = await categoriesRes.json();
                setCategorias(categoriesData.category);
            } catch (error) {
                console.error("Error al cargar categorías:", error);
            }
        };

        fetchData();
        fetchCategories();
    }, []);

    React.useEffect(() => {
        aplicarFiltros();
    }, [search, precoMinimo, precoMaximo, produtos]);

    const aplicarFiltros = () => {
        let filtrados = produtos.filter((p) =>
            p.priceOld && p.priceOld > p.price 
        );

        if (search) {
            filtrados = filtrados.filter((p) =>
                p.categories.some((c) => c.category.name === search)
            );
        }

        if (precoMinimo) {
            filtrados = filtrados.filter((p) => p.price >= Number(precoMinimo));
        }

        if (precoMaximo) {
            filtrados = filtrados.filter((p) => p.price <= Number(precoMaximo));
        }

        filtrados = filtrados.filter((p) => p.active);

        setProdutosFiltrados(filtrados);
    };

    return (
        <div className="flex mx-auto py-10 sm:px-0">
            <div className="w-1/4 p-4 bg-neutral-100 border-r">
                <div className="sticky top-16 max-h-screen overflow-y-auto p-4">
                    <h3 className="text-lg font-semibold text-pink-700 mb-4 flex gap-2 border-b-[1px] border-gray-400 pb-2 items-center">
                        <FaSlidersH size={16} /> Filtros de Promociones
                    </h3>
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-neutral-700">Categoría</h4>
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
                        <h4 className="text-sm font-medium text-neutral-700">Rango de Precio</h4>
                        <input
                            type="number"
                            className="w-full p-2 mt-2 border rounded-md bg-neutral-200"
                            placeholder="Precio mínimo"
                            value={precoMinimo}
                            onChange={(e) => setPrecoMinimo(e.target.value)}
                        />
                        <input
                            type="number"
                            className="w-full p-2 mt-2 border rounded-md bg-neutral-200"
                            placeholder="Precio máximo"
                            value={precoMaximo}
                            onChange={(e) => setPrecoMaximo(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="w-3/4 pl-6">
                <h2 className="text-2xl uppercase font-extrabold text-pink-700 mb-6 text-start">
                    Productos en Promoción
                </h2>

                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-lg text-pink-800 font-bold">Cargando promociones...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {produtosFiltrados.length > 0 ? (
                            produtosFiltrados.map((produto: Produto) => {
                                const percentualDesconto = produto.priceOld
                                    ? Math.round((produto.priceOld - produto.price) / produto.priceOld * 100)
                                    : 0;

                                const totalEstoque = produto.variants.reduce(
                                    (total: number, variant: VariantProps) => total + (variant.availableStock || 0), 0
                                );

                                return (
                                    <div key={produto.id} className="flex flex-col bg-neutral-100 border-neutral-300 hover:bg-pink-100 transition-all hover:scale-[1.02]">
                                        <div className="group relative flex flex-col border border-gray-50 flex-1">
                                            <Link href={`/produtos/${produto.id}`} className="relative aspect-square w-full flex items-center justify-center overflow-hidden bg-white">
                                                {produto.imagePrimary ? (
                                                    <Image
                                                        src={produto.imagePrimary}
                                                        alt="Imagem do Produto"
                                                        fill
                                                        className="object-contain"
                                                    />
                                                ) : (
                                                    <div className="p-4 bg-gray-100 rounded-lg flex items-center justify-center w-full h-full">
                                                        <FaShoppingBag className="text-gray-400" size={110} />
                                                    </div>
                                                )}
                                            </Link>
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
                                                            <p className="text-md font-bold text-pink-700 line-through flex-wrap">
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
                                            {percentualDesconto > 0 && (
                                                <p className="absolute left-3 top-3 z-20 flex items-center bg-pink-700 px-3 py-1 text-sm font-semibold text-white">
                                                    {percentualDesconto}% OFF
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-5 text-center py-8">
                                <p className="text-lg text-neutral-600">No se encontraron promociones con estos filtros</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
