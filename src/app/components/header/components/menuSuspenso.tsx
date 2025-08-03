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

import { Home, Package, Tag, Phone, HelpCircle, User, AlignJustify } from "lucide-react";
import SearchHeaderItems from "./searchHeaderItems";
import CheckoutHeader from "./checkoutHeader";
import Image from 'next/image'
import { useSession } from "next-auth/react";

interface MenuSuspensoProps {
    initialProducts: any[];
}

export default function MenuSuspenso({ initialProducts }: MenuSuspensoProps) {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
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

            <div className={`hidden md:block z-50 ${isFixed ? "fixed z-10 top-0 left-0 w-full" : "relative"} transition-all bg-white text-gray-900 font-bold shadow-md shadow-pink-100`}>
                <div className="max-w-[1400px] mx-auto w-full sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between w-full h-20 pb-2">
                        <div className="flex-shrink-0 relative">
                            <Link href="/" className="flex flex-col items-start relative z-10">
                                <h1 className="text-5xl font-dancing text-pink-700 leading-none font-bold z-50">Elegance</h1>
                                <span className="text-xs tracking-wide text-gray-800 font-medium ml-1 text-end w-full hidden md:block">Accesorios</span>
                                <Image
                                    className="absolute -left-5 top-4 -rotate-45 z-0"
                                    src="/fundoLogo.png"
                                    alt="Fundo logo"
                                    width={50}
                                    height={50}
                                    quality={100}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </Link>
                        </div>

                        <nav className="flex gap-8">
                            <Link href="/" title="Inicio" className="text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal">Inicio</Link>
                            <Link href="/produtos" title="Productos" className="text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal">Productos</Link>
                            <Link href="/promocoes" title="Promociones" className="text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal">Promociones</Link>
                            <Link href="/contato" title="Contacto" className="text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal">Contacto</Link>
                            <Link href="/faq" title="FAQ" className="text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal">FAQ</Link>
                        </nav>

                        <div className="flex gap-4 text-gray-600">
                            <Suspense>
                                <SearchHeaderItems initialProducts={initialProducts} />
                            </Suspense>

                            <Link href={session?.user ? '/profile' : '/login'} className="hover:text-pink-600 transition-colors duration-300" aria-label={session?.user ? "Perfil" : "Iniciar sesión"}>
                                <User className="w-6 h-6" />
                            </Link>

                            <CheckoutHeader />
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${isFixed ? "fixed z-10 top-0 left-0 w-full" : "relative"} transition-all bg-white text-gray-900 font-bold shadow-md shadow-pink-100 md:hidden`}>
                <div className="flex justify-between md:hidden max-w-[1400px] mx-auto w-full px-4 py-4 bg-white text-gray-900 font-bold shadow-md z-[99]">
                    <div className="flex justify-between items-center gap-4">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <button type="button" aria-label="Menú móvil" className="cursor-pointer hover:text-pink-600 transition-colors">
                                    <AlignJustify className="w-6 h-6 text-gray-700" />
                                </button>
                            </SheetTrigger>

                            <SheetContent aria-describedby={undefined} side="left" className="bg-white p-6">
                                <SheetHeader>
                                    <SheetTitle className="text-center">
                                        <span className="text-5xl font-dancing font-bold text-pink-600 hover:text-pink-800 transition-all z-50">
                                            Elegance
                                        </span>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="grid gap-6 py-4 border-t-[1px] border-gray-300 mt-6">
                                    <nav className="flex flex-col gap-6">
                                        <span className="font-medium text-xl">Explorar</span>
                                        <Link href="/" title="Inicio" aria-label="Inicio" onClick={() => setOpen(false)} className="flex items-center gap-3 text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal">
                                            <Home className="w-6 h-6" aria-hidden="true" />
                                            <span>Inicio</span>
                                        </Link>
                                        <Link href="/produtos" title="Productos" aria-label="Productos" onClick={() => setOpen(false)} className="flex items-center gap-3 text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal">
                                            <Package className="w-6 h-6" aria-hidden="true" />
                                            <span>Productos</span>
                                        </Link>
                                        <Link href="/promocoes" title="Promociones" aria-label="Promociones" onClick={() => setOpen(false)} className="flex items-center gap-3 text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal">
                                            <Tag className="w-6 h-6" aria-hidden="true" />
                                            <span>Promociones</span>
                                        </Link>
                                        <Link href="/contato" title="Contacto" aria-label="Contacto" onClick={() => setOpen(false)} className="flex items-center gap-3 text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal">
                                            <Phone className="w-6 h-6" aria-hidden="true" />
                                            <span>Contacto</span>
                                        </Link>
                                        <Link href="/faq" title="FAQ" aria-label="FAQ" onClick={() => setOpen(false)} className="flex items-center gap-3 text-black-900 hover:text-pink-600 transition-colors duration-300 font-normal">
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
                        <Link href="/" className="text-4xl font-dancing text-pink-600 font-bold leading-none">
                            Elegance
                        </Link>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-gray-600">
                        <Link href="/login" className="hover:text-pink-600 transition-colors duration-300" aria-label="Iniciar sesión">
                            <User className="w-6 h-6" />
                        </Link>
                        <CheckoutHeader />
                    </div>
                </div>
            </div>
        </>
    );
}
