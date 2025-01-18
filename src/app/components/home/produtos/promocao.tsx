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
        precoParcelado: "38,32",
    },
    {
        id: 2,
        titulo: "Tênis Nike Air Max 2021",
        imagem: "/Frame_22.webp",
        descricao: "Com 5% de desconto",
        preco: "R$ 599,99",
        precoAnterior: "R$ 630,00",
        precoParcelado: "300,00",
    },
    {
        id: 3,
        titulo: "Relógio Casio Vintage preto ",
        imagem: "/Frame_24.webp",
        descricao: "Com 10% de desconto",
        preco: "R$ 200,00",
        precoAnterior: "R$ 220,00",
        precoParcelado: "100,00",
    },
    {
        id: 4,
        titulo: "Camiseta Adidas Original",
        imagem: "/Frame8.webp",
        descricao: "Com 8% de desconto",
        preco: "R$ 129,90",
        precoAnterior: "R$ 140,00",
        precoParcelado: "65,00",
    },
    {
        id: 5,
        titulo: "Jaqueta North Face Puffer",
        imagem: "/Frame6.webp",
        descricao: "Com 12% de desconto",
        preco: "R$ 399,00",
        precoAnterior: "R$ 450,00",
        precoParcelado: "199,50",
    },
    {
        id: 6,
        titulo: "Fone de Ouvido JBL Xtreme",
        imagem: "/Frame8.webp",
        descricao: "Com 7% de desconto",
        preco: "R$ 350,00",
        precoAnterior: "R$ 375,00",
        precoParcelado: "175,00",
    },
];

export function Promocao() {
    return (
        <div className="py-10 w-full bg-white flex justify-center items-center">
            <Container>
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-20 items-center">
                    <div className="w-full sm:w-[40%] lg:w-[25%] xl:w-[20%] text-center md:text-left">
                        <div className="flex flex-col gap-4 mb-4 lg:mb-0 lg:gap-6">
                            <h1 className="text-pink-800 text-4xl font-bold uppercase text-center lg:text-start">
                                Promoções
                            </h1>
                            <p className="uppercase text-gray-700 text-sm text-center lg:text-start">
                                Descontos imperdíveis em diversos produtos + Frete grátis em compras selecionadas!
                            </p>
                            <Button className="uppercase text-white bg-pink-800 hover:bg-pink-600 focus:bg-pink-600">
                                Aproveite já!
                            </Button>
                        </div>
                    </div>
                    <div className="w-[75%] sm:w-[90%] md:w-[90%] lg:w-[63%] xl:w-[70%]">
                        <Carousel opts={{ align: "start" }} className="w-full">
                            <CarouselContent className="p-2">
                                {produtos.map((produto) => (
                                    <CarouselItem
                                        key={produto.id}
                                        className="sm:basis-1/3 md:basis-1/3 lg:basis-1/3 xl:basis-1/3"
                                    >
                                        <div className="p-0">
                                            <Card className="border-0 p-1 pb-6">
                                                <CardContent className="flex aspect-square p-0 hover:scale-[1.02] transition-all justify-center">
                                                    <Link href={`/produtos/${produto.titulo}`} className="w-full h-fit">
                                                        <div className="w-full p-10 max-h-full flex flex-col items-center">
                                                            {/* Imagem do Produto */}
                                                            <Image
                                                                src={produto.imagem}
                                                                alt={produto.titulo}
                                                                width={400}
                                                                height={400}
                                                                className="object-cover w-full h-[200px] mb-2 rounded-lg"
                                                            />
                                                            {/* Título do Produto */}
                                                            <div className="text-center leading-5 text-base mb-1 text-gray-800">
                                                                {produto.titulo}
                                                            </div>

                                                            <div className="list-star flex justify-center mb-3 mt-1">
                                                                {[...Array(5)].map((_, index) => (
                                                                    <FaStar
                                                                        key={index}
                                                                        className="text-yellow-500 w-4 h-4 mr-1"
                                                                    />
                                                                ))}
                                                            </div>

                                                            <div className="product-price">
                                                                {produto.precoAnterior ? (
                                                                    <div className="price-before text-center">
                                                                        <span className="line-price text-sm text-gray-600 line-through">
                                                                            De: {produto.precoAnterior}
                                                                        </span>
                                                                    </div>
                                                                ) : null}
                                                                <div className="price-off">
                                                                    <span className="por text-base text-pink-800 font-semibold">
                                                                        Por
                                                                    </span>
                                                                    <span className="text-xl font-bold text-pink-800">
                                                                        {" "}
                                                                        {produto.preco}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="product-payment text-center mt-2">
                                                                {produto.precoParcelado ? (
                                                                    <span className="txt-corparcelas text-sm">
                                                                        ou até
                                                                        <strong className="color text-sm text-pink-800">
                                                                            {" "}
                                                                            2x
                                                                        </strong>
                                                                        <span className="preco-de"> de </span>
                                                                        <strong className="preco-parc2 text-sm text-pink-800">
                                                                            R$ {produto.precoParcelado}
                                                                        </strong>
                                                                        <span className="operadora text-sm">
                                                                            {" "}
                                                                            Sem juros
                                                                        </span>
                                                                    </span>
                                                                ) : (
                                                                    <span className="txt-corparcelas text-sm">
                                                                        Pagamento à vista
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="rounded-none" style={{ borderRadius: "5px" }} />
                            <CarouselNext className="rounded-none" style={{ borderRadius: "5px" }} />
                        </Carousel>
                    </div>
                </div>
            </Container>
        </div>
    );
}
