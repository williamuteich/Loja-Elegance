import Link from "next/link";
import Container from "../components/Container";
import { Button } from "@/components/ui/button";
import Paginacao from "../../../../components/Paginacao";
import SearchItems from "../components/searchItems";
import ModalDeletar from "../components/ModalDeletar";
import { FiltroBuscarItem } from "../components/FiltroBuscarItem";
import Image from "next/image";

import { FaBox } from 'react-icons/fa';
import { Produto, VariantProps } from "@/utils/types/produto";

export default async function Produtos({ searchParams }: { searchParams: Promise<{ search: string, page: string, status: string }> }) {
    const { search, page, status } = await searchParams;

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/product?${search ? `search=${search}&` : ''}${page ? `page=${page}&` : ''}${status ? `status=${status}` : ''}`);

    if (!response.ok) {
        return <p>Ocorreu um erro ao carregar os produtos.</p>;
    }

    const { produtos, totalRecords } = await response.json();

    if (!produtos || produtos.length === 0) {
        return (
            <Container>
                <h2 className="text-3xl font-semibold mb-3 text-gray-800">Produtos</h2>
                <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
                    Gerencie os produtos disponíveis na loja. Acesse, edite ou exclua informações sobre itens cadastrados e controle o estoque para manter o sistema atualizado.
                </p>
                <div className="flex gap-2 mb-4">
                    <SearchItems />
                    <FiltroBuscarItem />
                </div>
                <p className="mt-10 font-medium text-lg">Nenhum Produto Encontrado</p>
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
            <div className="flex gap-2 mb-6">
                <SearchItems />
                <FiltroBuscarItem />
            </div>
            <p className="text-gray-700 text-base mb-3">
                <span className="font-semibold text-gray-800">Total de produtos: </span>
                <span className="font-medium text-blue-600">{totalRecords}</span>
            </p>
            <table className="min-w-full table-auto border-collapse rounded-md border-t border-b border-gray-300">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        {['ID', 'Nome', 'Categoria', 'Marca', 'Preço', 'Quantidade', 'Variantes', 'Status', ''].map((header, idx) => (
                            <th key={idx} className="py-3 px-4 text-left text-sm font-medium text-white">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                    {produtos.map((produto: Produto) => (
                        <tr key={produto.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                            <td className="py-3 px-4 font-medium text-sm text-blue-600">
                                <Link href={`/dashboard/produtos/${produto.id}`} className="block">
                                    {produto.id}
                                </Link>
                            </td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <Link href={`/dashboard/produtos/${produto.id}`} className="block">
                                    <div className="flex items-center space-x-2">
                                        <div className="relative flex items-center justify-center">
                                            {produto.imagePrimary ? (
                                                <Image
                                                    priority
                                                    width={40}
                                                    height={40}
                                                    src={produto.imagePrimary}
                                                    alt={produto.id}
                                                    className="object-cover w-auto h-auto"
                                                />
                                            ) : (
                                                <div className="flex justify-center items-center">
                                                    <FaBox size={25} color="#1f2937c4" />
                                                </div>
                                            )}
                                        </div>
                                        <span>{produto.name}</span>
                                    </div>
                                </Link>
                            </td>

                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <Link href={`/dashboard/produtos/${produto.id}`} className="block">
                                    {produto.categories.reduce((acc, item, index) => {
                                        const separator = index > 0 ? ', ' : '';
                                        return acc + separator + item.category.name;
                                    }, '')}
                                </Link>
                            </td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <Link href={`/dashboard/produtos/${produto.id}`} className="block">
                                    {produto.brand.name}
                                </Link>
                            </td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <Link href={`/dashboard/produtos/${produto.id}`} className="block">
                                    R$ {produto.price}
                                </Link>
                            </td>

                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <Link href={`/dashboard/produtos/${produto.id}`} className="block">
                                    {produto.variants.reduce((total: number, variant: VariantProps) => total + variant.availableStock, 0)} unidades
                                </Link>
                            </td>

                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <Link href={`/dashboard/produtos/${produto.id}`} className="block">
                                    {produto.variants.map((variant: VariantProps, idx: number) => (
                                        <div key={idx} className="flex items-center space-x-2">
                                            <span className="w-4 h-4" style={{ backgroundColor: variant.color.hexCode }}></span>
                                            <span>{variant.color.name}</span>
                                            <span>- {variant.availableStock} em estoque</span>
                                        </div>
                                    ))}
                                </Link>
                            </td>

                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <Link href={`/dashboard/produtos/${produto.id}`} className="block">
                                    <span
                                        className={
                                            produto.active
                                                ? "text-green-700"
                                                : "text-red-600"
                                        }
                                    >
                                        {produto.active ? "Ativo" : "Inativo"}
                                    </span>
                                </Link>
                            </td>

                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <div className="flex justify-end items-center space-x-3">
                                    <Link href={`/dashboard/produtos/${produto.id}`}>
                                        <Button className="bg-blue-800 text-white hover:bg-blue-700 font-semibold py-1 px-3 rounded-md transition duration-300 ease-in-out">
                                            Editar
                                        </Button>
                                    </Link>
                                    <ModalDeletar
                                        config={{
                                            id: produto.id,
                                            title: "Tem certeza de que deseja excluir esse produto?",
                                            description:
                                                "Esta ação não pode ser desfeita. O produto será excluído permanentemente.",
                                            apiEndpoint: `${process.env.NEXTAUTH_URL}/api/product`,
                                            urlRevalidate: "/dashboard/produtos",
                                        }}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-5 w-full flex justify-end">
                <Link href={`/dashboard/produtos/adicionar`}>
                    <Button variant="outline" className="bg-green-800 text-white hover:bg-green-600 font-semibold py-1 px-4 rounded-md transition duration-300 ease-in-out">
                        Novo Produto
                    </Button>
                </Link>
            </div>

            <Paginacao data={produtos} totalRecords={totalRecords} />
        </Container>
    );
}
