"use client"
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";

import { Home, Package, Tag, Phone, HelpCircle, Truck, User, AlignJustify } from "lucide-react";
import SearchHeaderItems from "./searchHeaderItems";
import CheckoutHeader from "./checkoutHeader";
import Image from 'next/image'
import { useSession } from "next-auth/react";

interface MenuSuspensoProps {
  initialProducts: any[];
}

export default function MenuSuspenso({ initialProducts }: MenuSuspensoProps) {
    const { data: session } = useSession();
    const pathname = usePathname();

    const [isFixed, setIsFixed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const freteGratuitoSection = document.querySelector('.frete-gratuito');
            const fretePosition = freteGratuitoSection?.getBoundingClientRect().bottom;

            if (fretePosition && fretePosition <= 0) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (pathname.startsWith("/dashboard")) {
        return null;
    }

    return (
        <>
            <div className="bg-pink-700 frete-gratuito">
                <div className="max-w-[1400px] py-1 mx-auto px-4 font-medium text-center text-sm sm:text-base sm:px-6 lg:px-8 text-white">
                    ¡Ofertas imperdibles, aproveche!
                </div>
            </div>
            <div
                className={`hidden md:block z-50 ${isFixed ? "hidden md:block sm:fixed z-10 top-0 left-0 w-full" : "relative"
                    } transition-all bg-white text-gray-900 font-bold shadow-md shadow-pink-100`}
            >
                <div className="max-w-[1400px] mx-auto w-full sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between w-full h-16 pb-2">
                        <div className="flex-shrink-0">
                            <Link
                                href="/"
                                className="text-3xl font-bold text-pink-700 hover:text-pink-800 transition-all flex flex-col relative"
                            >
                                <h1 className="z-50">Elegance</h1>
                                <span className="text-xs text-end z-50">Accesorios</span>
                                <Image
                                    className="absolute -left-4 top-0 -rotate-45 w-[60] h-[60]"
                                    src="/fundoLogo.png"
                                    alt="Fundo logo"
                                    width={60}
                                    height={60}
                                    quality={100}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </Link>
                        </div>

                        <nav className="flex gap-8">
                            <Link
                                href="/"
                                title="Inicio"
                                className="text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/produtos"
                                title="Productos"
                                className="text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
                            >
                                Productos
                            </Link>
                            <Link
                                href="/promocoes"
                                title="Promociones"
                                className="text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
                            >
                                Promociones
                            </Link>
                            <Link
                                href="/contato"
                                title="Contacto"
                                className="text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
                            >
                                Contacto
                            </Link>
                            <Link
                                href="/faq"
                                title="FAQ"
                                className="text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
                            >
                                FAQ
                            </Link>
                        </nav>

                        <div className="flex gap-4 text-gray-600">
                            <Suspense>
                                <SearchHeaderItems initialProducts={initialProducts} />
                            </Suspense>

                            <Link
                                href={session ? "/profile" : "/login"}
                                className="hover:text-pink-600 transition-colors duration-300"
                                aria-label={session ? "Perfil" : "Iniciar sesión"}
                            >
                                <User className="w-6 h-6" />
                            </Link>

                            <CheckoutHeader />
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={`${isFixed ? "fixed z-10 top-0 left-0 w-full" : "relative"
                    } transition-all bg-white text-gray-900 font-bold shadow-md shadow-pink-100 md:hidden`}
            >
                <div className="flex justify-between md:hidden max-w-[1400px] mx-auto w-full px-4 py-4 bg-white text-gray-900 font-bold shadow-md">
                    <div className="flex justify-between items-center gap-4">
                        <Sheet>
                            <SheetTrigger asChild>

                                <button
                                    type="button"
                                    aria-label="Menú móvil"
                                    className="cursor-pointer hover:text-pink-600 transition-colors"
                                >
                                    <AlignJustify className="w-6 h-6 text-gray-700" />
                                </button>
                            </SheetTrigger>

                            <SheetContent aria-describedby={undefined} side="left" className="bg-white p-6">
                                <SheetHeader>
                                    <SheetTitle className="text-center">
                                        <span className="text-3xl font-bold text-pink-600 hover:text-pink-800 transition-all">
                                            Elegance
                                        </span>
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="grid gap-6 py-4 border-t-[1px] border-gray-300 mt-6">
                                    <nav className="flex flex-col gap-6">
                                        <span className="font-medium text-xl">Explorar</span>
                                        <Link
                                            href="/"
                                            title="Inicio"
                                            aria-label="Inicio"
                                            className="flex items-center gap-3 text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
                                        >
                                            <Home className="w-6 h-6" aria-hidden="true" />
                                            <span>Inicio</span>
                                        </Link>

                                        <Link
                                            href="/produtos"
                                            title="Productos"
                                            aria-label="Productos"
                                            className="flex items-center gap-3 text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
                                        >
                                            <Package className="w-6 h-6" aria-hidden="true" />
                                            <span>Productos</span>
                                        </Link>

                                        <Link
                                            href="/promocoes"
                                            title="Promociones"
                                            aria-label="Promociones"
                                            className="flex items-center gap-3 text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
                                        >
                                            <Tag className="w-6 h-6" aria-hidden="true" />
                                            <span>Promociones</span>
                                        </Link>

                                        <Link
                                            href="/contato"
                                            title="Contacto"
                                            aria-label="Contacto"
                                            className="flex items-center gap-3 text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
                                        >
                                            <Phone className="w-6 h-6" aria-hidden="true" />
                                            <span>Contacto</span>
                                        </Link>

                                        <Link
                                            href="/faq"
                                            title="FAQ"
                                            aria-label="FAQ"
                                            className="flex items-center gap-3 text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal"
                                        >
                                            <HelpCircle className="w-6 h-6" aria-hidden="true" />
                                            <span>FAQ</span>
                                        </Link>
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <Suspense>
                            <SearchHeaderItems initialProducts={initialProducts} />
                        </Suspense>
                    </div>

                    <div className="flex-shrink-0">
                        <Link href="/" className="text-3xl font-bold text-pink-600 cursor-pointer hover:text-pink-800 transition-all">
                            Elegance
                        </Link>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-gray-600">
                        <Link
                            href="/login"
                            className="hover:text-pink-600 transition-colors duration-300"
                            aria-label="Iniciar sesión"
                        >
                            <User className="w-6 h-6" />
                        </Link>
                        <CheckoutHeader />
                    </div>
                </div>
            </div>
        </>
    );
}
