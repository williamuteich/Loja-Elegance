import Link from "next/link";

const produtos = [
  {
    id: 1,
    nome: "Produto 1",
    precoOriginal: "R$ 99,99",
    precoPromocional: "R$ 79,99",
    imagem: "https://via.placeholder.com/300x200?text=Produto+1",
    descricao: "Descrição breve do Produto 1. Ótima qualidade e desempenho.",
    promocao: true,
  },
  {
    id: 2,
    nome: "Produto 2",
    precoOriginal: "R$ 149,99",
    precoPromocional: "R$ 139,99",
    imagem: "https://via.placeholder.com/300x200?text=Produto+2",
    descricao: "Produto 2 com um ótimo custo-benefício, ideal para o seu dia a dia.",
    promocao: true,
  },
  {
    id: 3,
    nome: "Produto 3",
    precoOriginal: "R$ 79,99",
    precoPromocional: null,
    imagem: "https://via.placeholder.com/300x200?text=Produto+3",
    descricao: "Produto 3, qualidade excelente por um preço justo.",
    promocao: false,
  },
  {
    id: 4,
    nome: "Produto 4",
    precoOriginal: "R$ 120,00",
    precoPromocional: "R$ 100,00",
    imagem: "https://via.placeholder.com/300x200?text=Produto+4",
    descricao: "Produto 4 perfeito para quem procura funcionalidade e estilo.",
    promocao: true,
  },
];

export default async function Produtos() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-semibold text-gray-800 mb-10 text-center">Produtos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="bg-white border rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
          >
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{produto.nome}</h3>
              {produto.promocao && (
                <p className="text-sm text-red-500 mb-2 font-bold">Em promoção!</p>
              )}
              <p className="text-lg text-gray-600 mt-2 mb-4">{produto.descricao}</p>
              <div className="flex justify-center items-center">
                {produto.precoPromocional ? (
                  <>
                    <span className="text-lg font-semibold text-gray-500 line-through mr-2">
                      {produto.precoOriginal}
                    </span>
                    <span className="text-xl font-semibold text-red-600">
                      {produto.precoPromocional}
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-semibold text-gray-800">
                    {produto.precoOriginal}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
