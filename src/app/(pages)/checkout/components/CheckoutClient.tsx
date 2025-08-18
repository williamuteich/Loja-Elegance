"use client";

import { ResumoCompra } from "./ResumoCompra";
import { useCart } from "@/context/cartContext";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { EnderecoEntrega } from "./EnderecoEntrega";
import { useAddress } from '@/context/addressContext';

export function CheckoutClient({ userID }: { userID: string }) {
    const { cart, isHydrated } = useCart();
    const { address, setAddress, fetchAddress } = useAddress();
    const router = useRouter();

    useEffect(() => {
        if (!isHydrated) return;
        if (cart.length === 0) {
            router.push('/');
        }
    }, [cart.length, isHydrated, router]);

    useEffect(() => {
        if (userID && !address) {
            fetchAddress(userID);
        }
    }, [userID, address, fetchAddress]);

    if (!isHydrated) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                    <EnderecoEntrega />
                </div>
                <div className="lg:w-80 lg:flex-shrink-0">
                    <ResumoCompra />
                </div>
            </div>
        </div>
    );
}
