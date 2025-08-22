import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";
import { redirect } from "next/navigation";
import NewAddresses from "./components/addNewAddresses";
import UpdateAddresses from "./components/updateAddresses";
import { PrismaClient } from "@prisma/client";
import CartProtection from "../components/CartProtection";

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
      cpf: true,
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
    <CartProtection 
      redirectTo="/produtos" 
      message="Adicione produtos ao carrinho antes de configurar endereços."
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">

        <div>
          <h2 className="text-2xl font-bold text-pink-700 mb-4">Dados Para Entrega</h2>
          {!enderecos || enderecos.length === 0 ? (
            <div className="w-full mt-6">
              <NewAddresses 
                userId={userID} 
                userData={{
                  name: userData.name,
                  email: userData.email,
                  cpf: userData.cpf,
                  telefone: userData.telefone,
                }}
              />
            </div>
          ) : (
            <div className="w-full mt-6">
              <UpdateAddresses 
                enderecos={enderecos} 
                userID={userID}
                userData={{
                  name: userData.name,
                  email: userData.email,
                  cpf: userData.cpf,
                  telefone: userData.telefone,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </CartProtection>
  );
}
