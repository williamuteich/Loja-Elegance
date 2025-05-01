"use client";
import React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { FaTag } from 'react-icons/fa';
import Image from 'next/image';
import Link from "next/link";

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
        {categories.map((cat: {
          [x: string]: any; id: string; name: string
        }) => (
          <CarouselItem
            key={cat.id}
            className="flex flex-col items-center basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 max-w-[150px]"
          >
            <Link href={`/produtos?categoria=${encodeURIComponent(cat.name).replace(/%20/g, '+')}`}>
              <div className="group relative min-w-min flex flex-col items-center">
                <div className="w-[80px] h-[80px] flex cursor-pointer items-center justify-center rounded-full bg-pink-100 border-2 border-pink-100 shadow-md hover:border-pink-300 transition-all duration-200 overflow-hidden">
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="object-cover w-full h-full rounded-full transition-transform duration-200 group-hover:scale-110"
                      width={120}
                      height={120}
                      quality={100}
                    />
                  ) : (
                    <FaTag className="text-pink-300 text-3xl" />
                  )}
                </div>
                <span
                  className="block mt-1 text-pink-700 text-xs font-semibold text-center leading-tight max-w-[80px] break-words overflow-hidden"
                  style={{ display: 'block', wordBreak: 'break-word', maxHeight: '2.6em' }}
                  title={cat.name}
                >
                  {cat.name}
                </span>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
