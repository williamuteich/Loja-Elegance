"use cache";

import { Container } from "@/app/components/container";
import { FaFileAlt, FaList, FaTruck, FaShieldAlt } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ViewImages from "../components/viewImages";
import Produtos from "../components/produtos";
import { VariantProps } from "@/utils/types/produto";
import EstoqueProdutos from "../components/estoqueProdutos";
import VendaWhatsapp from "../components/vendaWhatsapp";
import Countdown from "../components/Countdown";
import type { Metadata } from "next";

async function getProductData(id: string) {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/publica/product?id=${id}`,
    {
      next: { tags: ["loadProduct"] },
      cache: "force-cache"
    }
  );

  if (!response.ok) return null;

  const { produtos } = await response.json();
  return produtos;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const produtos = await getProductData((await params).id);

  if (!produtos) {
    return {
      title: "Produto não encontrado",
      description: "Não foi possível carregar o produto.",
    };
  }

  const categories = Array.isArray(produtos.categories) ? produtos.categories : [];
  const images = Array.isArray(produtos.images) ? produtos.images : [];

  return {
    title: `${produtos.name} | Bazar Elegance - Barra do Quaraí`,
    description:
      produtos.description?.substring(0, 160) ||
      "Producto de calidad a excelente precio en la frontera Uruguay–Brasil",
    keywords: [
      ...categories.map((c: any) => c.name),
      produtos.name,
      "bazar Elegance",
      "Barra do Quaraí",
      "compras en la frontera",
      "productos económicos",
      "e‑commerce transfronterizo",
      "frontera Uruguay Brasil",
      "ofertas frontera",
      "envío sin fronteras",
      "comprar barato Uruguay",
      "shop frontera",
    ],
    openGraph: {
      title: `${produtos.name} | Bazar Elegance`,
      description:
        produtos.description?.substring(0, 160) ||
        "Mejores precios en la región de frontera",
      url: `${process.env.NEXTAUTH_URL}/produtos/${(await params).id}`,
      siteName: "Bazar Elegance",
      images: images.map((img: any) => ({
        url: img.url,
        width: 800,
        height: 600,
        alt: produtos.name,
      })),
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${produtos.name} | Bazar Fronteira`,
      description:
        produtos.description?.substring(0, 160) ||
        "Produtos de qualidade na fronteira Uruguai-Brasil",
      images: images.length > 0 ? images[0].url : "/default-image.jpg",
    },
    alternates: {
      canonical: `${process.env.NEXTAUTH_URL}/produtos/${(await params).id}`,
    },
    robots: "index, follow",
  };
}

