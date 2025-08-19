import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { FreteClient } from "./components/FreteClient";
import FreteSkeleton from "./components/FreteSkeleton";
import { AddressProviderWrapper } from "../components/AddressProviderWrapper";
import CartProtection from "../components/CartProtection";

export default async function FretePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');
  const userID = session.user.userID;

  return (
    <CartProtection 
      redirectTo="/produtos" 
      message="Adicione produtos ao carrinho antes de calcular o frete."
    >
      <AddressProviderWrapper>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<FreteSkeleton />}>
              <FreteClient userID={userID} />
            </Suspense>
          </div>
        </div>
      </AddressProviderWrapper>
    </CartProtection>
  );
}
