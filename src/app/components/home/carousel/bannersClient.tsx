"use client"

interface Banner {
  id: string;
  imageUrl: string;
  active: boolean;
  link: string;
}

import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';

export function BannersClient({ banners }: { banners: Banner[] }) {
  return (
    <div className="w-full max-w-[1800px] mx-auto">
      <Carousel
        opts={{
          loop: true,
        }}
        plugins={[Autoplay({ delay: 8000 })]}
      >
      <CarouselContent>
        {banners
          .filter(item => item.active && item.imageUrl)
          .map((item) => (
            <CarouselItem key={item.id}>
              <div className="relative opacity-85 w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[530px]">
                <Link href={item.link || '#'}>
                <Image
                  className="object-cover"
                  src={item.imageUrl}
                  alt={`Banner ${item.id}`}
                  fill
                  quality={100}
                  priority
                  style={{objectFit: 'cover'}}
                />
                </Link>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>

      {banners.length > 1 && (
        <>
          <CarouselPrevious className="left-6 md:left-20 z-20" />
          <CarouselNext className="right-6 md:right-20 z-20" />
        </>
      )}
      </Carousel>
    </div>
  )
}
