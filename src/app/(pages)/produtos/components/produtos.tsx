import * as React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";
import { Produto } from "@/utils/types/produto";
import Image from "next/image";

export default async function Produtos({ titulo, isDestaque, categoriaProduct, produtos }: { titulo: string; isDestaque: boolean; categoriaProduct?: Produto[]; produtos: Produto[] }) {

  let produtosFiltrados = produtos;

  if (categoriaProduct) {
    const response = await fetch("http://localhost:3000/api/product?fetchAll=true");

    if (!response.ok) {
      throw new Error("Erro ao buscar produtos");
    }

    const { produtos } = await response.json();

    produtosFiltrados = produtos;

    const categoriasProdutoAtual = categoriaProduct.map((itemCategory: any) => itemCategory.category);

    produtosFiltrados = produtos.filter((produto: Produto) => {
      const categoriasProduto = produto.categories.map((cat: any) => cat.category);

      const categoriaCorrespondente = categoriasProduto.some((catProduto) =>
        categoriasProdutoAtual.some((catProp) =>
          catProp.id === catProduto.id && catProp.name === catProduto.name
        )
      );

      const productIdCorrespondente = !categoriaProduct.some((itemCategory: any) => itemCategory.productId === produto.id);

      return categoriaCorrespondente && productIdCorrespondente && produto.stock.quantity > 0;
    });

    if (produtosFiltrados.length === 0) {
      produtosFiltrados = produtos
        .filter((produto: Produto) => {
          const produtoAtualId = categoriaProduct[0]?.category?.id;

          return produto.id !== produtoAtualId && produto.stock.quantity > 0;
        })
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
    }

  } else {
    produtosFiltrados = isDestaque
      ? produtos.filter((produto: Produto) => produto.destaque === true && produto.stock.quantity > 0)
      : produtos.filter((produto: Produto) => produto.stock.quantity > 0);
  }

  return (
    <div className="mx-auto py-10 sm:px-0">
      <h2 className="text-2xl relative uppercase font-extrabold text-pink-700 mb-6 text-start">
        {titulo}
      </h2>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full relative"
      >
        <div className="absolute right-12 -top-12 hidden sm:flex">
          <p className="text-pink-700 font-extrabold mr-10">Ver Todos</p>
          <div>
            <CarouselPrevious className="left-24 rounded-none" style={{ borderRadius: "5px" }} />
            <CarouselNext className="rounded-none" style={{ borderRadius: "5px" }} />
          </div>
        </div>
        <CarouselContent className="flex gap-[1px] px-3">
          {produtosFiltrados.length > 0 ? (
            produtosFiltrados.map((produto: Produto) => {
              const percentualDesconto = produto.priceOld && produto.priceOld > produto.price
                ? Math.round(((produto.priceOld - produto.price) / produto.priceOld) * 100)
                : 0;

              return (
                <CarouselItem
                  key={produto.id}
                  className="flex-shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/4 xl:basis-1/4"
                >
                  <Link
                    href={`/produtos/${produto.id}`}
                    className="group relative flex flex-col bg-neutral-100 border-neutral-300 hover:bg-pink-100 transition-all"
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
                          <p className="text-xl font-bold text-pink-600 ">
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
                </CarouselItem>
              );
            })
          ) : (
            <div className="text-red-800 pl-10">Nenhum produto encontrado</div>
          )}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
