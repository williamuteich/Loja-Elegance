"use client";
import React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export function ClientCategoriesCarousel({ categories, delay = 4000 }: { categories: any[]; delay?: number }) {
  return (
    <Carousel
      opts={{
        loop: true,
        align: "start",
        slidesToScroll: "auto"
      }}
      plugins={[Autoplay({ delay })]}
    >
      <CarouselContent className="gap-1 md:gap-0 mx-8 py-2">
        {categories.map((cat: { id: string; name: string }) => (
          <CarouselItem
            key={cat.id}
            className="flex flex-col items-center basis-1/4 sm:basis-1/5 md:basis-1/6 max-w-[110px]"
          >
            <div className="group relative min-w-min flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-pink-50 border-2 border-pink-100 shadow-md hover:border-pink-300 transition-all duration-200 p-2">
              {/*colocar imagem*/}
              </div>
              <span
                className="block mt-1 text-pink-700 text-xs font-semibold text-center leading-tight max-w-[80px] break-words overflow-hidden"
                style={{ display: 'block', wordBreak: 'break-word', maxHeight: '2.6em' }}
                title={cat.name}
              >
                {cat.name}
              </span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
