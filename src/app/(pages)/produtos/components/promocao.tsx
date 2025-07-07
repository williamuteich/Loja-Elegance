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
import { FaShoppingBag } from "react-icons/fa";

export async function Promocao() {

  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/publica/product?fetchAll=true`,{
      cache: 'force-cache',
      next: { tags: ['loadProduct'] } 
    });

  if (!response.ok) {
    return null;
  }

  const res = await response.json();
  const produtos = res.produtos;

  const produtosEmPromocao = produtos.filter((produto: any) => {
    const totalEstoque = produto.variants.reduce((acc: number, variant: { availableStock?: number }) => acc + (variant.availableStock || 0), 0);
    return (
      produto.onSale &&
      produto.priceOld &&
      produto.price < produto.priceOld &&
      produto.active &&
      totalEstoque > 0
    );
  });

  return (
    <div className="py-10 lg:pt-24 w-full mx-auto bg-gray-100 flex justify-center items-center">
      <Container>
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          <div className="w-full text-center lg:text-left mb-6 lg:mb-0">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl text-center uppercase font-extrabold text-pink-700">
                ¡Promociones Imperdibles!
              </h2>
              <p className="text-gray-700 text-sm text-center font-normal">
                ¡No te pierdas las ofertas especiales que preparamos para ti! Aprovecha descuentos exclusivos en productos seleccionados.
              </p>
              <Link href="/promocoes" className="w-full">
                <Button className="uppercase text-xs lg:text-sm text-white bg-pink-800 hover:bg-pink-600 focus:bg-pink-600 w-full">
                  ¡Aprovechá Ahora!
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-[75%] xl:w-[70%] relative">
            <Carousel opts={{ align: "start" }} className="w-full">
              <div className="absolute right-12 -top-12 sm:flex">
                <p className="text-pink-700 font-extrabold mr-10">Ver Todos</p>
                <div>
                  <CarouselPrevious className="left-24 rounded-none" style={{ borderRadius: "5px" }} />
                  <CarouselNext className="rounded-none" style={{ borderRadius: "5px" }} />
                </div>
              </div>
              <CarouselContent className="flex gap-[1px] px-3">
                {produtosEmPromocao.map((produto: any) => {
                  const percentualDesconto = produto.priceOld && produto.priceOld > produto.price
                    ? Math.round(((produto.priceOld - produto.price) / produto.priceOld) * 100)
                    : 0;

                  const totalEstoque = produto.variants.reduce((acc: number, variant: { availableStock?: number }) => acc + (variant.availableStock || 0), 0);

                  return (
                    <CarouselItem
                      key={produto.id}
                      className="flex-shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/4 xl:basis-1/4"
                    >
                      <div className="group relative flex flex-col bg-neutral-100 border-neutral-300 hover:bg-pink-100 transition-all">
                        <Link href={`/produtos/${produto.id}`} className="relative aspect-square w-full flex items-center justify-center overflow-hidden bg-white">
                          {produto.imagePrimary ? (
                            <Image
                              alt={produto.name}
                              src={produto.imagePrimary}
                              className="object-contain"
                              width={300}
                              height={300}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ width: 300, height: 300 }}>
                              <FaShoppingBag className="text-gray-400" size={110} />
                            </div>
                          )}
                        </Link>
                        <div className="flex flex-col w-full justify-between bg-white px-3 py-3 rounded-sm shadow-sm">
                          <Link href={`/produtos/${produto.id}`} className="flex flex-col gap-2 w-full">
                            <h3 className="truncate text-sm sm:text-base md:text-lg font-extrabold text-pink-700">
                              {produto.name}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 flex-wrap">
                              <p className="text-lg font-semibold text-pink-700 flex-wrap">
                                {new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU" }).format(produto.price)}
                              </p>
                              {produto.priceOld && (
                                <p className="text-sm font-semibold text-pink-600 line-through flex-wrap">
                                  {new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU" }).format(produto.priceOld)}
                                </p>
                              )}
                            </div>
                            {(() => {
                              const plain = produto.description
                                ? produto.description
                                    .replace(/<(br|p|div|li|h[1-6])[^>]*>/gi, ' ')
                                    .replace(/<[^>]+>/g, '')
                                    .replace(/\s+/g, ' ')
                                    .trim()
                                : '';
                              const preview = plain.length > 80 ? plain.slice(0, 77) + '...' : plain;
                              return (
                                <p className="text-xs font-medium text-neutral-700 sm:text-sm truncate">
                                  {preview}
                                </p>
                              );
                            })()}
                          </Link>

                          <div
                            className={`mt-2 text-xs font-semibold text-white ${totalEstoque > 1
                                ? "bg-green-700"
                                : totalEstoque === 1
                                  ? "bg-yellow-700"
                                  : "bg-red-700"
                              } px-2 py-1 rounded-md w-max`}
                          >
                            {totalEstoque > 1
                              ? `${totalEstoque} Disponibles`
                              : totalEstoque === 1
                                ? "Última Unidad"
                                : "Indisponible"}
                          </div>

                          <div className="mt-3">
                            <Link href={`/produtos/${produto.id}`}>
                              <button
                                className="w-full py-2 bg-pink-600 text-white text-sm font-semibold rounded-md hover:bg-pink-700 transition-all"
                              >
                                Ver detalles
                              </button>
                            </Link>
                          </div>
                        </div>
                        {percentualDesconto > 0 && (
                          <p className="absolute left-3 top-3 z-20 flex items-center bg-pink-700 px-3 py-1 text-sm font-semibold text-white">
                            {percentualDesconto}% OFF
                          </p>
                        )}
                      </div>
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