import { Container } from "@/app/components/container";
import Image from "next/image";

export default async function ProdutoSlug({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params;

  return (
    <Container>
      <div className="flex justify-center py-10">
        <div className="bg-white w-full">
          <div className="flex flex-row">
            <div className="flex flex-col space-y-2 items-center">
              {["/Frame_22.webp", "/Frame_24.webp", "/Frame6.webp", "/Frame8.webp"].map((src, index) => (
                <Image
                  key={index}
                  src={src}
                  width={80}
                  height={80}
                  quality={100}
                  priority={false}
                  alt={`Imagem ${index + 1}`}
                  className=" bg-gray-100 object-cover border border-gray-200 rounded cursor-pointer"
                />
              ))}
            </div>
            <div className="flex-1 px-2 flex justify-center items-start">
              <div className="w-full bg-gray-100 p-4 flex justify-center" style={{borderRadius: "5px"}}>
                <Image
                  src="/Frame_22.webp"
                  alt="Produto principal"
                  width={350}
                  height={350}
                  priority
                  className="rounded-lg cursor-pointer object-cover"
                />
              </div>
            </div>
            <div className="w-96 p-4 space-y-6 border border-gray-300 " style={{ borderRadius: "5px" }}>
              <h2 className="text-xl relative uppercase font-extrabold text-pink-700 mb-6 text-start">HOLLOW LEISURE MECHANICAL</h2>
              <p className="text-xl text-gray-800">R$ 123,56</p>
              <p className="text-sm text-gray-600">em até 12x de R$ 10,30</p>
              <div>
                <h3 className="text-sm font-semibold">COR: DOURADO</h3>
                <div className="flex space-x-2 mt-2">
                  {['gold', 'black', 'silver', 'gray'].map((color, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full border border-gray-400 ${color}`}
                    />
                  ))}
                </div>
              </div>
              <button className="bg-black uppercase text-white py-3 px-6 rounded mt-6 w-full">
                Adicionar ao Carrino
              </button>
              <div className="mt-6 space-y-4">
                <div className="text-sm text-gray-600">Frete Grátis</div>
                <div className="text-sm text-gray-600">Troca e Devolução</div>
              </div>
              <div className="mt-6 space-y-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-semibold">Todos os produtos possuem frete grátis.</h4>
                </div>
                <div>
                  <h4 className="font-semibold">Garantia de 7 dias para troca ou reembolso.</h4>
                </div>
                <div>
                  <h4 className="font-semibold">Descrição do produto</h4>
                  <p>Este relógio mecânico de lazer oferece um design moderno e sofisticado, perfeito para ocasiões especiais e uso diário.</p>
                </div>
                <div>
                  <h4 className="font-semibold">Envio e rastreio</h4>
                  <p>Envio rápido e rastreio de todas as compras disponíveis.</p>
                </div>
                <div>
                  <h4 className="font-semibold">Preciso pagar alguma taxa?</h4>
                  <p>Não, todas as taxas estão inclusas no preço final do produto.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>

  )
}