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
      className="w-full px-4"
    >
      <CarouselContent className="py-6">
        {categories.map((cat) => (
          <CarouselItem
            key={cat.id}
            className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-1/8 flex justify-center"
          >
            <Link 
              href={`/produtos?categoria=${encodeURIComponent(cat.name).replace(/%20/g, '+')}`}
              className="group flex flex-col items-center w-full"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    width={96}
                    height={96}
                    quality={95}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-50 rounded-full">
                    <FaTag className="text-pink-400 text-2xl sm:text-3xl" />
                  </div>
                )}
                
                {/* Efeito de hover sutil */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
              </div>
              
              <span 
                className="mt-3 text-center text-gray-700 font-medium text-sm transition-colors duration-200 group-hover:text-pink-600 line-clamp-2 px-1"
                title={cat.name}
              >
                {cat.name}
              </span>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}