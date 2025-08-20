"use client";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaImage, FaPlus, FaTrash } from "react-icons/fa";
import Container from "../../components/Container";
import Link from "next/link";
import { NumericFormat } from "react-number-format";
import Select from "react-select";
import { useState, useEffect } from "react";
import UploadImage from "@/app/components/upload-Image/uploadImage";
import { uploadImage } from "@/supabase/storage/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createProduct } from "@/app/actions/produto";
import TiptapEditor from "@/app/components/rich-editor/TiptapEditor";

type Variant = {
  name: string;
  hexCode: string;
  quantity: number;
};

export default function AdicionarProduto() {
  const [marcas, setMarcas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [secondaryImages, setSecondaryImages] = useState<File[]>([]);
  const [variants, setVariants] = useState<Variant[]>([{ name: "", hexCode: "#000000", quantity: 0 }]);
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          fetch("/api/privada/brand?fetchAll=true", { next: { tags: ['reloadBrand'] } }),
          fetch("/api/privada/category?fetchAll=true", { next: { tags: ['reloadCategory'] } }),
        ]);
        const [brandsData, categoriesData] = await Promise.all([
          brandsRes.json(),
          categoriesRes.json(),
        ]);
        setMarcas(brandsData.marcas);
        setCategorias(categoriesData.category);
      } catch (error) {
        alert("Erro ao carregar dados");
      }
    }
    fetchData();
  }, []);

  const handleCategoryChange = (selected: any) => setSelectedCategories(selected);
  const handlePrimaryImageSelection = (file: File) => setPrimaryImage(file);
  const handleSecondaryImageSelection = (files: File[]) => setSecondaryImages(files);

  const handleVariantChange = (index: number, field: keyof Variant, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index][field] = value as never;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { name: "", hexCode: "#000000", quantity: 0 }]);
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);

    if (variants.some(v => !v.name || !v.hexCode || v.quantity <= 0)) {
      toast.error("Preencha todos os campos das variantes corretamente");
      setIsLoading(false);
      return;
    }

    const uploadedImageUrls: string[] = [];

    try {
      if (primaryImage) {
        const { imageUrl, error } = await uploadImage({
          file: primaryImage,
          bucket: "elegance",
        });
        if (imageUrl) uploadedImageUrls.push(imageUrl);
      }

      for (const image of secondaryImages) {
        const { imageUrl, error } = await uploadImage({
          file: image,
          bucket: "elegance",
        });
        if (imageUrl) uploadedImageUrls.push(imageUrl);
      }

      // Conversão de preços
      const price = parseFloat(event.target.price.value.replace("$", "").replace(".", "").replace(",", "."));
      const priceOldRaw = event.target.priceOld.value;
      const priceOld = priceOldRaw
        ? parseFloat(priceOldRaw.replace("$", "").replace(".", "").replace(",", "."))
        : null;

      // Validação: se preçoOld existe, ele deve ser maior que o preço atual
      if (priceOld && priceOld <= price) {
        toast.error("O preço anterior deve ser maior que o preço atual.");
        setIsLoading(false);
        return;
      }

      // Definir promoção com base no valor do preço antigo
      const onSale = priceOld && priceOld > price ? true : false;

      // Preparar dados do produto
      const data = {
        name: event.target.name.value,
        description: event.target.description.value,
        features,
        price,
        priceOld,
        brandId: event.target.brand.value,
        categoryIds: selectedCategories.map(c => c.value),
        imagePrimary: uploadedImageUrls[0] || "",
        imagesSecondary: uploadedImageUrls.slice(1),
        active: event.target.status.value === "true",
        destaque: event.target.destaque.value === "true",
        onSale,
        // Dimensões e peso
        width: parseFloat(event.target.width.value) || 11,
        height: parseFloat(event.target.height.value) || 11,
        length: parseFloat(event.target.length.value) || 17,
        weight: parseFloat(event.target.weight.value) || 3,
        variants: variants.map(variant => ({
          name: variant.name,
          hexCode: variant.hexCode,
          quantity: variant.quantity
        }))
      };

      const result = await createProduct(data);

      if (result?.success) {
        toast.success(result.success);
        setTimeout(() => {
          window.location.href = "/dashboard/produtos";
        }, 2000);
      } else if (result?.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao adicionar produto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <ToastContainer />
      <div className=" mx-auto px-4">
        <Link href="/dashboard/produtos">
          <Button variant="outline" className="mb-6 gap-2">
            <FaArrowLeft size={14} /> Voltar
          </Button>
        </Link>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">Adicionar Novo Produto</h2>

        <div className="space-y-8 mb-10">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Imagens do Produto</h3>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagem Principal</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                {primaryImage ? (
                  <div className="relative group">
                    <img
                      src={URL.createObjectURL(primaryImage)}
                      alt="Imagem principal"
                      className="w-full h-64 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ) : (
                  <UploadImage
                    onImagesSelected={(files) => handlePrimaryImageSelection(files[0])}
                    limit={1}
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagens Secundárias</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                <UploadImage
                  onImagesSelected={handleSecondaryImageSelection}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 mb-10">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Variantes de Cor e Estoque</h3>
              <Button
                type="button"
                onClick={addVariant}
                className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 gap-2"
              >
                <FaPlus /> Adicionar Variante
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {variants.map((variant, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-gray-700">Variante #{index + 1}</span>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FaTrash size={16} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Nome da Cor</label>
                      <input
                        value={variant.name}
                        onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Cor</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={variant.hexCode}
                          onChange={(e) => handleVariantChange(index, 'hexCode', e.target.value)}
                          className="w-12 h-12 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={variant.hexCode}
                          onChange={(e) => handleVariantChange(index, 'hexCode', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Quantidade em Estoque</label>
                      <input
                        type="number"
                        value={variant.quantity}
                        onChange={(e) => handleVariantChange(index, 'quantity', parseInt(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulário de Detalhes */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-8">Informações do Produto</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nome do Produto</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                <select
                  id="brand"
                  name="brand"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione a marca</option>
                  {marcas.map(marca => (
                    <option key={marca.id} value={marca.id}>{marca.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Preço Atual</label>
                <NumericFormat
                  id="price"
                  name="price"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="$ "
                  decimalScale={2}
                />
              </div>

              <div>
                <label htmlFor="priceOld" className="block text-sm font-medium text-gray-700 mb-2">Preço Anterior</label>
                <NumericFormat
                  id="priceOld"
                  name="priceOld"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="$ "
                  decimalScale={2}
                />
              </div>

              {/* Dimensões e Peso */}
              <div className="md:col-span-2">
                <h4 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Dimensões e Peso (para cálculo de frete)</h4>
              </div>

              <div>
                <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-2">Largura (cm)</label>
                <input
                  id="width"
                  name="width"
                  type="number"
                  step="0.1"
                  min="0"
                  defaultValue="11"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="11"
                />
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
                <input
                  id="height"
                  name="height"
                  type="number"
                  step="0.1"
                  min="0"
                  defaultValue="11"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="11"
                />
              </div>

              <div>
                <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-2">Comprimento (cm)</label>
                <input
                  id="length"
                  name="length"
                  type="number"
                  step="0.1"
                  min="0"
                  defaultValue="17"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="17"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  defaultValue="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="3"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Categorias</label>
                <Select
                  instanceId="category-select"
                  inputId="category-select-input"
                  isMulti
                  options={categorias.map(c => ({ label: c.name, value: c.id }))}
                  onChange={handleCategoryChange}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Selecione as categorias..."
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <TiptapEditor value={description} onChange={setDescription} placeholder="Digite a descrição..." />
                {/* Hidden input to keep traditional form submission working */}
                <input type="hidden" name="description" value={description} />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">Características</label>
                <TiptapEditor value={features} onChange={setFeatures} placeholder="Digite as características..." />
                <input type="hidden" name="features" value={features} />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  id="status"
                  name="status"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  defaultValue="true"
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>

              <div>
                <label htmlFor="destaque" className="block text-sm font-medium text-gray-700 mb-2">Destaque</label>
                <select
                  id="destaque"
                  name="destaque"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  defaultValue="false"
                >
                  <option value="false">Não</option>
                  <option value="true">Sim</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg text-white gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaPlus /> Cadastrar Produto
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}
