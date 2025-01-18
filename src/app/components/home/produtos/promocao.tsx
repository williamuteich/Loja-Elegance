import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaStar } from 'react-icons/fa';
import Link from "next/link";
import { Container } from "../../container";

const produtos = [
    {
        id: 1,
        titulo: "Sunga Slip Canelada Ferrugem Olivia",
        imagem: "/Frame_24.webp",
        descricao: "Com 3% de desconto",
        preco: "R$ 76,63",
        precoAnterior: "R$ 79,00",
        precoParcelado: "PROMO",
    },
    {
        id: 2,
        titulo: "Tênis Nike Air Max 2021",
        imagem: "/Frame_22.webp",
        descricao: "Com 5% de desconto",
        preco: "R$ 599,99",
        precoAnterior: "R$ 630,00",
        precoParcelado: "PROMO",
    },
    {
        id: 3,
        titulo: "Relógio Casio Vintage preto ",
        imagem: "/Frame_24.webp",
        descricao: "Com 10% de desconto",
        preco: "R$ 200,00",
        precoAnterior: "R$ 220,00",
        precoParcelado: "PROMO",
    },
    {
        id: 4,
        titulo: "Camiseta Adidas Original",
        imagem: "/Frame8.webp",
        descricao: "Com 8% de desconto",
        preco: "R$ 129,90",
        precoAnterior: "R$ 140,00",
        precoParcelado: "PROMO",
    },
    {
        id: 5,
        titulo: "Jaqueta North Face Puffer",
        imagem: "/Frame6.webp",
        descricao: "Com 12% de desconto",
        preco: "R$ 399,00",
        precoAnterior: "R$ 450,00",
        precoParcelado: "PROMO",
    },
    {
        id: 6,
        titulo: "Fone de Ouvido JBL Xtreme",
        imagem: "/Frame8.webp",
        descricao: "Com 7% de desconto",
        preco: "R$ 350,00",
        precoAnterior: "R$ 375,00",
        precoParcelado: "PROMO",
    },
];

export function Promocao() {
    return (
        <div className="py-10 lg:pt-24 w-full bg-white flex justify-center items-center">
            <Container>
                <div className="flex flex-col lg:flex-row gap-10 items-center">
                    <div className="w-full text-center lg:text-left mb-6 lg:mb-0">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-2xl  text-center lg:text-start uppercase font-extrabold text-pink-700">
                                Promoções Imperdíveis!
                            </h2>
                            <p className="uppercase text-gray-700 text-xs lg:text-sm font-medium text-center lg:text-start">
                                Não perca as ofertas especiais que preparamos para você. Aproveite descontos exclusivos em
                                produtos selecionados, com frete grátis em compras acima de R$150,00. Oferta por tempo limitado!
                            </p>

                            <Button className="uppercase text-xs lg:text-sm text-white bg-pink-800 hover:bg-pink-600 focus:bg-pink-600">
                                Aproveite Agora!
                            </Button>
                        </div>
                    </div>


                    <div className="w-full lg:w-[75%] xl:w-[70%] relative ">
                        <Carousel opts={{ align: "start" }} className="w-full ">
                            <div className="absolute right-12 -top-12 sm:flex ">
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
                                            href={`/produtos/${produto.titulo}`}
                                            className="group relative flex flex-col bg-neutral-100 border-neutral-300 hover:bg-pink-100 transition-all"
                                        >
                                            <div className="relative flex aspect-[300/300] items-center justify-center">
                                                <Image
                                                    alt={produto.titulo}
                                                    src={produto.imagem}
                                                    className="object-contain p-5 lg:p-3"
                                                    width={300}
                                                    height={300}
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>
                                            <div className="flex w-full justify-between bg-white px-3 py-3 rounded-sm shadow-sm">
                                                <div className="flex flex-col gap-2 w-full">
                                                    <h3 className="truncate text-sm sm:text-base md:text-lg font-extrabold text-pink-700">
                                                        {produto.titulo}
                                                    </h3>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                        <p className="text-sm font-semibold text-pink-600 line-through">
                                                            {produto.precoAnterior}
                                                        </p>
                                                        <p className="text-lg font-semibold text-pink-700">
                                                            {produto.preco}
                                                        </p>
                                                    </div>
                                                    <p className="text-xs font-medium text-neutral-700 sm:text-sm">
                                                        {produto.descricao}
                                                    </p>
                                                    <div className="mt-3">
                                                        <button className="w-full py-2 bg-pink-600 text-white text-sm font-semibold rounded-md hover:bg-pink-700 transition-all">
                                                            Adicionar ao Carrinho
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {produto.precoParcelado && (
                                                <p className="absolute left-3 top-3 z-20 flex items-center bg-pink-700 px-3 py-1 text-sm font-semibold text-white">
                                                    {produto.precoParcelado}
                                                </p>
                                            )}
                                        </Link>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </div>
                </div>
            </Container>
        </div>
    );
}
