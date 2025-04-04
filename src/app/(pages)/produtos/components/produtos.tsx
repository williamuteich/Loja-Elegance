import * as React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";
import { Produto } from "@/utils/types/produto";
import Image from "next/image";
import AddToCartButton from "@/app/components/addTocartButton";

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

      return categoriaCorrespondente && productIdCorrespondente && produto.availableStock! > 0;
    });

    if (produtosFiltrados.length === 0) {
      produtosFiltrados = produtos
        .filter((produto: Produto) => {
          const produtoAtualId = categoriaProduct[0]?.category?.id;

          return produto.id !== produtoAtualId && produto.availableStock! > 0;
        })
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
    }

  } else {
    produtosFiltrados = isDestaque
      ? produtos.filter((produto: Produto) => produto.destaque === true && produto.availableStock! > 0 && produto.active)
      : produtos.filter((produto: Produto) => produto.availableStock! > 0 && produto.active);
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
                  <div

                    className="group relative flex flex-col bg-neutral-100 border-neutral-300 hover:bg-pink-100 transition-all"
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
                    <div className="flex flex-col w-full justify-between bg-white px-3 py-3 rounded-sm shadow-sm">
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
