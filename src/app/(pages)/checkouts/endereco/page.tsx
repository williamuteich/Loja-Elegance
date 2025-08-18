import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";
import { redirect } from "next/navigation";
import NewAddresses from "./components/addNewAddresses";
import UpdateAddresses from "./components/updateAddresses";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function EnderecosPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userID = session.user.userID;

  const userData = await prisma.user.findUnique({
    where: { id: userID },
    select: {
      name: true,
      email: true,
      telefone: true,
      enderecos: {
        select: {
          id: true,
          cep: true,
          logradouro: true,
          numero: true,
          complemento: true,
          bairro: true,
          cidade: true,
          estado: true,
          pais: true,
        },
      },
    },
  });

  if (!userData) {
    return <div>Erro ao carregar as informações do usuário</div>;
  }

  const enderecos = userData.enderecos.map((endereco) => ({
    ...endereco,
    complemento: endereco.complemento || "",
  })) || [];

  return (
    <div className="=w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Meus Endereços</h1>
          <p className="text-gray-600">Gerencie seus endereços para entrega</p>
        </div>
      </div>

      {!enderecos || enderecos.length === 0 ? (
        <div className="w-full mt-6">
          <NewAddresses userId={userID} />
        </div>
      ) : (
        <div className="w-full mt-6">
          <UpdateAddresses enderecos={enderecos} userID={userID} />
        </div>
      )}
    </div>
  );
}
