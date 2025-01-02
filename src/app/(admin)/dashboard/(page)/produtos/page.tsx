import Link from "next/link";
import { FaBox } from "react-icons/fa";

import Container from "../components/Container";
import ButtonAdicionar from "../components/ModalGeneric";
import { Button } from "@/components/ui/button";

interface ProductProps {
    id: string;
    name: string;
    description: string;
    price: number;
    active: boolean;
    categories: CategoryProps[];
    brand: BrandProps;
    stock: StockProps;
}

interface CategoryProps {
    id: string;
    name: string;
}

interface BrandProps {
    id: string;
    name: string;
}

interface StockProps {
    id: string;
    quantity: number;
}

export default async function Produtos() {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/product`);

    if (!response.ok) {
        return <p>Ocorreu um erro ao carregar os produtos.</p>;
    }

    const produtos: ProductProps[] = await response.json();

    if (!produtos || produtos.length === 0) {
        return (
            <Container>
                <h2 className="text-3xl font-semibold mb-3 text-gray-800">Sem Produtos Cadastrados</h2>
                <p className="text-gray-600 mb-10 text-sm leading-[1.6]">Atualmente, não há produtos cadastrados. Por favor, volte mais tarde.</p>
                <div className="mt-5 w-full flex justify-end">
                    <Link href={`/dashboard/produtos/adicionar`}>
                        <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700 font-semibold py-1 px-4 rounded-md transition duration-300 ease-in-out">
                            Novo Produto
                        </Button>
                    </Link>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <h2 className="text-3xl font-semibold mb-3 text-gray-800">Produtos</h2>
            <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
                Gerencie os produtos disponíveis na loja. Acesse, edite ou exclua informações sobre itens cadastrados e controle o estoque para manter o sistema atualizado.
            </p>
            <table className="min-w-full table-auto border-collapse rounded-md border-t border-b border-gray-300">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[120px]">ID</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[200px]">Nome</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[150px]">Categoria</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[150px]">Marca</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[150px]">Preço</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[120px]">Quantidade</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 w-[120px]">Status</th>
                        <th className="py-3 px-0 text-left text-sm font-medium text-gray-700 w-[200px]"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                    {produtos.map((produto) => (
                        <tr key={produto.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                            <td className="py-3 px-4 font-medium text-sm text-blue-600">
                                <Link href={`/dashboard/produtos/${produto.name}`} className="block">
                                    {produto.id}
                                </Link>
                            </td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <Link href={`/dashboard/produtos/${produto.name}`} className="block">
                                    <div className="flex items-center space-x-2">
                                        <FaBox size={22} className="text-gray-500" />
                                        <span>{produto.name}</span>
                                    </div>
                                </Link>
                            </td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <Link href={`/dashboard/produtos/${produto.name}`} className="block">
                                    {produto.categories.map((category) => (
                                        <span key={category.id}>{category.name}{' '}</span>
                                    ))}
                                </Link>
                            </td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <Link href={`/dashboard/produtos/${produto.name}`} className="block">
                                    {produto.brand.name}
                                </Link>
                            </td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <Link href={`/dashboard/produtos/${produto.name}`} className="block">
                                    {produto.price}
                                </Link>
                            </td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <Link href={`/dashboard/produtos/${produto.name}`} className="block">
                                    {produto.stock.quantity}
                                </Link>
                            </td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <Link href={`/dashboard/produtos/${produto.name}`} className="block">
                                    <span
                                        className={
                                            produto.active
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }
                                    >
                                        {produto.active ? "Ativo" : "Inativo"}
                                    </span>
                                </Link>
                            </td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-5 w-full flex justify-end">
                <Link href={`/dashboard/produtos/adicionar`}>
                    <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700 font-semibold py-1 px-4 rounded-md transition duration-300 ease-in-out">
                        Novo Produto
                    </Button>
                </Link>
            </div>
        </Container>
    );
}
