import Container from "../components/Container";
import { Suspense } from "react";
import Paginacao from "../../../../components/Paginacao";
import { LoadSkeleton } from "../components/loadSkeleton";
import SearchItems from "../components/searchItems";
import { FiltroBuscarItem } from "../components/FiltroBuscarItem";
import ModalDeletar from "../components/ModalDeletar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fetchCupons = async (search: string, page: string, status: string) => {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/cupom?${search ? `search=${search}&` : ''}${page ? `page=${page}&` : ''}${status ? `status=${status}` : ''}`)


  if (!response.ok) {
    console.log("Erro ao carregar os cupons.");
  }

  const data = await response.json();
  return data;
};

const CupomList = async ({ search, page, status }: { search: string, page: string, status: string }) => {
  const data = await fetchCupons(search, page, status);

  if (data.cupons.length === 0 || !data.cupons) {
    return (
      <>
        <p className="mt-10 font-medium text-lg">Nenhum Cupom Encontrado</p>
      </>
    );
  }

  return (
    <div>
      <p className="text-gray-700 text-base mb-3">
        <span className="font-semibold text-gray-800">Total de Cupons: </span>
        <span className="font-medium text-blue-600">{data.totalRecords}</span>
      </p>

      <div className="hidden xl:block">
        <table className="min-w-full table-auto border-collapse rounded-md border-t border-b border-gray-300">
          <thead className="bg-gray-800 text-white">
            <tr>
              {['ID', 'Código', 'Desconto (%)', 'Valor Mínimo', 'Data de Expiração', 'Status', ''].map((header, idx) => (
                <th key={idx} className="py-3 px-4 text-left text-sm font-medium text-white">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {data.cupons.map((cupom: any) => (
              <tr key={cupom.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-medium text-sm text-blue-600"><Link href={`/dashboard/cupom/${cupom.id}`}>{cupom.id}</Link></td>
                <td className="py-3 px-4 font-medium text-sm text-blue-600"><Link href={`/dashboard/cupom/${cupom.id}`}>{cupom.code}</Link></td>
                <td className="py-3 px-4 font-medium text-sm text-gray-700"><Link href={`/dashboard/cupom/${cupom.id}`}>{cupom.type === 'percentage' ? `${cupom.value}%` : `R$${cupom.value}`}</Link></td>
                <td className="py-3 px-4 font-medium text-sm text-gray-700"><Link href={`/dashboard/cupom/${cupom.id}`}>{cupom.min_purchase}</Link></td>
                <td className="py-3 px-4 font-medium text-sm text-gray-700"><Link href={`/dashboard/cupom/${cupom.id}`}>{new Date(cupom.expires_at).toLocaleDateString()}</Link></td>
                <td className="py-3 px-4 font-medium text-sm text-red-700">
                  <span className={Boolean(cupom.active) ? "text-green-700" : "text-red-600"}>
                    {Boolean(cupom.active) ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="py-3 px-0 font-medium text-sm text-gray-700">
                  <div className="flex justify-end items-center space-x-3">
                    <Link href={`/dashboard/produtos/${cupom.id}`}>
                      <Button className="bg-blue-800 text-white hover:bg-blue-700 font-semibold py-1 px-3 rounded-md transition duration-300 ease-in-out">
                        Editar
                      </Button>
                    </Link>
                    <ModalDeletar
                      config={{
                        id: cupom.id,
                        title: "Tem certeza de que deseja excluir esse Cupom?",
                        description: "Esta ação não pode ser desfeita. O Cupom será excluído permanentemente.",
                        apiEndpoint: `${process.env.NEXTAUTH_URL}/api/cupom`,
                        urlRevalidate: "/dashboard/cupom",
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paginacao
        totalRecords={data.totalRecords} data={data.cupom} />
    </div>
  );
};

const CupomWrapper = ({ search, page, status }: { search: string, page: string, status: string }) => {
  return (
    <Suspense fallback={<LoadSkeleton />}>
      <CupomList search={search} page={page} status={status} />
    </Suspense>
  );
};

export default async function Cupons({ searchParams }: { searchParams: Promise<{ search: string, page: string, status: string }> }) {
  const { search, page, status } = await searchParams;

  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Cupons de Desconto</h2>
      <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
        Aqui você pode gerenciar os cupons de desconto para sua loja.
      </p>
      <div className="flex gap-2 mb-6">
        <SearchItems />
        <FiltroBuscarItem />
      </div>
      <CupomWrapper search={search} page={page} status={status} />
      <div className="mt-5 w-full flex justify-end">
        <Link href={`/dashboard/cupom/adicionar`}>
          <Button variant="outline" className="bg-green-800 text-white hover:bg-green-600 font-semibold py-1 px-4 rounded-md transition duration-300 ease-in-out">
            Novo Cupom
          </Button>
        </Link>
      </div>
    </Container>
  );
}
