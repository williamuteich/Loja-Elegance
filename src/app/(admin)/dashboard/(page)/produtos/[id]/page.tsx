import Container from "../../components/Container";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default async function EditarProduto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/product?id=${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    return <Container>Produto não encontrado</Container>;
  }

  const produto = await res.json();
  const product = produto.produtos; // Aqui pegamos o produto diretamente

  return (
    <Container>
      <Link href="/dashboard/produtos">
        <button className="flex items-center text-gray-700 hover:text-gray-900">
          <FaArrowLeft size={14} className="mr-2" /> Voltar
        </button>
      </Link>
      
      <h2 className="text-4xl font-semibold mt-8 mb-6 text-gray-900">Editar Produto</h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
          <input 
            type="text" 
            value={product.name} 
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea 
            value={product.description} 
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Preço</label>
          <input 
            type="text" 
            value={`R$ ${product.price.toFixed(2)}`} 
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Imagem Principal</label>
          <img 
            src={product.imagePrimary} 
            alt={product.name} 
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </Container>
  );
}