export default async function ProdutoSlug({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const produtos = await getProductData((await params).id);

  if (!produtos) {
    return (
      <div className="py-20 text-center">
        <div className="text-xl font-bold text-pink-700">Erro ao buscar produto</div>
        <p className="text-gray-600 mt-2">O produto solicitado não pôde ser carregado.</p>
      </div>
    );
  }

  // Buscar TODOS os produtos para os relacionados
  const responseAll = await fetch(
    `${process.env.NEXTAUTH_URL}/api/publica/product?fetchAll=true`,
    { next: { tags: ["loadProduct"] } }
  );
  const { produtos: allProdutos } = await responseAll.json();

  const availableStock = Array.isArray(produtos.variants)
    ? produtos.variants
      .map((variant: VariantProps) => variant.availableStock)
      .reduce((acc: number, stock: number) => acc + stock, 0)
    : 0;

  const isActive = produtos.active;

  const categorias = Array.isArray(produtos.categories)
    ? produtos.categories
    : [];

  const { colors, stock, hex } = Array.isArray(produtos.variants)
    ? produtos.variants.reduce(
      (
        acc: { colors: string[]; stock: number[]; hex: string[] },
        item: VariantProps
      ) => {
        acc.colors.push(item.color.name);
        acc.hex.push(item.color.hexCode);
        acc.stock.push(item.stock.quantity);
        return acc;
      },
      { colors: [], stock: [], hex: [] }
    )
    : { colors: [], stock: [], hex: [] };

  const now = new Date();

  const showCountdown =
    produtos.onSale &&
    produtos.priceOld &&
    produtos.promotionDeadline &&
    new Date(produtos.promotionDeadline) > now;

  const images = Array.isArray(produtos.images) ? produtos.images : [];

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: produtos.name,
    description: produtos.description,
    image: images.map((img: any) => img.url),
    offers: {
      "@type": "Offer",
      price: produtos.price,
      priceCurrency: "UYU",
      priceValidUntil:
        produtos.promotionDeadline ||
        new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        )
          .toISOString()
          .split("T")[0],
      availability:
        availableStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${process.env.NEXTAUTH_URL}/produtos/${(await params).id}`,
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "190",
          currency: "UYU",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "UY",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: "1",
            maxValue: "2",
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: "1",
            maxValue: "3",
            unitCode: "d",
          },
        },
      },
    },
    brand: {
      "@type": "Brand",
      name: produtos.brand || "Bazar Fronteira",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "125",
    },
  };

  return (
    <Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="py-4 md:py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
            {/* Imagens do produto */}
            <div className="lg:w-1/2 p-4">
              <div className="overflow-visible">
                <ViewImages produtos={produtos} />
              </div>
            </div>

            {/* Detalhes do produto */}
            <div className="lg:w-1/2 p-4 md:p-6">
              <div className="space-y-4 md:space-y-5">
                <div>
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                    {produtos.name}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl md:text-3xl font-bold text-pink-600">
                        {new Intl.NumberFormat("es-UY", {
                          style: "currency",
                          currency: "UYU",
                        }).format(produtos.price)}
                      </span>

                      {produtos.priceOld && (
                        <span className="text-lg md:text-xl text-gray-500 line-through">
                          {new Intl.NumberFormat("es-UY", {
                            style: "currency",
                            currency: "UYU",
                          }).format(produtos.priceOld)}
                        </span>
                      )}
                    </div>

                    {showCountdown && (
                      <div className="w-full mt-2">
                        <Countdown
                          deadlineISO={produtos.promotionDeadline}
                          updatedAt={produtos.updatedAt}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1 md:space-y-0">
                  <EstoqueProdutos
                    isActive={isActive}
                    availableStock={availableStock}
                    colors={colors}
                    hex={hex}
                    stock={stock}
                    produtos={produtos}
                  />

                  {/* Botões de ação - versão desktop */}
                  <div className="hidden md:block">
                    <VendaWhatsapp produto={produtos} />
                  </div>

                  {/* Botão WhatsApp no mobile, logo abaixo do botão adicionar ao carrinho */}
                  <div className="md:hidden mt-4">
                    <VendaWhatsapp produto={produtos} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 rounded-lg p-3 md:p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-pink-100 p-2 rounded-full">
                        <FaTruck className="text-pink-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm md:text-base">Envío Gratis</h3>
                        <p className="text-xs md:text-sm text-gray-700 mt-1">
                          Para Barra do Quaraí o compras desde $2500 pesos
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 rounded-lg p-3 md:p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-pink-100 p-2 rounded-full">
                        <FaShieldAlt className="text-pink-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm md:text-base">Calidad Garantizada</h3>
                        <p className="text-xs md:text-sm text-gray-700 mt-1">
                          Productos seleccionados con alto estándar
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4 pt-2">
                  <Accordion type="multiple" className="space-y-2 md:space-y-3">
                    <AccordionItem value="description" className="border border-gray-200 rounded-lg">
                      <AccordionTrigger className="px-3 py-2 md:px-4 md:py-3 hover:no-underline">
                        <div className="flex items-center gap-2 md:gap-3 font-medium text-gray-900 text-sm md:text-base">
                          <FaFileAlt className="text-pink-600" />
                          Descripción del producto
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-3 md:px-4 pb-3 md:pb-4">
                        <div
                          className="rich-content prose prose-pink max-w-none text-sm md:text-base"
                          dangerouslySetInnerHTML={{ __html: produtos.description }}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="features" className="border border-gray-200 rounded-lg">
                      <AccordionTrigger className="px-3 py-2 md:px-4 md:py-3 hover:no-underline">
                        <div className="flex items-center gap-2 md:gap-3 font-medium text-gray-900 text-sm md:text-base">
                          <FaList className="text-pink-600" />
                          Características
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-3 md:px-4 pb-3 md:pb-4">
                        <div
                          className="rich-content prose prose-pink max-w-none text-sm md:text-base"
                          dangerouslySetInnerHTML={{ __html: produtos.features }}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-16">
          <Produtos
            titulo="Produtos Relacionados"
            isDestaque={false}
            categoriaProduct={categorias}
            produtos={allProdutos}
          />
        </div>
      </div>
    </Container>
  );
}