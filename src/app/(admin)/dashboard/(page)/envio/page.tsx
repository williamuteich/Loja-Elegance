import { FaEdit, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import Container from '../components/Container';

export default function Envio() {
    return (
        <Container>
            <h2 className="text-3xl font-semibold mb-3 text-gray-800">Configuração de Endereços de Retirada</h2>

            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Endereço da Loja (Retirada)</h3>
                <div className="p-4 bg-gray-100 rounded-md shadow-md flex justify-between items-center">
                    <div>
                        <p className="text-lg font-semibold">Ney da Gama Ahrends, 706</p>
                        <p className="text-sm text-gray-600">Centro, São José - SC, 88110-001</p>
                    </div>
                    <button
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                        <FaEdit size={18} />
                        <span>Alterar</span>
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Outros Endereços de Retirada</h3>
                <ul className="space-y-4">
                    <li className="p-4 bg-white rounded-md shadow-md border border-gray-200 flex justify-between items-center">
                        <div>
                            <p className="text-lg font-semibold">Avenida 18 de Julio, 1300</p>
                            <p className="text-sm text-gray-600">Montevideo, Uruguay, 11000-000</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="text-blue-600 hover:text-blue-800">
                                <FaEdit size={18} />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                                <FaTrashAlt size={18} />
                            </button>
                        </div>
                    </li>

                    {/* Endereço 2 */}
                    <li className="p-4 bg-white rounded-md shadow-md border border-gray-200 flex justify-between items-center">
                        <div>
                            <p className="text-lg font-semibold">Calle Colón, 1234</p>
                            <p className="text-sm text-gray-600">Montevideo, Uruguay, 11000-000</p>
                        </div>
                        <div className="flex gap-4">
                            {/* Editar */}
                            <button className="text-blue-600 hover:text-blue-800">
                                <FaEdit size={18} />
                            </button>
                            {/* Excluir */}
                            <button className="text-red-600 hover:text-red-800">
                                <FaTrashAlt size={18} />
                            </button>
                        </div>
                    </li>
                </ul>

                <button
                    className="mt-6 flex items-center gap-2 text-green-600 hover:text-green-800"
                >
                    <FaPlusCircle size={20} />
                    <span>Adicionar Novo Endereço</span>
                </button>
            </div>
        </Container>
    );
}
