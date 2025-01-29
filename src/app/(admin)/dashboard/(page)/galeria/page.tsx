"use client"
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Criando o cliente do Supabase usando as variáveis de ambiente
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Galeria() {
    const [images, setImages] = useState<(string | null)[]>([]);

    const fetchImages = async () => {
        const { data, error } = await supabase
            .storage
            .from('elegance_image')
            .list('');

        if (error) {
            console.error('Erro ao buscar as imagens:', error);
        } else {
            const imageUrls = data.map((file) => {
                if (file.name) {
                    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/elegance_image/${file.name}`;
                } else {
                    console.error('Imagem sem nome encontrado:', file);
                    return null;
                }
            });

            setImages(imageUrls);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Galeria de Imagens</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {images.length > 0 ? (
                    images.map((url, index) => (
                        <div
                            key={index}
                            className="relative overflow-hidden rounded-lg shadow-xl transition-all transform hover:scale-105"
                        >
                            {url ? (
                                <img
                                    src={url}
                                    alt={`Imagem ${index + 1}`}
                                    className="w-full h-80 object-cover rounded-lg transition-transform duration-300 ease-in-out"
                                />
                            ) : (
                                <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-500">Imagem não disponível</span>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500">
                        <p className="animate-pulse">Carregando imagens...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
