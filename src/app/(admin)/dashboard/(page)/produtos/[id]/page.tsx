"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaImage } from "react-icons/fa";
import Container from "../../components/Container";
import Link from "next/link";
import { NumericFormat } from "react-number-format";
import Select from "react-select";
import { uploadImage } from "@/supabase/storage/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UploadImage from "@/app/components/upload-Image/uploadImage";
import Image from "next/image";

export default function EditarProduto({ params }: { params: Promise<{ id: string }> }) {

  const [produto, setProduto] = useState<any>(null);
  const [marcas, setMarcas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [secondaryImages, setSecondaryImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    const { id } = await params;

    const productRes = await fetch(`/api/product?id=${id}`);
    if (!productRes.ok) {
      toast.error("Produto não encontrado");
      return;
    }

    const productData = await productRes.json();
    setProduto(productData.produtos);

    const [brandsRes, categoriesRes] = await Promise.all([
      fetch("/api/brand"),
      fetch("/api/category"),
    ]);
    const [brandsData, categoriesData] = await Promise.all([
      brandsRes.json(),
      categoriesRes.json(),
    ]);
    setMarcas(brandsData.marcas);
    setCategorias(categoriesData.category);
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const handleCategoryChange = (selected: any) => setSelectedCategories(selected);
  const handlePrimaryImageSelection = (file: File) => setPrimaryImage(file);
  const handleSecondaryImageSelection = (files: File[]) => setSecondaryImages(files);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);

    const uploadedImageUrls: string[] = [];

    if (primaryImage) {
      const { imageUrl: uploadedPrimaryImageUrl, error } = await uploadImage({
        file: primaryImage,
        bucket: "elegance_image",
      });
      if (!error) uploadedImageUrls.push(uploadedPrimaryImageUrl);
    } else if (produto.imagePrimary) {
      // Se não trocar a imagem, mantém a imagem atual
      uploadedImageUrls.push(produto.imagePrimary);
    }

    for (const image of secondaryImages) {
      const { imageUrl: uploadedImageUrl, error } = await uploadImage({
        file: image,
        bucket: "elegance_image",
      });
      if (!error) uploadedImageUrls.push(uploadedImageUrl);
    }
    
    // Manter as imagens secundárias existentes, adicionando as novas
    const allSecondaryImages = [...produto.imagesSecondary, ...uploadedImageUrls];
    

    console.log("uploadedImageUrls", uploadedImageUrls);
    const name = event.target.name.value;
    const description = event.target.description.value;
    const features = event.target.features.value;
    const price = parseFloat(event.target.price.value.replace("R$", "").replace(".", "").replace(",", "."));
    const priceOld = parseFloat(event.target.priceOld.value.replace("R$", "").replace(".", "").replace(",", "."));
    const brandId = event.target.brand.value;
    const quantity = parseInt(event.target.stock.value, 10);
    const active = event.target.status.value === "true";
    const onSale = event.target.onSale.value === "true";
    const categoryIds = selectedCategories.map((category: any) => category.value);

    console.log("está mandando as imagens", uploadedImageUrls)
    try {
      const response = await fetch("/api/product", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: produto.id,
          name,
          description,
          priceOld,
          price,
          onSale,
          features,
          active,
          brandId,
          categoryIds,
          quantity,
          uploadedImageUrls,
          imagesSecondary: allSecondaryImages,  
        }),
      });

      if (!response.ok) {
        toast.error("Erro ao editar produto", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.success("Produto editado com sucesso!", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Erro ao editar produto", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!produto) return <Container>Produto não encontrado</Container>;

  const imagePrimaryUrl = produto?.imagePrimary || '';
  const imagesSecondaryUrls = produto?.imagesSecondary || [];

  return (
    <Container>
      <ToastContainer />
      <Link href="/dashboard/produtos">
        <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-200 flex items-center">
          <FaArrowLeft size={14} className="mr-2" /> Voltar
        </Button>
      </Link>
      <h2 className="text-4xl font-semibold mt-8 mb-6 text-gray-900">Editar Produto</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2 w-1/6">
          <label htmlFor="primaryImage" className="block text-lg font-medium text-gray-700">
            Imagem Principal
          </label>
          <div>
            {primaryImage || imagePrimaryUrl ? (
              <div className="flex flex-col items-center">
                <Image
                  src={primaryImage ? URL.createObjectURL(primaryImage) : imagePrimaryUrl}
                  alt="Imagem do Produto"
                  width={400}
                  height={400}
                  priority
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPrimaryImage(null);
                    setProduto((prevProduto: any) => ({
                      ...prevProduto,
                      imagePrimary: '',
                    }));
                  }}
                  className="w-full px-4 py-2 bg-red-700 text-white rounded-lg"
                >
                  Remover Imagem
                </button>
              </div>
            ) : (
              <div className="p-4 bg-gray-200 flex items-center justify-center rounded-lg">
                <FaImage className="text-gray-500" size={110} />
              </div>
            )}

            {!primaryImage && !imagePrimaryUrl && (
              <UploadImage onImagesSelected={(files) => handlePrimaryImageSelection(files[0])} limit={1} />
            )}
          </div>
        </div>


        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Produto</label>
            <input id="name" name="name" type="text" defaultValue={produto.name} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço</label>
            <NumericFormat id="price" name="price" defaultValue={produto.price} placeholder="Digite o preço do produto" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" thousandSeparator="." decimalSeparator="," prefix="R$ " decimalScale={2} fixedDecimalScale />
          </div>

          <div className="space-y-2">
            <label htmlFor="priceOld" className="block text-sm font-medium text-gray-700">Preço Antigo</label>
            <NumericFormat id="priceOld" name="priceOld" defaultValue={produto.priceOld} placeholder="Digite o preço anterior" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" thousandSeparator="." decimalSeparator="," prefix="R$ " decimalScale={2} fixedDecimalScale />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Categoria
            </label>
            <Select
              id="category"
              name="category"
              isMulti
              options={categorias.map((categoria) => ({ label: categoria.name, value: categoria.id }))}
              value={selectedCategories.length > 0 ? selectedCategories : produto?.categories?.map((category: any) => ({
                label: category.category.name,
                value: category.categoryId,
              })) || []}
              onChange={handleCategoryChange}
              placeholder="Selecione a(s) categoria(s)"
              className="react-select-container"
              instanceId="category-select"
              aria-labelledby="category" 
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Marca</label>
            <select
              id="brand"
              name="brand"
              value={produto?.brand?.id || ""}
              onChange={(e) => setProduto({ ...produto, brand: { id: e.target.value } })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione a marca</option>
              {marcas.map((marca) => (
                <option key={marca.id} value={marca.id}>{marca.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Quantidade em Estoque</label>
            <input
              id="stock"
              name="stock"
              type="number"
              value={produto?.stock?.quantity || 0}
              onChange={(e) => setProduto({ ...produto, stock: { quantity: Number(e.target.value) } })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select id="status" name="status" defaultValue={produto.active ? "true" : "false"} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="onSale" className="block text-sm font-medium text-gray-700">Em Promoção</label>
            <select id="onSale" name="onSale" defaultValue={produto.onSale ? "true" : "false"} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <UploadImage onImagesSelected={handleSecondaryImageSelection} />
        </div>

        <div>
          {imagesSecondaryUrls && imagesSecondaryUrls.length > 0 && (
            <div className="flex gap-4 items-end">
              {imagesSecondaryUrls.map((url: string, index: number) => (
                <div key={index} className="flex flex-col items-center">
                  <Image
                    src={url}
                    alt={`Imagem Secundária ${index + 1}`}
                    width={100}
                    height={100}
                    priority={false}
                    className="object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updatedImages = imagesSecondaryUrls.filter((_: any, i: number) => i !== index);
                      setSecondaryImages(updatedImages);
                      const updatedProduct = { ...produto };
                      updatedProduct.imagesSecondary = updatedImages;
                      setProduto(updatedProduct);
                    }}
                    className="mt-1 w-full px-4 py-1 bg-red-700 text-white rounded-lg"
                  >
                    Remover Imagem
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea id="description" name="description" defaultValue={produto.description} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={6}></textarea>
          </div>

          <div className="space-y-2">
            <label htmlFor="features" className="block text-sm font-medium text-gray-700">Características</label>
            <textarea id="features" name="features" defaultValue={produto.features} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={6}></textarea>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500" disabled={isLoading}>
            {isLoading ? (
              <svg className="animate-spin w-5 h-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z" />
              </svg>
            ) : (
              "Editar Produto"
            )}
          </Button>
        </div>
      </form>
    </Container>
  );
}
