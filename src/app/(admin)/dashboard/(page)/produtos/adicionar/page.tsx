"use client";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import Container from "../../components/Container";
import Link from "next/link";
import { NumericFormat } from "react-number-format";
import { useState, useEffect } from "react";
import Select from "react-select";

export default function AdicionarProduto() {
  const [marcas, setMarcas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const searchBrand = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/brand`);
        if (!response.ok) {
          alert("Erro ao buscar marcas");
          return;
        }
        const data = await response.json();
        setMarcas(data);
      } catch (error) {
        console.error("Erro ao buscar marcas:", error);
      }
    };

    const searchCategory = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/category`);
        if (!response.ok) {
          alert("Erro ao buscar categorias");
          return;
        }
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    searchBrand();
    searchCategory();
    setIsLoaded(true);
  }, []);

  const handleCategoryChange = (selected: any) => {
    setSelectedCategories(selected);
  };

  if (!isLoaded) {
    return <div>Carregando...</div>;
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();
  
    // Obter os valores dos campos
    const name = event.target.name.value;
    const description = event.target.description.value;
    const price = parseFloat(event.target.price.value.replace("R$", "").replace(".", "").replace(",", "."));
    const brandId = event.target.brand.value;  // Agora estamos pegando o 'id' da marca
    const quantity = parseInt(event.target.stock.value, 10); // Converte para inteiro
    const active = event.target.status.value === true;  
    const categoryIds = selectedCategories ? selectedCategories.map((category) => category.value) : [];


    const response = await fetch("http://localhost:3000/api/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        price,
        brandId,  // Usando 'brandId' ao invés de 'brand'
        categoryIds,  // Usando 'categoryIds' ao invés de 'categories'
        quantity,  // Usando 'quantity' ao invés de 'stock'
        active,  // Usando 'active' ao invés de 'status'
        imageUrl: "",  // Adicionando a imagem (se necessário)
      }),
    });
  
    if (!response.ok) {
      alert("Erro ao adicionar produto");
      return;
    }
  
    alert("Produto adicionado com sucesso");
  };
  

  return (
    <Container>
      <Link href="/dashboard/produtos">
        <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-200">
          <FaArrowLeft size={14} className="mr-2" />
          Voltar
        </Button>
      </Link>

      <h2 className="text-3xl font-semibold mt-5 mb-6 text-gray-900">Adicionar Produto</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Produto</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Digite o nome do produto"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="Digite a descrição do produto"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço</label>
          <NumericFormat
            id="price"
            name="price"
            placeholder="Digite o preço do produto"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
          <Select
            id="category"
            name="selectedCategories"
            isMulti
            options={categorias.map((categoria) => ({
              label: categoria.name,
              value: categoria.id,
            })) as any}
            value={selectedCategories}
            onChange={handleCategoryChange}
            placeholder="Selecione a(s) categoria(s)"
          />
        </div>

        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Marca</label>
          <select
            id="brand"
            name="brand"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione a marca</option>
            {marcas.map((marca) => (
              <option key={marca.id} value={marca.id}>{marca.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Quantidade em Estoque</label>
          <input
            id="stock"
            name="stock"
            type="number"
            placeholder="Digite a quantidade em estoque"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            name="status"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" className="mt-6 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
            Adicionar Produto
          </Button>
        </div>
      </form>
    </Container>
  );
}
