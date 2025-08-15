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
import { FaShoppingBag, FaTag, FaClock, FaFire } from "react-icons/fa";

export function Promocao({ produtos }: ProdutoProps) {
  const produtosEmPromocao = produtos.filter((produto) => {
    const totalEstoque = produto.variants.reduce((acc: number, variant: { availableStock?: number }) => acc + (variant.availableStock || 0), 0);
    return (
      produto.onSale &&
      produto.priceOld &&
      produto.price < produto.priceOld &&
      produto.active &&
      totalEstoque > 0
    );
  });

  if (produtosEmPromocao.length === 0) return null;

  return (
    <div className="py-10 lg:py-16 w-full mx-auto bg-gradient-to-r from-pink-50 to-rose-50">
      <Container>
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Card de promoção melhorado */}
          <div className="w-full lg:w-[32%] text-center lg:text-left">
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border border-pink-100 flex flex-col gap-6 h-full">
              <div className="flex justify-center lg:justify-start">
                <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2">
                  <FaFire className="text-yellow-200" />
                  <span className="uppercase">Ofertas Especiais</span>
                </div>
              </div>

              <h2 className="text-3xl lg:text-4xl font-extrabold text-pink-700 leading-tight">
                Promoções <span className="text-rose-600">Imperdíveis</span>!
              </h2>

              <div className="space-y-3">
                <p className="text-gray-600 text-base leading-relaxed flex items-start gap-2">
                  <FaTag className="text-pink-500 mt-1 flex-shrink-0" />
                  <span>Descontos exclusivos em produtos selecionados</span>
                </p>

                <p className="text-gray-600 text-base leading-relaxed flex items-start gap-2">
                  <FaClock className="text-pink-500 mt-1 flex-shrink-0" />
                  <span>Ofertas válidas por tempo limitado</span>
                </p>
              </div>

              <Link href="/promocoes" className="mt-auto">
                <Button className="w-full py-5 text-sm font-bold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
                  <FaShoppingBag className="text-lg" />
                  Aproveite Agora!
                </Button>
              </Link>
            </div>
          </div>

          {/* Carrossel simplificado */}
          <div className="w-full lg:w-[68%] relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Produtos em Promoção
                <span className="text-pink-600 ml-2">({produtosEmPromocao.length})</span>
              </h3>
            </div>

            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent className="-ml-1 py-2">
                  {produtosEmPromocao.map((produto) => {
                    const percentualDesconto = produto.priceOld && produto.priceOld > produto.price
                      ? Math.round(((produto.priceOld - produto.price) / produto.priceOld) * 100)
                      : 0;

                    const totalEstoque = produto.variants.reduce(
                      (acc: number, variant: { availableStock?: number }) =>
                        acc + (variant.availableStock || 0), 0
                    );

                    return (
                      <CarouselItem
                        key={produto.id}
                        className="pl-1 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                      >
                        <div className="group relative flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                          {percentualDesconto > 0 && (
                            <div className="absolute top-3 left-3 z-20">
                              <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold py-1 px-2 text-sm rounded-full shadow-md">
                                -{percentualDesconto}% OFF
                              </div>
                            </div>
                          )}

                          <Link
                            href={`/produtos/${produto.id}`}
                            className="relative h-56 w-full flex items-center justify-center bg-gray-50 overflow-hidden"
                          >
                            {produto.imagePrimary ? (
                              <Image
                                alt={produto.name}
                                src={produto.imagePrimary}
                                fill
                                className="object-contain transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                              />
                            ) : (
                              <div className="flex items-center justify-center bg-gray-100 rounded-lg w-full h-full">
                                <FaShoppingBag className="text-gray-400" size={80} />
                              </div>
                            )}
                          </Link>

                          <div className="flex flex-col flex-grow p-4">
                            <Link href={`/produtos/${produto.id}`} className="flex flex-col gap-2 flex-grow">
                              <h3 className="font-bold text-sm sm:text-base line-clamp-2 text-gray-800 relative overflow-hidden">
                                <span className="relative z-[5] group-hover:text-white transition-colors duration-300">
                                  {produto.name}
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out z-0"></span>
                              </h3>

                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold text-rose-700">
                                    {new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL"
                                    }).format(produto.price)}
                                  </span>
                                  {produto.priceOld && (
                                    <span className="text-xs text-gray-500 line-through">
                                      {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL"
                                      }).format(produto.priceOld)}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {produto.description && (
                                <div
                                  className="text-gray-600 text-xs line-clamp-2"
                                  dangerouslySetInnerHTML={{ __html: produto.description }}
                                />
                              )}

                              <div className="mt-auto pt-3">
                                <div className={`text-xs font-semibold px-2 py-1 rounded-full w-max ${totalEstoque > 1
                                  ? "bg-green-100 text-green-800"
                                  : totalEstoque === 1
                                    ? "bg-red-100 text-red-800"
                                    : "bg-red-100 text-red-800"
                                  }`}>
                                  {totalEstoque > 1
                                    ? `${totalEstoque} Disponíveis`
                                    : totalEstoque === 1
                                      ? "Última unidade"
                                      : "Indisponível"}
                                </div>
                              </div>
                            </Link>

                            <div className="mt-4">
                              <Link href={`/produtos/${produto.id}`}>
                                <button className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg">
                                  Ver Detalhes
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>

                {/* Controles do carrossel */}
                <div className="absolute top-0 right-0 z-10 sm:flex gap-1 -translate-y-10 hidden">
                  <CarouselPrevious className="static translate-y-0 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 w-10 h-10" />
                  <CarouselNext className="static translate-y-0 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 w-10 h-10" />
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}