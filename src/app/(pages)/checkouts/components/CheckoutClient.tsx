"use client";

import { FormaEntrega } from "./FormaEntrega";
import { ResumoCompra } from "./ResumoCompra";
import { useCart } from "@/context/cartContext";
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function CheckoutClient({ endereco } : { endereco: any }) {
    const { cart, isHydrated } = useCart();
    const router = useRouter();

    useEffect(() => {
        if (!isHydrated) return;
        if (cart.length === 0) {
            router.push('/');
        }
    }, [cart.length, isHydrated, router]);

    if (!isHydrated) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                    <FormaEntrega endereco={endereco} />
                </div>
                <div className="lg:w-80 lg:flex-shrink-0">
                    <ResumoCompra />
                </div>
            </div>
        </div>
    );
}
