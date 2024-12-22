import { Button } from "@/components/ui/button";
import ButtonAdicionar from "./components/adicionar";
import Link from "next/link";

export default async function Settings() {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/setup`);

    if (!response.ok) {
        console.error("Erro ao buscar FAQs:", response.statusText);
        return <p>Ocorreu um erro ao carregar as informações das Configurações.</p>;
    }

    const setup = await response.json();

    if (setup.length === 0 || !setup) {
        return (
            <div className="w-full px-8 py-10 min-h-screen bg-gray-50">
                <div className="mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
                    <h2 className="text-3xl font-semibold mb-4 text-gray-800">Nenhuma Configuração Encontrada</h2>
                    <p className="text-gray-600 mb-6 text-sm leading-[1.6]">
                        Ainda não há configurações para o seu site. Você pode adicionar novas variáveis para personalizar o site de acordo com suas necessidades.
                    </p>
                    <ButtonAdicionar data={setup} />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-8 py-10 min-h-screen bg-gray-50">
            <div className="mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold mb-3 text-gray-800">Configurações Gerais</h2>
                <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
                    Gerencie as variáveis do seu site, como URLs e nomes. As alterações feitas aqui são aplicadas globalmente, sem necessidade de alterar o código.
                </p>
                <table className="min-w-full table-auto border-collapse rounded-md border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-3 px-4 border border-slate-300 text-left text-sm font-medium text-gray-700 w-[180px]">Variável</th>
                            <th className="py-3 px-4 border border-slate-300 text-left text-sm font-medium text-gray-700 w-[180px]">Nome</th>
                            <th className="py-3 px-4 border border-slate-300 text-left text-sm font-medium text-gray-700">URL</th>
                            <th className="py-3 px-4 border border-slate-300 text-left text-sm font-medium text-gray-700">Valor</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                        {setup.map((config: any) => (
                            <tr key={config.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4 font-medium text-sm text-gray-700 border border-gray-300">{config.type}</td>
                                <td className="py-3 px-4 font-medium text-sm text-gray-700 border border-gray-300">{config.name}</td>

                                <td className="py-3 px-4 font-medium text-sm text-gray-700 border border-gray-300">
                                    {config.url ? (
                                        <Link href={config.url} className="text-blue-600">
                                            {config.url}
                                        </Link>
                                    ) : (
                                        <span className="text-gray-400">URL não disponível</span>
                                    )}
                                </td>

                                <td className="py-3 px-4 font-medium text-sm text-gray-700 border border-gray-300">
                                    <div className="flex items-center space-x-3">
                                        <span className="w-full p-2 border border-gray-300 rounded-md text-gray-700 truncate">
                                            {config.value ? config.value : <span className="text-gray-400">Valor não disponível</span>}
                                        </span>
                                        <Button className="bg-blue-500 text-white hover:bg-blue-600 font-semibold py-1 px-3 rounded-md transition duration-300 ease-in-out">
                                            Editar
                                        </Button>
                                        <Button variant="outline" className="bg-red-500 text-white hover:bg-red-600 font-semibold py-[6px] px-3 rounded-md transition duration-300 ease-in-out">
                                            Excluir
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-5 flex justify-between">
                    <ButtonAdicionar data={setup} />
                </div>
            </div>
        </div>
    );
}
