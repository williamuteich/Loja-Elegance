import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";
import { UserProps } from "@/utils/types/user";
import DataProfile from "./components/dataProfile";
import NavProfile from "../../components/navProfile";

import { cookies } from "next/headers";

export default async function Profile() {
    const session: UserProps | null = await getServerSession(authOptions);

    const cookieStore = cookies();
    const allCookies = (await cookieStore).getAll();
    const cookieString = (allCookies as { name: string; value: string }[]).map(({ name, value }) => `${name}=${value}`).join('; ');

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/privada/addresses?userID=${session?.user.userID}`,
      {
        headers: {
          cookie: cookieString,
          "Content-Type": "application/json"
        },
        cache: "no-store"
      });

    if (!response.ok) {
        return <div>Error al cargar la información del usuario</div>;
    }
    
    const data = await response.json();
    
    const endereco = data.enderecos?.[0] || {}; 
  
    return (
        <div className="w-full mx-auto py-12 flex gap-4 flex-col lg:flex-row">
            <NavProfile />
            <DataProfile data={data} endereco={endereco} userID={session?.user.userID || ''}/>
        </div>
    );
}
