import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";
import DataProfile from "./components/dataProfile";
import NavProfile from "../../components/navProfile";
//import { headers } from "next/headers";

import { cookies } from "next/headers";

export default async function Profile() {
    const session = await getServerSession(authOptions);

    // Pegue os cookies da requisição original e repasse no fetch interno (agora de forma assíncrona)
    const cookieHeader = (await cookies()).toString();

    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/privada/addresses?userID=${session?.user.userID}`,
      {
        headers: { Cookie: cookieHeader },
        cache: "no-store"
      }
    );

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
