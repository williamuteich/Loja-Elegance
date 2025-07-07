"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import Container from "../../components/Container";
import Link from "next/link";
import { NumericFormat } from "react-number-format";
import Select from "react-select";
import { uploadImage } from "@/supabase/storage/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UploadImage from "@/app/components/upload-Image/uploadImage";
import Image from "next/image";
import { updateProduct } from "@/app/actions/produtoEdit";
import TiptapEditor from "@/app/components/rich-editor/TiptapEditor";

type Variant = {
    name: string;
    hexCode: string;
    quantity: number;
};
export default function EditarProduto({ id }: { id: string }) {
    const [produto, setProduto] = useState<any>(null);
    const [marcas, setMarcas] = useState<any[]>([]);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
    const [primaryImage, setPrimaryImage] = useState<File | null>(null);
    const [secondaryImages, setSecondaryImages] = useState<File[]>([]);
    const [variants, setVariants] = useState<Variant[]>([]);
    const [description, setDescription] = useState("");
    const [features, setFeatures] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const productRes = await fetch(`/api/privada/product?id=${id}`);
            if (!productRes.ok) {
                toast.error("Produto não encontrado");
                return;
            }

            const productData = await productRes.json();
            setProduto(productData.produtos);
            setDescription(productData.produtos.description || "");
            setFeatures(productData.produtos.features || "");

            const formattedVariants = productData.produtos.variants.map((v: any) => ({
                name: v.color.name,
                hexCode: v.color.hexCode,
                quantity: v.availableStock
            }));
            setVariants(formattedVariants);

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

            const formattedCategories = productData.produtos.categories.map((c: any) => ({
                label: c.category.name,
                value: c.category.id
            }));
            setSelectedCategories(formattedCategories);
        } catch (error) {
            toast.error("Erro ao carregar dados do produto");
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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

    const handleRemoveSecondaryImage = (url: string) => {
        if (!produto) return;

        const updatedImages = produto.imagesSecondary.filter((img: string) => img !== url);
        setProduto((prevProduto: any) => ({
            ...prevProduto,
            imagesSecondary: updatedImages,
        }));
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setIsLoading(true);

        if (!produto) {
            toast.error("Produto não carregado");
            setIsLoading(false);
            return;
        }

        if (variants.some(v => !v.name || !v.hexCode || v.quantity < 0)) {
            toast.error("Preencha todos os campos das variantes corretamente");
            setIsLoading(false);
            return;
        }

        let uploadedPrimaryImageUrl = produto.imagePrimary;
        const newSecondaryImages = [...produto.imagesSecondary];

        try {
            // Upload de nova imagem primária se existir
            if (primaryImage) {
                const { imageUrl, error } = await uploadImage({
                    file: primaryImage,
                    bucket: "elegance",
                });
                if (!error) uploadedPrimaryImageUrl = imageUrl;
            }

            // Upload de novas imagens secundárias
            for (const image of secondaryImages) {
                const { imageUrl, error } = await uploadImage({
                    file: image,
                    bucket: "elegance",
                });
                if (!error) newSecondaryImages.push(imageUrl);
            }

            // Construir objeto de dados no formato esperado pela API
            const data = {
                id: produto.id,
                name: event.target.name.value,
                description,
                features,
                price: parseFloat(
                    event.target.price.value
                        .replace("$", "")
                        .replace(/\./g, "")
                        .replace(",", ".")
                ),
                priceOld: event.target.priceOld.value
                    ? parseFloat(
                        event.target.priceOld.value
                            .replace("$", "")
                            .replace(/\./g, "")
                            .replace(",", ".")
                    )
                    : null,
                brandId: event.target.brand.value,
                categoryIds: selectedCategories.map(c => c.value),
                imagePrimary: uploadedPrimaryImageUrl,
                imagesSecondary: newSecondaryImages,
                active: event.target.status.value === "true",
                onSale: event.target.onSale.value === "true",
                destaque: event.target.destaque.value === "true",
                variants: variants.map(variant => ({
                    name: variant.name,
                    hexCode: variant.hexCode,
                    quantity: variant.quantity
                }))
            };

            // Chamar a Server Action de atualização
            const result = await updateProduct(data);

            if (result?.success) {
                toast.success(result.success, { position: "top-center", autoClose: 3000 });
                // Recarregar os dados do produto após atualização
                fetchData();
            } else if (result?.error) {
                toast.error(result.error, { position: "top-center", autoClose: 3000 });
            }
        } catch (error) {
            toast.error("Erro ao atualizar produto", { position: "top-center", autoClose: 3000 });
        } finally {
            setIsLoading(false);
        }
    };

    if (!produto) {
        return (
            <Container>
                <div className="text-center py-8">
                    <p>Carregando...</p>
                </div>
            </Container>
        );
    }

    const imagePrimaryUrl = produto?.imagePrimary || '';
    const imagesSecondaryUrls = produto?.imagesSecondary || [];

    return (
        <Container>
            <ToastContainer position="top-center" autoClose={3000} />
            <div className="mx-auto px-4">
                <Link href="/dashboard/produtos">
                    <Button variant="outline" className="mb-6 gap-2">
                        <FaArrowLeft size={14} /> Voltar
                    </Button>
                </Link>

                <h2 className="text-3xl font-bold text-gray-900 mb-8">Editar Produto</h2>

                <div className="space-y-8 mb-10">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Imagens do Produto</h3>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Imagem Principal</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                                {primaryImage || imagePrimaryUrl ? (
                                    <div className="relative group">
                                        <Image
                                            src={primaryImage ? URL.createObjectURL(primaryImage) : imagePrimaryUrl}
                                            alt="Imagem principal"
                                            width={300}
                                            height={300}
                                            className="w-full h-64 object-contain rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPrimaryImage(null);
                                                setProduto((prev: any) => ({ ...prev, imagePrimary: '' }));
                                            }}
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
                                <UploadImage onImagesSelected={handleSecondaryImageSelection} />
                                {imagesSecondaryUrls.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-1 mt-4">
                                        {imagesSecondaryUrls.map((url: string, index: number) => (
                                            <div key={index} className="relative border rounded-lg p-2 bg-white shadow-sm">
                                                <Image
                                                    src={url}
                                                    alt={`Imagem Secundária ${index + 1}`}
                                                    width={200}
                                                    height={200}
                                                    className="object-contain w-full h-auto mx-auto rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSecondaryImage(url)}
                                                    className="mt-2 w-full px-3 py-1 bg-red-700 text-white rounded"
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                    defaultValue={produto.name}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                                <select
                                    id="brand"
                                    name="brand"
                                    value={produto?.brandId || ""}
                                    onChange={(e) =>
                                        setProduto((prev: any) => ({ ...prev, brandId: e.target.value }))
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Selecione a marca</option>
                                    {marcas.map((marca) => (
                                        <option key={marca.id} value={marca.id}>
                                            {marca.name}
                                        </option>
                                    ))}
                                </select>

                            </div>
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Preço Atual</label>
                                <NumericFormat
                                    id="price"
                                    name="price"
                                    defaultValue={produto.price}
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
                                    defaultValue={produto.priceOld}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    prefix="$ "
                                    decimalScale={2}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Categorias</label>
                                <Select
                                    isMulti
                                    options={categorias.map(c => ({ label: c.name, value: c.id }))}
                                    value={selectedCategories}
                                    onChange={handleCategoryChange}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                                <TiptapEditor value={description} onChange={setDescription} placeholder="Digite a descrição..." />
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
                                    defaultValue={produto.active ? "true" : "false"}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                                    defaultValue={produto.destaque ? "true" : "false"}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="false">Não</option>
                                    <option value="true">Sim</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="onSale" className="block text-sm font-medium text-gray-700 mb-2">Promoção</label>
                                <select
                                    id="onSale"
                                    name="onSale"
                                    defaultValue={produto.onSale ? "true" : "false"}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                                "Atualizar Produto"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </Container>
    );
}