import MenuSuspenso from "./components/menuSuspenso";
import { getServerSession } from "next-auth";
import { auth as authOptions} from "@/lib/auth-config";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="w-full z-50">
      <MenuSuspenso session={session}/>
    </header>
  );
}
