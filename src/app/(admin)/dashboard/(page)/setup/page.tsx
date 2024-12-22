import { Button } from "@/components/ui/button";
import ButtonAdicionar from "./components/adicionar";

export default async function Settings() {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/setup`);

    if (!response.ok) {
        console.error("Erro ao buscar FAQs:", response.statusText);
        return <p>Ocorreu um erro ao carregar as informações das Configurações.</p>;
    }

    const setup = await response.json();

    const socialMedia = setup.socialMedia;
    const contacts = setup.contacts;

    return (
        <div className="w-full px-6 py-8 min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-8">Página de Configurações</h1>

            <div className="bg-white p-6 border rounded-lg shadow-lg mb-8">
                <h2 className="text-3xl font-semibold mb-4">Redes Sociais</h2>
                <p className="text-gray-600 mb-6">Gerencie suas redes sociais aqui.</p>

                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="py-2 border-b text-left text-sm font-medium text-gray-700 w-[150px]">Nome</th>
                            <th className="py-2 border-b text-left text-sm font-medium text-gray-700">URL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {socialMedia.map((social: any) => (
                            <tr key={social.id}>
                                <td className="py-2 border-b text-sm text-gray-700">{social.name}</td>
                                <td className="py-2 border-b text-sm text-gray-700">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="url"
                                            readOnly
                                            value={social.url}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        />
                                        <Button className="bg-blue-500 text-white hover:bg-blue-600 font-semibold py-1 px-3 rounded-md transition duration-300 ease-in-out">Editar</Button>
                                        <Button variant="outline" className="bg-red-500 text-white hover:bg-red-600 font-semibold py-[6px] px-3 rounded-md transition duration-300 ease-in-out">Excluir</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-3 flex justify-between">
                <ButtonAdicionar data={socialMedia}/>
                </div>
            </div>

            <div className="bg-white border p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold mb-4">Contatos</h2>
                <p className="text-gray-600 mb-6">Gerencie seus contatos aqui.</p>

                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="py-2 border-b text-left text-sm font-medium text-gray-700 w-[150px]">Tipo</th>
                            <th className="py-2 border-b text-left text-sm font-medium text-gray-700">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((item: any) => (
                            <tr key={item.id}>
                                <td className="py-2 border-b text-sm text-gray-700">{item.type}</td>
                                <td className="py-2 border-b text-sm text-gray-700">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={item.value}
                                            readOnly
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        />
                                        <Button className="bg-blue-500 text-white hover:bg-blue-600 font-semibold py-1 px-3 rounded-md transition duration-300 ease-in-out">Editar</Button>
                                        <Button variant="outline" className="bg-red-500 text-white hover:bg-red-600 font-semibold py-[6px] px-3 rounded-md transition duration-300 ease-in-out">Excluir</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-3 flex justify-between">
                <ButtonAdicionar data={contacts}/>
                </div>
            </div>

            <div className="mt-4 text-end">
                <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700 font-semibold py-2 px-6 rounded-md transition duration-300 ease-in-out">Salvar</Button>
            </div>
        </div>
    );
}
