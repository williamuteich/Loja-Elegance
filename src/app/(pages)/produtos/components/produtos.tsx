import * as React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";

const produtos = [
  {
    id: 1,
    nome: "Relógio Tymos Eminence Silver",
    precoOriginal: "R$ 319,99",
    precoPromocional: "R$ 239,71",
    descricao: "5 cores disponíveis",
    promocao: true,
    imagem: "/Frame_22.webp",
  },
  {
    id: 2,
    nome: "Relógio Tymos Eminence Black",
    precoOriginal: "R$ 319,99",
    precoPromocional: "R$ 239,72",
    descricao: "5 cores disponíveis",
    promocao: true,
    imagem: "/Frame_24.webp",
  },
  {
    id: 3,
    nome: "Relógio Tymos Eminence Blue",
    precoOriginal: "R$ 319,99",
    precoPromocional: "R$ 239,73",
    descricao: "5 cores disponíveis",
    promocao: true,
    imagem: "/Frame8.webp",
  },
  {
    id: 4,
    nome: "Relógio Tymos Eminence Green",
    precoOriginal: "R$ 319,99",
    precoPromocional: "R$ 239,74",
    descricao: "5 cores disponíveis",
    promocao: true,
    imagem: "/Frame6.webp",
  },
  {
    id: 5,
    nome: "Relógio Tymos Eminence Blue",
    precoOriginal: "R$ 319,99",
    precoPromocional: "R$ 500,73",
    descricao: "5 cores disponíveis",
    promocao: true,
    imagem: "/Frame8.webp",
  },
];

export default function Produtos() {
  return (
    <div className="mx-auto py-10 sm:px-0">
      <h2 className="text-2xl relative uppercase font-extrabold text-pink-700 mb-6 text-start">
        Mais vendidos
      </h2>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full relative"
      >
        <div className="absolute right-12 -top-12 hidden sm:flex ">
          <p className="text-pink-700 font-extrabold mr-10">Ver Todos</p>
          <div>
            <CarouselPrevious className="left-24 rounded-none" style={{ borderRadius: "5px" }} />
            <CarouselNext className="rounded-none" style={{ borderRadius: "5px" }} />
          </div>
        </div>
        <CarouselContent className="flex gap-[1px] px-3">
          {produtos.map((produto) => (
            <CarouselItem
              key={produto.id}
              className="flex-shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/4 xl:basis-1/4"
            >
              <Link
                href={`/produtos/${produto.id}`}
                className="group relative flex flex-col bg-neutral-100 border-neutral-300 hover:bg-pink-100 transition-all"
              >
                <div className="relative flex aspect-[300/300] items-center justify-center">
                  <img
                    alt={produto.nome}
                    src={produto.imagem}
                    className="object-contain p-5 lg:p-3"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex w-full justify-between bg-white px-3 py-3 rounded-sm shadow-sm">
                  <div className="flex flex-col gap-2 w-full">
                    <h3 className="truncate text-sm sm:text-base md:text-lg font-extrabold text-pink-700">
                      {produto.nome}
                    </h3>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <p className="text-sm font-semibold text-pink-600 line-through">
                        {produto.precoOriginal}
                      </p>
                      <p className="text-lg font-semibold text-pink-700">
                        {produto.precoPromocional}
                      </p>
                    </div>

                    <p className="text-xs font-medium text-neutral-700 sm:text-sm">
                      {produto.descricao}
                    </p>

                    {produto.promocao && (
                      <div className="mt-2 text-xs font-semibold text-white bg-green-700 px-2 py-1 rounded-md w-max">
                        Em Estoque
                      </div>
                    )}

                    <div className="mt-3">
                      <button className="w-full py-2 bg-pink-600 text-white text-sm font-semibold rounded-md hover:bg-pink-700 transition-all">
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  </div>
                </div>

                {produto.promocao && (
                  <p className="absolute left-3 top-3 z-20 flex items-center bg-pink-700 px-3 py-1 text-sm font-semibold text-white">
                    25% OFF
                  </p>
                )}
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
