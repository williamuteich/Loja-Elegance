"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";

import { Home, Package, Gift, Layers, User, AlignJustify, Bell } from "lucide-react";
import SearchHeaderItems from "./searchHeaderItems";
import CheckoutHeader from "./checkoutHeader";
import { useSession } from "next-auth/react";
import { LogoutMenu } from "../../logoutAccount";

interface MenuSuspensoProps {
    initialProducts: any[];
}

export default function MenuSuspenso({ initialProducts }: MenuSuspensoProps) {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const [openDesktopMenu, setOpenDesktopMenu] = useState(false);
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
            <div className="bg-pink-600 frete-gratuito">
                <div className="max-w-[1400px] py-1 mx-auto px-4 font-medium text-center text-xs sm:text-sm sm:px-6 lg:px-8 text-white">
                    🎁📬Ofertas imperdíveis, aproveite!
                </div>
            </div>

            {/* DESKTOP HEADER */}
            <div className={`hidden md:block z-[90] ${isFixed ? "fixed z-10 top-0 left-0 w-full" : "relative"} transition-all bg-white text-black font-bold shadow-md shadow-gray-900/20`}>
                <div className="max-w-[1400px] mx-auto w-full sm:px-6 lg:px-8">
                    <div className={`flex items-center justify-between w-full ${isFixed ? "h-16 py-1" : "h-16 py-1"}`}>
                        {/* Menu Hambúrguer (só aparece quando fixo) */}
                        {isFixed && (
                            <Sheet open={openDesktopMenu} onOpenChange={setOpenDesktopMenu}>
                                <SheetTrigger asChild>
                                    <button
                                        className="mr-2 text-neutral-600 hover:text-pink-700 transition-colors"
                                        aria-label="Menu desktop"
                                    >
                                        <AlignJustify className="w-6 h-6" />
                                    </button>
                                </SheetTrigger>

                                <SheetContent side="left" className="bg-white text-white p-0">
                                    <SheetHeader className="bg-white p-4">
                                        <SheetTitle className="text-center">
                                            <span className="text-3xl font-bold text-pink-700 font-dancing">
                                                Elegance
                                            </span>
                                        </SheetTitle>
                                    </SheetHeader>
                                    <div className="grid gap-4 p-6">
                                        <nav className="flex flex-col gap-4">
                                            <Link
                                                href="/"
                                                onClick={() => setOpenDesktopMenu(false)}
                                                className="text-neutral-600 hover:text-pink-700 transition-colors flex items-center text-lg"
                                            >
                                                <Home className="w-5 h-5 mr-2" />
                                                Início
                                            </Link>
                                            <Link
                                                href="/produtos"
                                                onClick={() => setOpenDesktopMenu(false)}
                                                className="text-neutral-600 hover:text-pink-700 transition-colors flex items-center text-lg"
                                            >
                                                <Package className="w-5 h-5 mr-2" />
                                                Produtos
                                            </Link>
                                            <Link
                                                href="/promocoes"
                                                onClick={() => setOpenDesktopMenu(false)}
                                                className="text-neutral-600 hover:text-pink-700 transition-colors flex items-center text-lg"
                                            >
                                                <Gift className="w-5 h-5 mr-2" />
                                                Promoções
                                            </Link>
                                            <Link
                                                href="/colecoes"
                                                onClick={() => setOpenDesktopMenu(false)}
                                                className="text-neutral-600 hover:text-pink-700 transition-colors flex items-center text-lg"
                                            >
                                                <Layers className="w-5 h-5 mr-2" />
                                                Coleções
                                            </Link>
                                            {/*{session ? (
                                                <div className="mt-0 border-t-[1px] pt-4 border-gray-900">
                                                    <LogoutButton />
                                                </div>
                                            ) : null}*/}
                                            <div className="mt-0 border-t-[1px] pt-4 border-gray-900">
                                                <LogoutMenu />
                                            </div>
                                        </nav>
                                    </div>
                                </SheetContent>

                            </Sheet>
                        )}

                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center">
                                <h1 className={`font-bold font-dancing ${isFixed ? "text-2xl" : "text-3xl"} text-pink-700`}>
                                    Elegance
                                </h1>
                            </Link>
                        </div>

                        <div className={`${isFixed ? "flex-grow mx-4" : "w-1/2 mx-8"}`}>
                            <SearchHeaderItems initialProducts={initialProducts} />
                        </div>

                        <div className="flex items-center gap-4 text-black">
                            <div className="gap-1 flex items-center sm:flex">
                                {!session ? (
                                    <>
                                        <Link
                                            href="/cadastro"
                                            className="text-neutral-600 hover:text-pink-700 transition-colors flex items-center text-sm"
                                        >
                                            <User className="w-6 h-6 mr-1" />
                                            Fazer cadastro
                                        </Link>
                                        <span className="text-neutral-400">|</span>
                                        <Link
                                            href="/login"
                                            className="text-neutral-600 hover:text-pink-700 transition-colors flex items-center text-sm"
                                        >
                                            Fazer login
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href="/profile"
                                        className="text-neutral-600 hover:text-pink-700 transition-colors flex items-center text-sm"
                                    >
                                        <User className="w-6 h-6 mr-1" />
                                        Minha Conta
                                    </Link>
                                )}
                            </div>
                            <CheckoutHeader />
                        </div>
                    </div>

                    {/* Menu Principal (oculto durante scroll) */}
                    {!isFixed && (
                    <div className="flex justify-center py-2 border-t border-gray-200 bg-white">
                        <nav className="flex gap-6">
                            <Link href="/" className="flex items-center gap-1 text-neutral-600 hover:text-pink-700 transition-colors text-md font-medium">
                                <Home className="w-5 h-5 text-neutral-600 group-hover:text-pink-700 transition-colors" />
                                Inicio
                            </Link>
                            <Link href="/produtos" className="flex items-center gap-1 text-neutral-600 hover:text-pink-700 transition-colors text-md font-medium">
                                <Package className="w-5 h-5 text-neutral-600 group-hover:text-pink-700 transition-colors" />
                                Produtos
                            </Link>
                            <Link href="/promocoes" className="flex items-center gap-1 text-neutral-600 hover:text-pink-700 transition-colors text-md font-medium">
                                <Gift className="w-5 h-5 text-neutral-600 group-hover:text-pink-700 transition-colors" />
                                Promoções
                            </Link>
                            <Link href="/colecoes" className="flex items-center gap-1 text-neutral-600 hover:text-pink-700 transition-colors text-md font-medium">
                                <Layers className="w-5 h-5 text-neutral-600 group-hover:text-pink-700 transition-colors" />
                                Coleções
                            </Link>
                        </nav>
                    </div>
                    )}
                </div>
            </div>

            {/* MOBILE HEADER */}
            <div className={`${isFixed ? "fixed z-10 top-0 left-0 w-full" : "relative"} transition-all bg-white text-neutral-600 font-bold shadow-md shadow-gray-900/20 md:hidden`}>
                {/* Linha 1: Hamburger, Logo, Ícones */}
                <div className="flex justify-between items-center w-full px-4 py-3">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <button
                                className="cursor-pointer text-neutral-600 hover:text-pink-700 transition-colors bg-white"
                                aria-label="Menu mobile"
                            >
                                <AlignJustify className="w-6 h-6" />
                            </button>
                        </SheetTrigger>

                        {/* Menu mobile com fundo branco e cabeçalho preto */}
                        <SheetContent side="left" className="p-0 text-white">
                        <SheetHeader className="bg-white p-4">
                            <SheetTitle className="text-center">
                                <span className="text-3xl font-bold text-pink-700 font-dancing">
                                    Elegance
                                </span>
                            </SheetTitle>
                        </SheetHeader>
                        <div className="bg-white p-4 h-full">
                            <nav className="flex flex-col gap-6">
                                <span className="font-medium text-lg text-neutral-900">Menu</span>
                                <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3 text-neutral-600 hover:text-pink-700 transition-colors font-normal">
                                    <Home className="w-5 h-5 text-neutral-600 group-hover:text-pink-700 transition-colors" />
                                    <span>Início</span>
                                </Link>
                                <Link href="/produtos" onClick={() => setOpen(false)} className="flex items-center gap-3 text-neutral-600 hover:text-pink-700 transition-colors font-normal">
                                    <Package className="w-5 h-5 text-neutral-600 group-hover:text-pink-700 transition-colors" />
                                    <span>Produtos</span>
                                </Link>
                                <Link href="/promocoes" onClick={() => setOpen(false)} className="flex items-center gap-3 text-neutral-600 hover:text-pink-700 transition-colors font-normal">
                                    <Gift className="w-5 h-5 text-neutral-600 group-hover:text-pink-700 transition-colors" />
                                    <span>Promoções</span>
                                </Link>
                                <Link href="/colecoes" onClick={() => setOpen(false)} className="flex items-center gap-3 text-neutral-600 hover:text-pink-700 transition-colors font-normal">
                                    <Layers className="w-5 h-5 text-neutral-600 group-hover:text-pink-700 transition-colors" />
                                    <span>Coleções</span>
                                </Link>
                                {session ? (
                                    <div className="mt-0 border-t-[1px] pt-4 border-gray-900">
                                        <LogoutMenu />
                                    </div>
                                ) : null}
                            </nav>
                        </div>
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="text-2xl font-bold text-pink-700 font-dancing">
                        Elegance
                    </Link>

                    <div className="flex items-center gap-4 text-neutral-600">
                        <Link href="/faq" className="text-neutral-600 hover:text-pink-700 transition-colors" aria-label="Notificações">
                            <Bell className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                <div className="px-4 pb-3">
                    <SearchHeaderItems initialProducts={initialProducts} />
                </div>
            </div>
        </>
    );
}