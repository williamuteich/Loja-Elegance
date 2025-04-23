// src/app/(pages)/promocoes/components/PromocoesList.tsx
'use client';

import { useEffect, useState } from 'react';
import { Produto } from "@/utils/types/produto";
import { useRouter } from 'next/navigation';
import { FaSlidersH, FaShoppingBag } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

interface PromocoesListProps {
  produtos: Produto[];
  totalRecords: number;
  categorias: { id: string; name: string }[];
  searchParams: Record<string, string | string[] | undefined>;
}

export default function PromocoesList({
  produtos: initialProdutos,
  totalRecords: initialTotal,
  categorias,
  searchParams
}: PromocoesListProps) {
  const [showFiltros, setShowFiltros] = useState(false);
  const [filtros, setFiltros] = useState({
    search: typeof searchParams.search === 'string' ? searchParams.search : '',
    categoria: typeof searchParams.categoria === 'string' ? searchParams.categoria : '',
    precoMin: typeof searchParams.precoMin === 'string' ? searchParams.precoMin : '',
    precoMax: typeof searchParams.precoMax === 'string' ? searchParams.precoMax : ''
  });

  const [produtosFiltrados, setProdutosFiltrados] = useState(initialProdutos);
  const [totalRecords, setTotalRecords] = useState(initialTotal);
  const [paginaAtual, setPaginaAtual] = useState(
    typeof searchParams.page === 'string' ? Number(searchParams.page) : 1
  );
  
  const produtosPorPagina = 12;
  const router = useRouter();
  const [prevFiltros, setPrevFiltros] = useState(filtros);

  useEffect(() => {
    let resultados = [...initialProdutos];
    
    // Aplicar filtros
    if (filtros.categoria) {
      resultados = resultados.filter(p =>
        p.categories.some(c => c.category.name === filtros.categoria)
      );
    }
    if (filtros.precoMin) {
      resultados = resultados.filter(p => p.price >= Number(filtros.precoMin));
    }
    if (filtros.precoMax) {
      resultados = resultados.filter(p => p.price <= Number(filtros.precoMax));
    }
    if (filtros.search) {
      const termo = filtros.search.toLowerCase();
      resultados = resultados.filter(p =>
        p.name.toLowerCase().includes(termo) ||
        p.description.toLowerCase().includes(termo)
      );
    }

    setProdutosFiltrados(resultados);
    setTotalRecords(resultados.length);

    if (JSON.stringify(prevFiltros) !== JSON.stringify(filtros)) {
      setPaginaAtual(1);
    }
    setPrevFiltros(filtros);
  }, [filtros, initialProdutos]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const totalPaginas = Math.ceil(totalRecords / produtosPorPagina);
  const produtosExibidos = produtosFiltrados.slice(
    (paginaAtual - 1) * produtosPorPagina,
    paginaAtual * produtosPorPagina
  );

  const atualizarPagina = (novaPagina: number) => {
    if (novaPagina < 1 || novaPagina > totalPaginas) return;
    setPaginaAtual(novaPagina);
    router.push(`/promocoes?${new URLSearchParams({
      ...filtros,
      page: novaPagina.toString()
    })}`, { scroll: false });
  };

  const filtrosContent = (
    <>
      <h3 className="text-lg font-semibold text-pink-700 mb-4 flex gap-2 border-b-[1px] border-gray-400 pb-2 items-center">
        <FaSlidersH size={16} />
        Filtros de Promoções
      </h3>
      <div className="mb-6">
        <label className="text-sm font-medium text-neutral-700 block mb-2">
          Categoría
        </label>
        <select
          name="categoria"
          value={filtros.categoria}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded-md bg-neutral-200"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.name}>
              {categoria.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="text-sm font-medium text-neutral-700 block mb-2">
          Rango de precio
        </label>
        <input
          type="number"
          name="precoMin"
          placeholder="Precio mínimo"
          value={filtros.precoMin}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded-md bg-neutral-200 mb-2"
        />
        <input
          type="number"
          name="precoMax"
          placeholder="Precio máximo"
          value={filtros.precoMax}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded-md bg-neutral-200"
        />
      </div>
      <div className="mb-6">
        <label className="text-sm font-medium text-neutral-700 block mb-2">
          Buscar producto
        </label>
        <input
          type="text"
          name="search"
          placeholder="Buscar por nombre o descripción"
          value={filtros.search}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded-md bg-neutral-200"
        />
      </div>
      <div className="block md:hidden">
        <button
          type="button"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg text-lg shadow mt-4 transition-all"
          onClick={() => setShowFiltros(false)}
        >
          Aplicar filtros
        </button>
      </div>
    </>
  );

  return (
    <div className="flex flex-col md:flex-row mx-auto py-6 px-2 sm:px-0">
      <button
        className="md:hidden flex items-center justify-center bg-pink-600 text-white rounded-full w-12 h-12 z-30 fixed bottom-20 right-5 shadow-lg text-2xl"
        onClick={() => setShowFiltros(true)}
        aria-label="Abrir filtros"
      >
        <FaSlidersH />
      </button>

      {showFiltros && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-30 flex md:hidden">
          <div className="bg-white w-11/12 max-w-xs h-full p-4 shadow-lg overflow-y-auto relative animate-slideInLeft">
            <button
              className="absolute top-3 right-3 text-pink-700 font-bold text-lg"
              onClick={() => setShowFiltros(false)}
              aria-label="Fechar filtros"
            >
              ×
            </button>
            {filtrosContent}
          </div>
          <div className="flex-1" onClick={() => setShowFiltros(false)} />
        </div>
      )}

      <div className="hidden md:block md:w-1/4 p-4 bg-neutral-100 border-r">
        <div className="sticky top-16 max-h-screen overflow-y-auto p-4">
          {filtrosContent}
        </div>
      </div>

      <div className="w-full md:w-3/4 md:pl-6">
        <h2 className="text-xl sm:text-2xl uppercase font-extrabold text-pink-700 mb-4 sm:mb-6 text-center md:text-left">
          Productos en Promoción ({totalRecords})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {produtosExibidos.map((produto) => {
            const totalEstoque = produto.variants.reduce(
              (acc: any, variant: { availableStock: any }) => acc + (variant.availableStock || 0),
              0
            );
            const desconto = produto.priceOld && produto.priceOld > produto.price
              ? Math.round(((produto.priceOld - produto.price) / produto.priceOld) * 100)
              : 0;

            return (
              <div
                key={produto.id}
                className="flex flex-col bg-neutral-100 border-neutral-300 hover:bg-pink-100 transition-all hover:scale-[1.02]"
              >
                <div className="group relative flex flex-col border border-gray-50 flex-1">
                  <Link href={`/produtos/${produto.id}`} className="relative aspect-square w-full flex items-center justify-center overflow-hidden bg-white">
                    {produto.imagePrimary ? (
                      <Image
                        src={produto.imagePrimary}
                        alt={produto.name}
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
                        <p className="text-xl font-bold text-pink-600 flex-wrap">
                          {new Intl.NumberFormat("es-UY", {
                            style: "currency",
                            currency: "UYU"
                          }).format(produto.price)}
                        </p>
                        {produto.priceOld && (
                          <p className="text-md font-bold text-pink-700 line-through flex-wrap">
                            {new Intl.NumberFormat("es-UY", {
                              style: "currency",
                              currency: "UYU"
                            }).format(produto.priceOld)}
                          </p>
                        )}
                      </div>
                      <p className="text-xs truncate font-medium text-neutral-700 sm:text-sm">
                        {produto.description}
                      </p>
                    </Link>

                    <div className={`mt-2 text-xs font-semibold text-white ${totalEstoque > 0
                        ? totalEstoque > 1
                          ? "bg-green-700"
                          : "bg-yellow-700"
                        : "bg-red-700"
                      } px-2 py-1 rounded-md w-max`}>
                      {totalEstoque > 0
                        ? totalEstoque > 1
                          ? `${totalEstoque} Disponibles`
                          : "Última Unidad"
                        : "Indisponible"}
                    </div>

                    <div className="mt-3">
                      <Link href={`/produtos/${produto.id}`}>
                        <button className="w-full py-2 bg-pink-600 text-white text-sm font-semibold rounded-md hover:bg-pink-700 transition-all">
                          Ver detalles
                        </button>
                      </Link>
                    </div>
                  </div>
                  {desconto > 0 && (
                    <span className="absolute top-2 right-2 bg-pink-700 text-white text-xs px-2 py-1 rounded-full">
                      {desconto}% OFF
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-2 text-sm sm:text-base">
          <button
            onClick={() => atualizarPagina(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            className="px-4 py-2 bg-pink-600 text-white rounded-md disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="mx-4 text-gray-700">
            Página {paginaAtual} de {totalPaginas}
          </span>
          <button
            onClick={() => atualizarPagina(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            className="px-4 py-2 bg-pink-600 text-white rounded-md disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}