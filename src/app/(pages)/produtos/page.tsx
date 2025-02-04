import * as React from "react";
import { Produto } from "@/utils/types/produto";
import Image from "next/image";
import Link from "next/link";
import Paginacao from "@/app/components/Paginacao";

export default async function ProdutosGerais({ searchParams }: { searchParams: Promise<{ search: string, page: string, status: string }> }) {

  const { search, page, status } = await searchParams;

  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/product?${search ? `search=${search}&` : ''}${page ? `page=${page}&` : ''}${status ? `status=${status}` : ''}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  const { produtos, totalRecords }: { produtos: Produto[], totalRecords: number } = await response.json();

  const produtosAleatorios = produtos.sort(() => Math.random() - 0.5);

  return (
    <div className="flex mx-auto py-10 sm:px-0">
      <div className="w-1/4 p-4 bg-neutral-100 border-r">
        <div className="sticky top-16 max-h-screen overflow-y-auto p-4">
          <h3 className="text-lg font-semibold text-pink-700 mb-4">Filtros</h3>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-neutral-700">Categoria</h4>
            <select
              className="w-full p-2 mt-2 border rounded-md bg-neutral-200 cursor-not-allowed"
            >
              <option value="">Todas</option>
              <option value="Lápis">Lápis</option>
              <option value="Caneta">Caneta</option>
              <option value="Caderno">Caderno</option>
            </select>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-neutral-700">Faixa de Preço</h4>
            <input
              type="number"
              className="w-full p-2 mt-2 border rounded-md bg-neutral-200 cursor-not-allowed"
              placeholder="Preço mínimo"
            />
            <input
              type="number"
              className="w-full p-2 mt-2 border rounded-md bg-neutral-200 cursor-not-allowed"
              placeholder="Preço máximo"
            />
          </div>
        </div>
      </div>

      <div className="w-3/4 pl-6">
        <h2 className="text-2xl relative uppercase font-extrabold text-pink-700 mb-6 text-start">
          Catálogo de Produtos
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
                  <Link
                    href={`/produtos/${produto.id}`}
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
                    <div className="flex w-full justify-between bg-white px-3 py-3 rounded-sm shadow-sm">
                      <div className="flex flex-col gap-2 w-full">
                        <h3 className="truncate text-sm sm:text-base md:text-lg font-extrabold text-pink-700">
                          {produto.name}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
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
                          className={`mt-2 text-xs font-semibold text-white ${produto.stock.quantity > 0
                            ? "bg-green-700"
                            : "bg-red-700 text-white"
                            } px-2 py-1 rounded-md w-max`}
                        >
                          {produto.stock.quantity > 0
                            ? produto.stock.quantity > 1
                              ? `${produto.stock.quantity} Disponíveis`
                              : "Última Unidade"
                            : "Indisponível"}
                        </div>
                        <div className="mt-3">
                          <button className="w-full py-2 bg-pink-600 text-white text-sm font-semibold rounded-md hover:bg-pink-700 transition-all">
                            Adicionar ao Carrinho
                          </button>
                        </div>
                      </div>
                    </div>
                    {produto.onSale && percentualDesconto > 0 && (
                      <p className="absolute left-3 top-3 z-20 flex items-center bg-pink-700 px-3 py-1 text-sm font-semibold text-white">
                        {percentualDesconto}% OFF
                      </p>
                    )}
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="text-red-800 pl-10">Nenhum produto encontrado</div>
          )}
        </div>
        <Paginacao data={produtos} totalRecords={totalRecords} />
      </div>
    </div>
  );
}
