import { User } from "lucide-react";
import Image from "next/image";

export default function Profile() {
    const user = {
        name: "João Silva",
        email: "joao@email.com",
        phone: "11999999999",
        address: "Rua Exemplo, 123",
        neighborhood: "Centro",
        city: "São Paulo",
        postalCode: "01000-000",
        state: "SP",
        role: "Administrador",
        active: true,
        image: "https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg"
    };

    return (
        <div className="w-full mx-auto py-12">
            <div className="space-y-12">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Meus Dados</h2>

                    <div className="space-y-2 w-1/6 bg-gray-100">
                        <div className="flex flex-col items-center">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt="Imagem do Usuário"
                                    width={150}
                                    height={150}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="p-4 bg-gray-200 flex items-center justify-center rounded-full">
                                    <User className="text-gray-500" size={60} />
                                </div>
                            )}

                            <button
                                type="button"
                                className={`w-full px-4 py-2 text-white rounded-lg ${user.image ? 'bg-red-700' : 'bg-blue-500'}`}
                            >
                               {user.image ? 'Remover Imagem' : 'Adicionar Imagem'} 
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Informações do Usuário</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nome</label>
                            <input
                                type="text"
                                value={user.name}
                                disabled
                                className="w-full p-3 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full p-3 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Meu Endereço</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Endereço</label>
                            <input
                                type="text"
                                value={user.address}
                                disabled
                                className="w-full p-3 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bairro</label>
                            <input
                                type="text"
                                value={user.neighborhood}
                                disabled
                                className="w-full p-3 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cidade</label>
                            <input
                                type="text"
                                value={user.city}
                                disabled
                                className="w-full p-3 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">CEP</label>
                            <input
                                type="text"
                                value={user.postalCode}
                                disabled
                                className="w-full p-3 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Estado</label>
                            <input
                                type="text"
                                value={user.state}
                                disabled
                                className="w-full p-3 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Informações de Contato</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Telefone</label>
                            <input
                                type="text"
                                value={user.phone}
                                disabled
                                className="w-full p-3 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">email</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full p-3 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        className="bg-blue-500 text-white px-6 py-2 rounded-md font-medium"
                    >
                        Editar Informações
                    </button>
                </div>
            </div>
        </div>
    );
}
