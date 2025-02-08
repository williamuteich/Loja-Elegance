import { Container } from "@/app/components/container";
import { FaFileAlt, FaList, FaTruck, FaCreditCard, FaBox } from 'react-icons/fa'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import ViewImages from "../components/viewImages";
import Produtos from "../components/produtos";
import { Produto } from "@/utils/types/produto";

export default async function ProdutoSlug({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params;

  const response = await fetch(`http://localhost:3000/api/product?id=${id}`);

  if (!response.ok) {
    return <div className="py-10 px-4 text-gra-800 text-xl font-bold">Erro ao buscar produto</div>
  }

  const { produtos } = await response.json();
  const quantity = produtos.stock.quantity;
  const categorias = produtos.categories.map((prodctCategory: Produto) => prodctCategory);

  return (
    <Container>
      <div className="flex justify-center py-10">
        <div className="bg-white w-full">
          <div className="lg:flex lg:flex-row flex-col gap-4">
            <ViewImages produtos={produtos} />
            <div className="lg:w-96 w-full p-4 space-y-6 border border-gray-300 " style={{ borderRadius: "5px" }}>
              <div className="w-full">
                <h2 className="text-xl relative uppercase font-extrabold text-pink-700 mb-4 text-start">{produtos.name}</h2>
                <div className="flex gap-2">
                  <p className="text-3xl text-pink-700 mb-1 font-bold">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(produtos.price)}</p>
                  <p className="text-xl text-gray-500 mb-1 line-through ">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(produtos.priceOld)}</p>
                </div>
                <p className="text-sm text-gray-600 mb-4 flex gap-1 items-center"> <FaCreditCard size={16} className="text-pink-700" /> até <span className="font-bold text-pink-700">12x</span> de <span className="font-bold text-pink-700">R$10,30</span></p>

                <div className="space-y-0">
                  <h3 className="text-sm text-gray-700 font-bold mb-1">Estoque Disponível</h3>
                  <div className="flex items-center gap-2 bg-gray-100 p-3 rounded shadow-sm">
                    <FaBox size={20} className="text-pink-700" />
                    <p className="text-md font-bold text-pink-700">
                      {quantity > 0 ? `${quantity > 1 ? `${quantity} Disponíveis` : `${quantity} Disponível`}` : 'Indisponível'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                className={`uppercase text-white py-3 px-6 rounded mt-6 w-full ${quantity > 0 ? 'bg-black hover:bg-gray-900 transition-all' : 'bg-gray-500'}`}
                disabled={quantity <= 0}
              >
                {quantity > 0 ? 'Adicionar ao Carrinho' : 'Produto Indisponível'}
              </button>

              <div className="mt-6 space-y-2">
                <div className="text-sm text-gray-600 p-3 px-4 border bg-gray-100 rounded">
                  <h3 className="font-bold text-base text-gray-800">Frete Grátis</h3>
                  <p className="text-gray-900">Todos os Produtos possuem frete grátis</p>
                </div>

                <div className="text-sm text-gray-600 p-3 px-4 border bg-gray-100 rounded">
                  <h3 className="font-bold text-base text-gray-800">Troca e Devolução</h3>
                  <p className="text-gray-900">Garantia de 7 dias para troca ou reembolso.</p>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-md justify-start ">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1" className="flex flex-col items-start border border-gray-200 py-0 px-4 rounded ">
                    <AccordionTrigger className="gap-2">
                      <span>
                        <FaFileAlt size={22} />
                      </span>
                      Descrição do produto
                    </AccordionTrigger>
                    <AccordionContent className="max-h-44 overflow-y-auto">
                      {produtos.description}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="flex flex-col items-start border border-gray-200 py-0 px-4 rounded ">
                    <AccordionTrigger className="gap-2">
                      <span>
                        <FaList size={22} />
                      </span>
                      Características
                    </AccordionTrigger>
                    <AccordionContent className="max-h-44 overflow-y-auto">
                      {produtos.features}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="flex flex-col items-start border border-gray-200 py-0 px-4 rounded ">
                    <AccordionTrigger className="gap-2">
                      <span>
                        <FaTruck size={22} />
                      </span>
                      Envio e rastreio
                    </AccordionTrigger>
                    <AccordionContent className="gap-2">
                      Envio rápido e rastreio disponível.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="flex flex-col items-start border border-gray-200 py-0 px-4 rounded ">
                    <AccordionTrigger className="gap-2">
                      <span>
                        <FaCreditCard size={22} />
                      </span>
                      Preciso pagar alguma taxa?
                    </AccordionTrigger>
                    <AccordionContent>
                      Não, todas as taxas estão inclusas no preço final do produto.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

            </div>
          </div>

          <Produtos titulo="Produtos Relacionados" isDestaque={false} categoriaProduct={categorias} produtos={[]}/>
        </div>
      </div>
    </Container>

  )
}