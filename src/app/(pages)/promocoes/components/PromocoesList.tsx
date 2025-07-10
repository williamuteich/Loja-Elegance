import Image from "next/image";
import Link from "next/link";
import { FaShoppingBag, FaSlidersH } from "react-icons/fa";

import { PromocoesListProps } from "@/utils/types/promocoes";

export default function PromocoesList(props: PromocoesListProps) {
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
    return `/promocoes?${url.toString()}`;
  }

  return (
    <div className="flex flex-col md:flex-row mx-auto py-6 px-2 sm:px-0">
      <div className="md:hidden mb-4">
        <form
          action="/promocoes"
          method="get"
          className="space-y-3 bg-neutral-100 p-2 rounded-lg border"
        >
          <h3 className="text-base font-semibold text-pink-700 mb-2 flex gap-1 border-b border-gray-400 pb-1 items-center">
            <FaSlidersH size={16} /> Filtros
          </h3>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">
              Categoría
            </label>
            <select
              name="categoria"
              defaultValue={categoria}
              className="w-full p-2 border rounded-md bg-neutral-200"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">
              Precio mínimo
            </label>
            <input
              type="number"
              name="precoMin"
              defaultValue={precoMin ?? ""}
              className="w-full p-2 border rounded-md bg-neutral-200"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">
              Precio máximo
            </label>
            <input
              type="number"
              name="precoMax"
              defaultValue={precoMax ?? ""}
              className="w-full p-2 border rounded-md bg-neutral-200"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">
              Buscar producto
            </label>
            <input
              type="text"
              name="search"
              defaultValue={search}
              className="w-full p-2 border rounded-md bg-neutral-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg text-lg shadow mt-4 transition-all"
          >
            Aplicar filtros
          </button>
        </form>
      </div>

      <div className="hidden md:block md:w-1/4 p-4 bg-neutral-100 border-r">
        <form
          className="sticky top-16 max-h-screen overflow-y-auto p-2 space-y-3"
          action="/promocoes"
          method="get"
        >
          <h3 className="text-base font-semibold text-pink-700 mb-2 flex gap-1 border-b border-gray-400 pb-1 items-center">
            <FaSlidersH size={16} /> Filtros
          </h3>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">
              Categoría
            </label>
            <select
              name="categoria"
              defaultValue={categoria}
              className="w-full p-2 border rounded-md bg-neutral-200"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">
              Precio mínimo
            </label>
            <input
              type="number"
              name="precoMin"
              defaultValue={precoMin ?? ""}
              className="w-full p-2 border rounded-md bg-neutral-200"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">
              Precio máximo
            </label>
            <input
              type="number"
              name="precoMax"
              defaultValue={precoMax ?? ""}
              className="w-full p-2 border rounded-md bg-neutral-200"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">
              Buscar producto
            </label>
            <input
              type="text"
              name="search"
              defaultValue={search}
              className="w-full p-2 border rounded-md bg-neutral-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg text-lg shadow mt-4 transition-all"
          >
            Aplicar filtros
          </button>
          <a
            href="/promocoes"
            className="w-full block mt-2 text-center bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg text-lg shadow transition-all"
            style={{ textDecoration: "none" }}
          >
            Limpiar Filtros
          </a>
        </form>
      </div>

      <div className="w-full md:w-3/4 md:pl-6">
        <h2 className="text-xl sm:text-2xl uppercase font-extrabold text-pink-700 mb-4 sm:mb-6 text-center md:text-left">
          Promociones ({totalRecords})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {produtos.map((produto, index) => {
            const totalEstoque = produto.variants.reduce(
              (acc: any, variant: { stock: { quantity: any } }) =>
                acc + (variant.stock?.quantity || 0),
              0
            );
            const desconto =
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
                {desconto > 0 && (
                  <div className="absolute top-3 left-3 z-20">
                    <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold py-1 px-3 rounded-full shadow-md">
                      -{desconto}% OFF
                    </div>
                  </div>
                )}

                <Link
                  href={`/produtos/${produto.id}`}
                  className="relative aspect-square w-full flex items-center justify-center bg-gray-50 overflow-hidden"
                >
                  {produto.imagePrimary ? (
                    <Image
                      src={produto.imagePrimary}
                      alt={produto.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 240px"
                      priority={index < 4}
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="p-4 bg-gray-100 rounded-lg flex items-center justify-center w-full h-full">
                      <FaShoppingBag className="text-gray-400" size={110} />
                    </div>
                  )}
                </Link>

                <div className="flex flex-col flex-grow p-4">
                  <Link
                    href={`/produtos/${produto.id}`}
                    className="flex flex-col gap-2 flex-grow"
                  >
                    <h3 className="font-bold text-sm sm:text-base line-clamp-2 text-gray-800 relative overflow-hidden">
                      <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                        {produto.name}
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out z-0"></span>
                    </h3>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold text-rose-700">
                        {new Intl.NumberFormat("es-UY", {
                          style: "currency",
                          currency: "UYU",
                        }).format(produto.price)}
                      </span>
                      {produto.priceOld && (
                        <span className="text-xs text-gray-500 line-through">
                          {new Intl.NumberFormat("es-UY", {
                            style: "currency",
                            currency: "UYU",
                          }).format(produto.priceOld)}
                        </span>
                      )}
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
                        className={`text-xs font-semibold px-2.5 rounded-full w-max mt-2 ${
                          totalEstoque > 3
                            ? "bg-green-100 text-green-800"
                            : totalEstoque > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {totalEstoque > 3
                          ? `${totalEstoque} Disponibles`
                          : totalEstoque > 0
                          ? "Última Unidad"
                          : "Agotado"}
                      </div>
                    </div>
                  </Link>

                  <div className="mt-4">
                    <Link href={`/produtos/${produto.id}`}>
                      <button className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg">
                        Ver detalles
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-2 text-sm sm:text-base">
          <Link
            href={buildUrl({
              search,
              categoria,
              precoMin,
              precoMax,
              page: paginaAtual - 1,
            })}
          >
            <button
              disabled={paginaAtual === 1}
              className="px-4 py-2 bg-pink-600 text-white rounded-md disabled:opacity-50"
            >
              Anterior
            </button>
          </Link>
          <span className="mx-4 text-gray-700">
            Página {paginaAtual} de {totalPaginas}
          </span>
          <Link
            href={buildUrl({
              search,
              categoria,
              precoMin,
              precoMax,
              page: paginaAtual + 1,
            })}
          >
            <button
              disabled={paginaAtual === totalPaginas}
              className="px-4 py-2 bg-pink-600 text-white rounded-md disabled:opacity-50"
            >
              Siguiente
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
