"use client";

import * as React from "react";
import { Produto } from "@/utils/types/produto";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/app/components/addTocartButton";
import { FaSlidersH } from "react-icons/fa";

export default function ProdutosGerais() {
  const [produtos, setProdutos] = React.useState<Produto[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = React.useState<Produto[]>([]);
  const [totalRecords, setTotalRecords] = React.useState<number>(0);
  const [search, setSearch] = React.useState<string>("");
  const [categorias, setCategorias] = React.useState<{ id: string, name: string }[]>([]);
  const [precoMinimo, setPrecoMinimo] = React.useState<number | string>("");
  const [precoMaximo, setPrecoMaximo] = React.useState<number | string>("");
  const [paginaAtual, setPaginaAtual] = React.useState<number>(1);
  const [loading, setLoading] = React.useState<boolean>(true);
  const produtosPorPagina = 10;

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const response = await fetch(`/api/product?fetchAll=true`);

      if (!response.ok) {
        throw new Error("Error al buscar productos");
      }

      const { produtos, totalRecords }: { produtos: Produto[], totalRecords: number } = await response.json();
      setProdutos(produtos);
      setTotalRecords(totalRecords);
      setLoading(false);
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRes = await fetch("http://localhost:3000/api/category");
        const categoriesData = await categoriesRes.json();
        setCategorias(categoriesData.category);
      } catch (error) {
        alert("Error al cargar categorías");
      }
    };

    fetchCategories();
  }, []);

  const aplicarFiltros = () => {
    let filteredProdutos = produtos;

    if (search) {
      filteredProdutos = filteredProdutos.filter((produto) =>
        produto.categories.some((categoria) => categoria.category.name === search && produto.availableStock! > 0)
      );
    }

    if (precoMinimo) {
      filteredProdutos = filteredProdutos.filter((produto) => produto.price >= Number(precoMinimo) && produto.availableStock! > 0);
    }

    if (precoMaximo) {
      filteredProdutos = filteredProdutos.filter((produto) => produto.price <= Number(precoMaximo) && produto.availableStock! > 0);
    }

    setProdutosFiltrados(filteredProdutos);
    setTotalRecords(filteredProdutos.length);

    setPaginaAtual(1);
  };

  React.useEffect(() => {
    aplicarFiltros();
  }, [produtos, search, precoMinimo, precoMaximo]);

  const produtosPaginados = produtosFiltrados.slice(
    (paginaAtual - 1) * produtosPorPagina,
    paginaAtual * produtosPorPagina
  );

  const totalPaginas = Math.ceil(totalRecords / produtosPorPagina);

  const mudarPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaAtual(pagina);
    }
  };

  return (
    <div className="flex mx-auto py-10 sm:px-0">
      <div className="w-1/4 p-4 bg-neutral-100 border-r">
        <div className="sticky top-16 max-h-screen overflow-y-auto p-4">
          <h3 className="text-lg font-semibold text-pink-700 mb-4 flex gap-2 border-b-[1px] border-gray-400 pb-2 items-center">
            <FaSlidersH size={16} />
            Filtros
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
        <h2 className="text-2xl relative uppercase font-extrabold text-pink-700 mb-6 text-start">
          Catálogo de Productos
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-lg text-pink-800 font-bold ">Cargando productos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {produtosPaginados.length > 0 ? (
              produtosPaginados
                .filter((produto) => produto.availableStock! > 0)
                .map((produto: Produto) => {
                  const percentualDesconto = produto.priceOld && produto.priceOld > produto.price
                    ? Math.round(((produto.priceOld - produto.price) / produto.priceOld) * 100)
                    : 0;

                  return (
                    <div
                      key={produto.id}
                      className="flex flex-col bg-neutral-100 border-neutral-300 hover:bg-pink-100 transition-all hover:scale-[1.02]"
                    >
                      <div

                        className="group relative flex flex-col border border-gray-50 flex-1"
                      >
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
                        <div className="flex flex-col w-full justify-between bg-white px-3 py-3 rounded-sm shadow-sm flex-1">
                          <Link href={`/produtos/${produto.id}`} className="flex flex-col gap-2 w-full">
                            <h3 className="truncate text-sm sm:text-base md:text-lg font-extrabold text-pink-700">
                              {produto.name}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-wrap">
                              <p className="text-xl font-bold text-pink-600 flex-wrap">
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
                            <div
                              className={`mt-2 text-xs font-semibold text-white ${produto.stock.quantity > 0
                                ? "bg-green-700"
                                : "bg-red-700 text-white"
                                } px-2 py-1 rounded-md w-max`}
                            >
                              {produto.availableStock! > 0
                                ? produto.availableStock! > 1
                                  ? `${produto.availableStock!} Disponibles`
                                  : "Última Unidad"
                                : "No Disponible"}
                            </div>
                          </Link>
                          <div className="mt-3">
                            <AddToCartButton produto={produto} />
                          </div>
                        </div>
                        {produto.onSale && percentualDesconto > 0 && (
                          <p className="absolute top-2 right-2 bg-pink-700 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            {percentualDesconto}% OFF
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="col-span-5 text-center py-8">
                <p className="text-lg text-neutral-600">No se encontraron productos</p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            className="px-4 py-2 bg-pink-600 text-white rounded-md mr-2"
            onClick={() => mudarPagina(paginaAtual - 1)}
            disabled={paginaAtual === 1}
          >
            Anterior
          </button>

          <div className="flex items-center mx-2">
            <p className="text-lg text-neutral-700">
              Página {paginaAtual} de {totalPaginas}
            </p>
          </div>

          <button
            className="px-4 py-2 bg-pink-600 text-white rounded-md ml-2"
            onClick={() => mudarPagina(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
