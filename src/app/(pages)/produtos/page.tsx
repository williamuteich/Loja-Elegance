export default function Produtos() {
    return (
      <div className="min-h-screen p-6 flex justify-center">
        <div className="bg-white w-full max-w-5xl rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-row">
            <div className="flex flex-col space-y-4 items-center">
              {["/Frame_22.webp", "/Frame_24.webp", "/Frame6.webp", "/Frame8.webp"].map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Imagem ${index + 1}`}
                  className="w-20 h-20 object-cover border border-gray-300 rounded cursor-pointer"
                />
              ))}
            </div>
            <div className="flex-1 p-4 flex justify-center items-center">
              <img
                src="/Frame_22.webp"
                alt="Produto principal"
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
            <div className="w-96 p-6 space-y-6">
              <h1 className="text-2xl font-bold">HOLLOW LEISURE MECHANICAL</h1>
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
              <button className="bg-black text-white py-3 px-6 rounded mt-6 w-full">
                ADICIONAR AO CARRINHO
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
    );
  }
  