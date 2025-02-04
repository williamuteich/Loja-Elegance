import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/app/components/container";
import { ProdutoProps } from "@/utils/types/produto";

export function Promocao({ produtos }: ProdutoProps) {
    const produtosEmPromocao = produtos.filter(produto => produto.onSale);

    return (
        <div className="py-10 lg:pt-24 w-full mx-auto bg-gray-100 flex justify-center items-center">
            <Container>
                <div className="flex flex-col lg:flex-row gap-10 items-center">
                    <div className="w-full text-center lg:text-left mb-6 lg:mb-0">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-2xl text-center uppercase font-extrabold text-pink-700">
                                Promoções Imperdíveis!
                            </h2>
                            <p className="text-gray-700 text-sm text-center font-normal">
                                Não perca as ofertas especiais que preparamos para você. Aproveite descontos exclusivos em
                                produtos selecionados, com frete grátis em compras acima de R$150,00. Oferta por tempo limitado!
                            </p>

                            <Link href="/produtos/promocao" className="w-full">
                                <Button className="uppercase text-xs lg:text-sm text-white bg-pink-800 hover:bg-pink-600 focus:bg-pink-600 w-full">
                                    Aproveite Agora!
                                </Button>
                            </Link>
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
                                {produtosEmPromocao
                                    .filter((produto) => produto.stock.quantity > 0 && produto.priceOld && produto.price < produto.priceOld) 
                                    .map((produto) => {


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
                                                            className="object-contain"
                                                            width={300}
                                                            height={300}
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        />
                                                    </div>
                                                    <div className="flex w-full justify-between bg-white px-3 py-3 rounded-sm shadow-sm">
                                                        <div className="flex flex-col gap-2 w-full">
                                                            <h3 className="truncate text-sm sm:text-base md:text-lg font-extrabold text-pink-700">
                                                                {produto.name}
                                                            </h3>
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                                <p className="text-lg font-semibold text-pink-700">
                                                                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(produto.price)}
                                                                </p>
                                                                <p className="text-sm font-semibold text-pink-600 line-through">
                                                                    {produto.priceOld && `R${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(produto.priceOld)}`}
                                                                </p>
                                                            </div>
                                                            <p className="text-xs font-medium text-neutral-700 sm:text-sm truncate">
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
                                    })}
                            </CarouselContent>
                        </Carousel>
                    </div>
                </div>
            </Container>
        </div>
    );
}