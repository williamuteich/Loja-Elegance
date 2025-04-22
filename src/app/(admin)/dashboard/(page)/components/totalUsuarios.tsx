//import { headers } from "next/headers";
import { FaUsers } from "react-icons/fa";

export default async function TotalUsuarios() {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/privada/user`, 
        //{
        //    headers: await headers()
        //}
    );
    
    if (!response.ok) {
        console.log("Erro ao carregar os usuários.");
    }
    
    const data = await response.json();

    if (data.usuarios.length === 0 || !data.usuarios) {
        return (
          <div className="bg-white p-6 shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <p className="font-medium text-lg">Nenhum Usuário Encontrado</p>
          </div>
        );
      }

    return (
        <div className="bg-white p-6 shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <p className="text-md text-gray-500 font-semibold">Total de Usuários</p>
            <div className="flex items-center justify-between">
                <span className="text-2xl text-blue-600 font-extrabold">{data.totalRecords}</span>
                <div className="bg-blue-50 p-4 rounded-full">
                    <FaUsers size={40} className="text-blue-500" />
                </div>
            </div>
            <div className="mt-1 flex gap-2 items-center">
                <div className="flex gap-2">
                    <span className="bg-green-500 font-bold text-sm p-2 rounded-full"></span>
                </div>
                <span className="text-gray-500 font-medium text-sm">Usuários Cadastrados</span>
            </div>
        </div>
    )
}