import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";
import { redirect } from "next/navigation";
import { CheckoutClient } from "./components/CheckoutClient";
import { Suspense } from "react";
import CheckoutSkeleton from "./components/CheckoutSkeleton";
import { cookies } from "next/headers";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  const cookieHeader = (await cookies()).toString();

  if (!session?.user) {
    redirect("/login");
  }

  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/privada/addresses?userID=${session?.user.userID}`,
    {
      headers: { Cookie: cookieHeader },
      cache: "no-store"
    }
  );

  if (!response.ok) {
    return <div>Error ao carregar as informações do usuário</div>;
  }

  const data = await response.json();

  const endereco = data.enderecos?.[0] || {}; 

  return (
    <div className="min-h-screen bg-gray-50 py-6 mt-6">
      <Suspense fallback={<CheckoutSkeleton />}>
        <CheckoutClient endereco={endereco} />
      </Suspense>
    </div>
  );
}
