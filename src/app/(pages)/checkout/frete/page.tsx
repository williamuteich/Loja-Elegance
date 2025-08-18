import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { FreteClient } from "./components/FreteClient";
import FreteSkeleton from "./components/FreteSkeleton";
import { AddressProviderWrapper } from "../components/AddressProviderWrapper";

export default async function FretePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');
  const userID = session.user.userID;

  return (
    <AddressProviderWrapper>
      <div className="min-h-screen bg-gray-50 py-12">
        <Suspense fallback={<FreteSkeleton />}>
          <FreteClient userID={userID} />
        </Suspense>
      </div>
    </AddressProviderWrapper>
  );
}
