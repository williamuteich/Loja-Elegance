import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";
import { redirect } from "next/navigation";
import { CheckoutClient } from "./components/CheckoutClient";
import { Suspense } from "react";
import CheckoutSkeleton from "./components/CheckoutSkeleton";
import { AddressProviderWrapper } from './components/AddressProviderWrapper';

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <AddressProviderWrapper>
      <div className="min-h-screen bg-gray-50 py-6 mt-6">
        <Suspense fallback={<CheckoutSkeleton />}>
          <CheckoutClient userID={session.user.userID} />
        </Suspense>
      </div>
    </AddressProviderWrapper>
  );
}
