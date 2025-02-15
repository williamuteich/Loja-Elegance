import Link from "next/link";
import Container from "../components/Container";
import { Button } from "@/components/ui/button";
import ModalDeletar from "../components/ModalDeletar";
import Image from "next/image";
import { FaImage } from 'react-icons/fa';

export default async function Banners() {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/banner`, { next: { revalidate: 3600 } });

    if (!response.ok) {
        return <p>Ocorreu um erro ao carregar os banners.</p>;
    }

    const { banners } = await response.json();

    if (!banners || banners.length === 0) {
        return (
            <Container>
                <h2 className="text-3xl font-semibold mb-3 text-gray-800">Banners</h2>
                <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
                    Gerencie os banners exibidos na loja. Acesse, edite ou exclua informações sobre banners cadastrados.
                </p>
                <p className="mt-10 font-medium text-lg">Nenhum Banner Encontrado</p>
                <div className="mt-5 w-full flex justify-end">
                    <Link href={`/dashboard/banners/adicionar`}>
                        <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700 font-semibold py-1 px-4 rounded-md transition duration-300 ease-in-out">
                            Novo Banner
                        </Button>
                    </Link>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <h2 className="text-3xl font-semibold mb-3 text-gray-800">Banners</h2>
            <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
                Gerencie os banners exibidos na loja. Acesse, edite ou exclua informações sobre banners cadastrados.
            </p>
            
            <table className="min-w-full table-auto border-collapse rounded-md border-t border-b border-gray-300">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        {['ID', 'Imagem', 'Alt', 'Link', 'Ativo', ''].map((header, idx) => (
                            <th key={idx} className="py-3 px-4 text-left text-sm font-medium text-white">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                    {banners.map((banner: any) => (
                        <tr key={banner.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                            <td className="py-3 px-4 font-medium text-sm text-blue-600">
                                <Link href={`/dashboard/banners/${banner.id}`} className="block">
                                    {banner.id}
                                </Link>
                            </td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <Link href={`/dashboard/banners/${banner.id}`} className="block">
                                    <div>
                                        {banner.imageUrl ? (
                                            <Image
                                                priority
                                                width={60}
                                                height={40}
                                                src={banner.imageUrl}
                                                alt={`Banner ${banner.id}`}
                                                className="object-cover w-auto h-auto"
                                            />
                                        ) : (
                                            <div className="flex justify-center items-center">
                                                <FaImage size={25} color="#1f2937c4" />
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <Link href={`/dashboard/banners/${banner.id}`} className="block">
                                    {banner.alt} 
                                </Link>
                            </td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <Link href={`/dashboard/banners/${banner.id}`} className="block">
                                    {banner.link} 
                                </Link>
                            </td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <Link href={`/dashboard/banners/${banner.id}`} className="block">
                                    <span
                                        className={banner.active ? "text-green-700" : "text-red-600"}
                                    >
                                        {banner.active ? "Ativo" : "Inativo"}
                                    </span>
                                </Link>
                            </td>
                            <td className="py-3 px-4 font-medium text-sm text-gray-700">
                                <div className="flex justify-end items-center space-x-3">
                                    <Link href={`/dashboard/banners/${banner.id}`}>
                                        <Button className="bg-blue-800 text-white hover:bg-blue-700 font-semibold py-1 px-3 rounded-md transition duration-300 ease-in-out">
                                            Editar
                                        </Button>
                                    </Link>
                                    <ModalDeletar
                                        config={{
                                            id: banner.id,
                                            title: "Tem certeza de que deseja excluir esse banner?",
                                            description: "Esta ação não pode ser desfeita. O banner será excluído permanentemente.",
                                            apiEndpoint: `${process.env.NEXTAUTH_URL}/api/banner`,
                                            urlRevalidate: "/dashboard/banner",
                                        }}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-5 w-full flex justify-end">
                <Link href={`/dashboard/banners/adicionar`}>
                    <Button variant="outline" className="bg-green-800 text-white hover:bg-green-600 font-semibold py-1 px-4 rounded-md transition duration-300 ease-in-out">
                        Novo Banner
                    </Button>
                </Link>
            </div>
        </Container>
    );
}
