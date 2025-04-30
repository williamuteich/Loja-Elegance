"use client";
import { listImages } from "@/supabase/storage/client";
import { deleteImage } from "@/supabase/storage/client";
import { SupabaseImgList } from "@/utils/types/listImages";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Container from "../components/Container";

export default function Galeria() {
    const [images, setImages] = useState<SupabaseImgList>([]);
    const [loadingImages, setLoadingImages] = useState<boolean>(true);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

    useEffect(() => {
        async function fetchImages() {
            setLoadingImages(true);
            try {
                const data: SupabaseImgList = await listImages("elegance");
                setImages(data);
            } catch (error) {
                console.error("Erro ao buscar as imagens:", error);
            } finally {
                setLoadingImages(false);
            }
        }

        fetchImages();
    }, []);

    const handleSelectImage = (imageName: string) => {
        setSelectedImages((prevSelectedImages) => {
            const newSelectedImages = new Set(prevSelectedImages);
            if (newSelectedImages.has(imageName)) {
                newSelectedImages.delete(imageName);
            } else {
                newSelectedImages.add(imageName);
            }
            return newSelectedImages;
        });
    };

    const handleDeleteSelectedImages = async () => {
        setLoadingDelete(true);
        const imagesToDelete = Array.from(selectedImages);
        if (imagesToDelete.length === 0) {
            toast.error("Selecione pelo menos uma imagem para excluir.", {
                position: "top-center",
                autoClose: 3000,
            });
            setLoadingDelete(false);
            return;
        }

        try {
            for (const imageName of imagesToDelete) {
                const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/elegance/${imageName}`;
                const { error } = await deleteImage(imageUrl);
                if (error) {
                    console.error("Erro ao excluir a imagem:", error);
                }
            }

            setSelectedImages(new Set());
            setImages(images.filter((img) => !imagesToDelete.includes(img.name)));
            toast.success("Imagens excluídas com sucesso.", {
                position: "top-center",
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Erro ao excluir as imagens:", error);
            toast.error("Erro ao excluir as imagens.", {
                position: "top-center",
                autoClose: 3000,
            });
        } finally {
            setLoadingDelete(false);
        }
    };

    if (images.length === 0 && !loadingImages) {
        return (
            <Container>
                <h2 className="text-3xl font-semibold mb-3 text-gray-800">Galeria de Imagens</h2>
                <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
                    Gerencie suas imagens: selecione para excluir ou visualize. Você pode excluir imagens conforme necessário.
                </p>

                <p className="font-medium text-lg">Nenhuma Imagem Encontrada</p>
            </Container>
        )
    }

    return (
        <Container>
            <ToastContainer />
            <h2 className="text-3xl font-semibold mb-3 text-gray-800">Galeria de Imagens</h2>
            <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
                Gerencie suas imagens: selecione para excluir ou visualize. Você pode excluir imagens conforme necessário.
            </p>

            {loadingImages ? (
                <div className="text-center">Carregando imagens...</div>
            ) : (
                <div className="grid max-h-[75vh] overflow-y-auto grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className="relative p-2 bg-gray-200 rounded-md cursor-pointer"
                            onClick={() => handleSelectImage(img.name)}
                        >
                            <Image
                                className="object-cover w-full h-full rounded-md"
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/elegance/${img.name}`}
                                priority
                                width={300}
                                height={300}
                                quality={100}
                                alt={img.name}
                            />

                            {selectedImages.has(img.name) && (
                                <div className="absolute inset-0 bg-black opacity-50 rounded-md flex justify-center items-center">
                                    <span className="text-white">Selecionada</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {images.length > 0 && (
                <div className="mt-4">
                    <Button
                        className="bg-red-700 text-white hover:bg-red-600"
                        variant="destructive"
                        onClick={handleDeleteSelectedImages}
                        disabled={selectedImages.size === 0 || loadingDelete}
                    >
                        {loadingDelete ? "Excluindo..." : "Excluir imagens"}
                    </Button>
                </div>
            )}
        </Container>
    );
}
