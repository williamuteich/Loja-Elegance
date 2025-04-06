import { Container } from "@/app/components/container";
import { FaFileAlt, FaList, FaBox } from 'react-icons/fa'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import ViewImages from "../components/viewImages";
import Produtos from "../components/produtos";
import { Produto } from "@/utils/types/produto";
import AddToCartButton from "@/app/components/addTocartButton";

export default async function ProdutoSlug({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/product?id=${id}`);

  if (!response.ok) {
    return <div className="py-10 px-4 text-gray-800 text-xl font-bold">
      Erro ao buscar produto
    </div>
  }

  const { produtos } = await response.json();
  const availableStock = produtos.availableStock;
  const isActive = produtos.active;
  const categorias = produtos.categories.map((prodctCategory: Produto) => prodctCategory);

  return (
    <Container>
      <div className="flex justify-center py-10">
        <div className="bg-white w-full">
          <div className="lg:flex lg:flex-row flex-col gap-4">
            <ViewImages produtos={produtos} />

            <div className="lg:w-[900px] w-full p-4 space-y-6 border border-gray-300 rounded-lg">
              <div className="w-full">
                <h2 className="text-xl uppercase font-extrabold text-pink-700 mb-4">
                  {produtos.name}
                </h2>

                <div className="flex gap-1 flex-wrap mb-1">
                  <p className="text-3xl text-pink-700 font-bold">
                    {new Intl.NumberFormat("es-UY", {
                      style: "currency",
                      currency: "UYU"
                    }).format(produtos.price)}
                  </p>
                  {produtos.priceOld && (
                    <p className="text-xl text-gray-500 line-through">
                      {new Intl.NumberFormat("es-UY", {
                        style: "currency",
                        currency: "UYU"
                      }).format(produtos.priceOld)}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-0">
                    <h3 className="text-sm text-gray-700 font-bold mb-1">
                      Estoque Disponível
                    </h3>
                    <div className="flex items-center gap-2 bg-gray-100 p-3 rounded shadow-sm">
                      <FaBox size={20} className="text-pink-700" />
                      <p className="text-md font-bold text-pink-700">
                        {isActive && availableStock > 0
                          ? `${availableStock} ${availableStock > 1 ? 'Disponíveis' : 'Disponível'}`
                          : 'Indisponível'}
                      </p>
                    </div>
                  </div>

                  {availableStock > 0 ? (
                    <AddToCartButton produto={produtos} />
                  ) : (
                    <button
                      className="uppercase text-white py-3 px-6 rounded mt-6 w-full bg-gray-500"
                      disabled
                    >
                      Produto Indisponível
                    </button>
                  )}
                </div>

                <div className="mt-6 space-y-2">
                  <div className="text-sm text-gray-600 p-3 px-4 border bg-gray-100 rounded">
                    <h3 className="font-bold text-base text-gray-800">Envío Gratis</h3>
                    <p className="text-gray-900">Envío gratis en compras superiores a <strong>$600</strong> pesos</p>
                  </div>

                  <div className="text-sm text-gray-600 p-3 px-4 border bg-gray-100 rounded">
                    <h3 className="font-bold text-base text-gray-800">Calidad Garantizada</h3>
                    <p className="text-gray-900">Productos seleccionados con alto estándar de calidad</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-md">
                  <Accordion type="single" collapsible className="flex flex-col gap-2">
                    <AccordionItem value="item-1" className="border border-gray-200 rounded">
                      <AccordionTrigger className="px-4">
                        <div className="flex items-center gap-2">
                          <FaFileAlt size={18} />
                          Descrição do produto
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 max-h-44 overflow-y-auto">
                        {produtos.description}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border border-gray-200 rounded">
                      <AccordionTrigger className="px-4">
                        <div className="flex items-center gap-2">
                          <FaList size={18} />
                          Características
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 max-h-44 overflow-y-auto">
                        {produtos.features}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>

          <Produtos
            titulo="Produtos Relacionados"
            isDestaque={false}
            categoriaProduct={categorias}
            produtos={[]}
          />
        </div>
      </div>
    </Container>
  )
}