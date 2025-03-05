"use client"
import { FaWhatsapp, FaUnlockAlt, FaCreditCard } from "react-icons/fa";
import Autoplay from 'embla-carousel-autoplay';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Container } from "../../container";

export default function SubBannerHeader() {
  return (
    <div>
      <div className="md:flex gap-4 justify-between bg-gradient-to-r from-pink-700 via-pink-600 to-pink-500 p-4 hidden">
        <Container>
          <div className="flex gap-4 justify-between">
            <div className="flex items-center gap-4">
              <FaUnlockAlt size={28} className="text-white text-2xl" />
              <div className="flex flex-col">
                <span className="text-base font-semibold text-white">100% Seguro</span>
                <span className="text-sm text-zinc-100">Realiza tus compras con seguridad</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaCreditCard size={28} className="text-white text-2xl" />
              <div className="flex flex-col">
                <span className="text-base font-semibold text-white">Aceptamos Tarjetas</span>
                <span className="text-sm text-zinc-100">Paga hasta en 12x cuotas</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://wa.me/51998682733" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
                <FaWhatsapp size={28} className="text-green-500 text-2xl" />
                <div className="flex flex-col items-start leading-3">
                  <span className="text-base font-semibold text-white">¿Dudas?</span>
                  <span className="text-sm text-zinc-100">Contáctanos por WhatsApp</span>
                </div>
              </a>
            </div>
          </div>
        </Container>
      </div>

      <Carousel 
        className="md:hidden"
        opts={{
            loop: true,
        }}
        plugins={[
            Autoplay({
                delay: 2000,
            })
        ]}
      >
        <CarouselContent className="flex">
          <CarouselItem className="p-3 justify-center w-full bg-gradient-to-r from-pink-700 via-pink-600 to-pink-500 flex items-center gap-4">
            <FaWhatsapp size={28} className="text-green-500 text-2xl" />
            <div className="flex flex-col items-start">
              <span className="text-base font-semibold text-white">¿Dudas?</span>
              <span className="text-sm text-zinc-100">Contáctanos por WhatsApp</span>
            </div>
          </CarouselItem>

          <CarouselItem className="p-3 justify-center w-full bg-gradient-to-r from-pink-700 via-pink-600 to-pink-500 flex items-center gap-4">
            <FaUnlockAlt size={28} className="text-white text-2xl" />
            <div className="flex flex-col">
              <span className="text-base font-semibold text-white">100% Seguro</span>
              <span className="text-sm text-zinc-100">Realiza tus compras con seguridad</span>
            </div>
          </CarouselItem>

          <CarouselItem className="p-3 justify-center w-full bg-gradient-to-r from-pink-700 via-pink-600 to-pink-500 flex items-center gap-4">
            <FaCreditCard size={28} className="text-white text-2xl" />
            <div className="flex flex-col">
              <span className="text-base font-semibold text-white">Aceptamos Tarjetas</span>
              <span className="text-sm text-zinc-100">Paga hasta en 12x cuotas</span>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
}
