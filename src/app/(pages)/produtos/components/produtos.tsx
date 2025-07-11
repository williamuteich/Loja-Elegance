import * as React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";
import { Produto } from "@/utils/types/produto";
import Image from "next/image";
import { FaShoppingBag } from "react-icons/fa";

export default async function Produtos({
  titulo,
  isDestaque,
  categoriaProduct,
}: {
  titulo: string;
  isDestaque: boolean;
  categoriaProduct?: Produto[];
}) {

  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/publica/product?fetchAll=true`, {
    cache: 'force-cache',
    next: { tags: ['loadProduct'] }
  });

  if (!response.ok) {
    return (
      <div className="py-10 px-4 max-w-7xl mx-auto text-center text-gray-500">
        Não foi possível carregar os produtos no momento. Tente novamente mais tarde.
      </div>
    );
  }

  const { produtos } = await response.json();
  let produtosFiltrados: Produto[] = [];

  if (categoriaProduct) {
    const categoriasProdutoAtual = categoriaProduct.map((itemCategory: any) => itemCategory.category);

    produtosFiltrados = produtos.filter((produto: Produto) => {
      const categoriasProduto = produto.categories.map((cat: any) => cat.category);

      const categoriaCorrespondente = categoriasProduto.some((catProduto) =>
        categoriasProdutoAtual.some((catProp) =>
          catProp.id === catProduto.id && catProp.name === catProduto.name
        )
      );

      const productIdCorrespondente = !categoriaProduct.some((itemCategory: any) => itemCategory.productId === produto.id);

      const estoqueDisponivel = produto.variants.some((variant: any) => variant.availableStock > 0);

      return categoriaCorrespondente && productIdCorrespondente && estoqueDisponivel;
    });

    if (produtosFiltrados.length === 0) {
      produtosFiltrados = produtos
        .filter((produto: Produto) => {
          const produtoAtualId = categoriaProduct[0]?.category?.id;
          return produto.id !== produtoAtualId && produto.variants.some((variant: any) => variant.availableStock > 0);
        })
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
    }
  } else {
    produtosFiltrados = isDestaque
      ? produtos.filter((produto: Produto) => produto.destaque === true && produto.variants.some((variant: any) => variant.availableStock > 0) && produto.active)
      : produtos.filter((produto: Produto) => produto.variants.some((variant: any) => variant.availableStock > 0) && produto.active);
  }

  if (produtosFiltrados.length === 0) return null;

  return (
    <div className="mx-auto py-10 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl relative uppercase font-extrabold text-pink-700">{titulo}</h2>

        <div className="flex items-center gap-2">
          <Link href="/produtos" className="hidden sm:block text-pink-700 font-extrabold hover:underline mr-24">
            Ver Todos
          </Link>
        </div>
      </div>

      <div className="relative">
        <Carousel className="w-full">
          <div className="absolute top-0 right-0 z-10 sm:flex gap-1 -translate-y-10 hidden">
            <CarouselPrevious className="static rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 w-10 h-10" />
            <CarouselNext className="static rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 w-10 h-10" />
          </div>

          <CarouselContent className="-ml-1 p-1 gap-2">
            {produtosFiltrados.map((produto: Produto) => {
              const percentualDesconto = produto.priceOld && produto.priceOld > produto.price
                ? Math.round(((produto.priceOld - produto.price) / produto.priceOld) * 100)
                : 0;

              const totalEstoque = produto.variants.reduce(
                (total: number, variant: any) => total + (variant.availableStock || 0),
                0
              );

              return (
                <CarouselItem
                  key={produto.id}
                  className="pl-1 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
                  <div className="group relative flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                    {produto.onSale && percentualDesconto > 0 && (
                      <div className="absolute top-3 left-3 z-20">
                        <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold py-1 px-3 rounded-full shadow-md">
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
                          width={270}
                          height={270}
                          priority
                          quality={100}
                          className="object-contain transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center bg-gray-100 rounded-lg w-full h-full">
                          <FaShoppingBag className="text-gray-400" size={80} />
                        </div>
                      )}
                    </Link>

                    <div className="flex flex-col flex-grow p-4">
                      <Link href={`/produtos/${produto.id}`} className="flex flex-col gap-2 flex-grow">
                        {/*<h3 className="font-bold text-gray-800 line-clamp-2 text-sm sm:text-base group-hover:text-rose-600 transition-colors">
                          {produto.name}
                        </h3>*/}
                        <h3 className="font-bold text-sm sm:text-base line-clamp-2 text-gray-800 relative overflow-hidden">
                          <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                            {produto.name}
                          </span>
                          <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out z-0"></span>
                        </h3>

                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-rose-700">
                              {new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU" }).format(produto.price)}
                            </span>
                            {produto.priceOld && (
                              <span className="text-xs text-gray-500 line-through">
                                {new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU" }).format(produto.priceOld)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Descrição simplificada */}
                        {produto.description && (
                          <p className="text-gray-600 text-xs line-clamp-2">
                            {produto.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}
                          </p>
                        )}

                        <div className="mt-auto">
                          <div className={`text-xs font-semibold px-2.5 rounded-full w-max ${totalEstoque > 3 ? "bg-green-100 text-green-800" :
                            totalEstoque > 0 ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                            {totalEstoque > 3
                              ? `${totalEstoque} Disponíveis`
                              : totalEstoque > 0
                                ? "Última Unidade"
                                : "Indisponível"}
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
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}