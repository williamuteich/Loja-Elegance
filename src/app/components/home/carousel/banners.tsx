"use client"

import Image from 'next/image'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay';
import SubBannerHeader from './subBanner';

export function Banners() {
    return (
        <div>
            <div className="bg-slate-800">
                <Carousel
                    opts={{
                        loop: true,
                    }}
                    plugins={[
                        Autoplay({
                            delay: 6000,
                        })
                    ]}
                >
                    <CarouselContent>
                        <CarouselItem>
                            <div className="relative opacity-85 w-full h-[350px] md:h-[500px]">  
                                <Image
                                    className='object-cover'
                                    src="/imagem0.jpg"
                                    alt="Banner 0"
                                    fill 
                                    quality={100}
                                    priority
                                />
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div className="relative opacity-85 w-full h-[350px] md:h-[500px]">  
                                <Image 
                                    className='object-cover'
                                    src="/imagem1.jpg"
                                    alt="Banner 1" 
                                    fill
                                    quality={100}
                                />
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious className="left-6 md:left-20"/>
                    <CarouselNext className="right-6 md:right-20"/>
                </Carousel>
            </div>
           <SubBannerHeader />
        </div>
    );
}
