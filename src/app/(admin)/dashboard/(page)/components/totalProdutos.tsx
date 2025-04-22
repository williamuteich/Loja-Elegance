import { FaBoxes } from "react-icons/fa";

import { cookies } from "next/headers";

export default  async function TotalProdutos() {
    const cookieStore = cookies();
    const allCookies = (await cookieStore).getAll();
    const cookieString = (allCookies as { name: string; value: string }[]).map(({ name, value }) => `${name}=${value}`).join('; ');
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/privada/product`, {
        headers: {
            cookie: cookieString,
            "Content-Type": "application/json"
        },
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    if (data.produtos.length === 0 || !data.produtos) {
        return (
          <div className="bg-white p-6 shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <p className="font-medium text-lg">Nenhum Produto Encontrado</p>
          </div>
        );
      }

    return (
        <div className="bg-white p-6 shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <p className="text-md text-gray-500 font-semibold">Produtos Cadastrados</p>
            <div className="flex items-center justify-between">
                <span className="text-2xl text-blue-600 font-extrabold">{data.totalRecords}</span>
                <div className="bg-blue-50 p-4 rounded-full">
                    <FaBoxes size={40} className="text-blue-500" />
                </div>
            </div>
            <div className="mt-1 flex gap-2 items-center">
                <span className="text-gray-600 font-medium text-sm">Total De Produtos Cadastrados.</span>
            </div>
        </div>
    )
}