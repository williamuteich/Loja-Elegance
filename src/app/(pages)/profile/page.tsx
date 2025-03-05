import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";
import { UserProps } from "@/utils/types/user";
import DataProfile from "./components/dataProfile";
import NavProfile from "../../components/navProfile";

export default async function Profile() {
    const session: UserProps | null = await getServerSession(authOptions);

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/addresses?userID=${session?.user.userID}`);

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
