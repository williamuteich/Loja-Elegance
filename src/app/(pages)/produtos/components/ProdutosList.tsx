
import Image from "next/image";
import Link from "next/link";
import { FaShoppingBag, FaSlidersH } from "react-icons/fa";

import { ProdutosListProps } from "@/utils/types/produto";

export default function ProdutosList(props: ProdutosListProps) {
  const {
    produtos,
    totalRecords,
    categorias,
    paginaAtual,
    produtosPorPagina,
    search,
    categoria,
    precoMin,
    precoMax,
  } = props;
  const totalPaginas = Math.ceil(totalRecords / produtosPorPagina);

  function buildUrl(params: Record<string, any>) {
    const url = new URLSearchParams();
    if (params.search) url.set("search", params.search);
    if (params.categoria) url.set("categoria", params.categoria);
    if (params.precoMin) url.set("precoMin", params.precoMin);
    if (params.precoMax) url.set("precoMax", params.precoMax);
    if (params.page) url.set("page", params.page);
    return `/produtos?${url.toString()}`;
  }

  return (
    <div className="flex flex-col md:flex-row mx-auto py-6 px-2 sm:px-0">
      <div className="md:hidden mb-4">
        <form action="/produtos" method="get" className="space-y-3 bg-neutral-100 p-2 rounded-lg border">
          <h3 className="text-base font-semibold text-pink-700 mb-2 flex gap-1 border-b border-gray-400 pb-1 items-center">
            <FaSlidersH size={16} /> Filtros
          </h3>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">Categoría</label>
            <select name="categoria" defaultValue={categoria} className="w-full p-2 border rounded-md bg-neutral-200">
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">Precio mínimo</label>
            <input type="number" name="precoMin" defaultValue={precoMin ?? ""} className="w-full p-2 border rounded-md bg-neutral-200" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">Precio máximo</label>
            <input type="number" name="precoMax" defaultValue={precoMax ?? ""} className="w-full p-2 border rounded-md bg-neutral-200" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">Buscar producto</label>
            <input type="text" name="search" defaultValue={search} className="w-full p-2 border rounded-md bg-neutral-200" />
          </div>
          <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg text-lg shadow mt-4 transition-all">
            Aplicar filtros
          </button>
        </form>
      </div>
      <div className="hidden md:block md:w-1/4 p-4 bg-neutral-100 border-r">
        <form className="sticky top-16 max-h-screen overflow-y-auto p-2 space-y-3" action="/produtos" method="get">
          <h3 className="text-base font-semibold text-pink-700 mb-2 flex gap-1 border-b border-gray-400 pb-1 items-center">
            <FaSlidersH size={16} /> Filtros
          </h3>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">Categoría</label>
            <select name="categoria" defaultValue={categoria} className="w-full p-2 border rounded-md bg-neutral-200">
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">Precio mínimo</label>
            <input type="number" name="precoMin" defaultValue={precoMin ?? ""} className="w-full p-2 border rounded-md bg-neutral-200" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">Precio máximo</label>
            <input type="number" name="precoMax" defaultValue={precoMax ?? ""} className="w-full p-2 border rounded-md bg-neutral-200" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">Buscar producto</label>
            <input type="text" name="search" defaultValue={search} className="w-full p-2 border rounded-md bg-neutral-200" />
          </div>
          <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg text-lg shadow mt-4 transition-all">
            Aplicar filtros
          </button>
          <a
            href="/produtos"
            className="w-full block mt-2 text-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-lg text-lg shadow transition-all"
            style={{ textDecoration: 'none' }}
          >
            Limpiar Filtros
          </a>
        </form>
      </div>

      <div className="w-full md:w-3/4 md:pl-6">
        <h2 className="text-xl sm:text-2xl uppercase font-extrabold text-pink-700 mb-4 sm:mb-6 text-center md:text-left">
          Catálogo de Productos ({totalRecords})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {produtos.map((produto, index) => {
            const totalEstoque = produto.variants.reduce(
              (acc: any, variant: { stock: { quantity: any } }) => acc + (variant.stock?.quantity || 0),
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
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 240px"
                        priority={index < 4}
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
                          ? `${totalEstoque} Disponíveis`
                          : "Última unidad"
                        : "Agotado"}
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
          <Link href={buildUrl({ search, categoria, precoMin, precoMax, page: paginaAtual - 1 })}>
            <button disabled={paginaAtual === 1} className="px-4 py-2 bg-pink-600 text-white rounded-md disabled:opacity-50">
              Anterior
            </button>
          </Link>
          <span className="mx-4 text-gray-700">
            Página {paginaAtual} de {totalPaginas}
          </span>
          <Link href={buildUrl({ search, categoria, precoMin, precoMax, page: paginaAtual + 1 })}>
            <button disabled={paginaAtual === totalPaginas} className="px-4 py-2 bg-pink-600 text-white rounded-md disabled:opacity-50">
              Siguiente
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
