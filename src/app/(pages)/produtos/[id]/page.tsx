"use cache";

import { Container } from "@/app/components/container";
import { FaFileAlt, FaList } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ViewImages from "../components/viewImages";
import Produtos from "../components/produtos";
import { Produto, VariantProps } from "@/utils/types/produto";
import EstoqueProdutos from "../components/estoqueProdutos";
import VendaWhatsapp from "../components/vendaWhatsapp";
import Countdown from "../components/Countdown";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/publica/product?id=${id}`
  );

  if (!response.ok) {
    return {
      title: "Produto não encontrado",
      description: "Não foi possível carregar o produto.",
    };
  }

  const { produtos } = await response.json();

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
      url: `${process.env.NEXTAUTH_URL}/produtos/${id}`,
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
      canonical: `${process.env.NEXTAUTH_URL}/produtos/${id}`,
    },
    robots: produtos.active ? "index, follow" : "noindex, nofollow",
  };
}

export default async function ProdutoSlug({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/publica/product?id=${id}`,
    {
      next: { tags: ["loadProduct"] },
    }
  );

  if (!response.ok) {
    return (
      <div className="py-10 px-4 text-gray-800 text-xl font-bold">
        Erro ao buscar produto
      </div>
    );
  }

  const { produtos } = await response.json();

  await fetch(`${process.env.NEXTAUTH_URL}/api/analytics/product-views`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId: produtos.id,
      productName: produtos.name,
    }),
  });

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
      url: `${process.env.NEXTAUTH_URL}/produtos/${id}`,
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

      <div className="flex justify-center py-10">
        <div className="bg-white w-full">
          <div className="lg:flex lg:flex-row flex-col gap-4">
            <ViewImages produtos={produtos} />
            <div className="lg:w-[900px] w-full p-4 space-y-6 border border-gray-300 rounded-lg">
              <div className="w-full">
                <h2 className="text-xl uppercase font-extrabold text-pink-700 mb-4">
                  {produtos.name}
                </h2>

                <div className="flex gap-1 flex-wrap mb-1">
                  <p className="text-3xl text-pink-700 font-bold">
                    {new Intl.NumberFormat("es-UY", {
                      style: "currency",
                      currency: "UYU",
                    }).format(produtos.price)}
                  </p>
                  {produtos.priceOld && (
                    <p className="text-xl text-gray-500 line-through">
                      {new Intl.NumberFormat("es-UY", {
                        style: "currency",
                        currency: "UYU",
                      }).format(produtos.priceOld)}
                    </p>
                  )}
                </div>

                {showCountdown && (
                  <Countdown
                    deadlineISO={produtos.promotionDeadline}
                    updatedAt={produtos.updatedAt}
                  />
                )}

                <div className="space-y-4">
                  <EstoqueProdutos
                    isActive={isActive}
                    availableStock={availableStock}
                    colors={colors}
                    hex={hex}
                    stock={stock}
                    produtos={produtos}
                  />
                </div>

                <div className="space-y-4">
                  <VendaWhatsapp produto={produtos} />
                </div>

                <div className="mt-6 space-y-2">
                  <div className="text-sm text-gray-600 p-3 px-4 border bg-gray-100 rounded">
                    <h3 className="font-bold text-base text-gray-800">Envío Gratis</h3>
                    <p className="text-gray-900">
                      Envío gratis para <strong>Barra do Quaraí</strong> o en compras a
                      partir de <strong>$2500</strong> pesos. Si no se cumple ninguna de
                      estas condiciones, el costo del envío es de <strong>$190</strong>.
                    </p>
                  </div>

                  <div className="text-sm text-gray-600 p-3 px-4 border bg-gray-100 rounded">
                    <h3 className="font-bold text-base text-gray-800">
                      Calidad Garantizada
                    </h3>
                    <p className="text-gray-900">
                      Productos seleccionados con alto estándar de calidad
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-md">
                  <Accordion type="single" collapsible className="flex flex-col gap-2">
                    <AccordionItem
                      value="item-1"
                      className="border border-gray-200 rounded"
                    >
                      <AccordionTrigger className="px-4">
                        <div className="flex items-center gap-2">
                          <FaFileAlt size={18} />
                          Descripción del producto
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 max-h-44 overflow-y-auto">
                        {produtos.description}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                      value="item-2"
                      className="border border-gray-200 rounded"
                    >
                      <AccordionTrigger className="px-4">
                        <div className="flex items-center gap-2">
                          <FaList size={18} />
                          Características
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 max-h-44 overflow-y-auto">
                        {produtos.features}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>

          <Produtos
            titulo="Produtos Relacionados"
            isDestaque={false}
            categoriaProduct={categorias}
          />
        </div>
      </div>
    </Container>
  );
}
