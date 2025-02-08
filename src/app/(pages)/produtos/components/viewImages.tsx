"use client"
import Image from "next/image";
import { useState } from "react";

export default function ViewImages({ produtos }: { produtos: any }) {
    const [image, setImage] = useState(produtos.imagePrimary);
    const [loading, setLoading] = useState(true);

    const handleImageLoad = () => {
        setLoading(false);
    };

    const imagesToDisplay = [produtos.imagePrimary, ...produtos.imagesSecondary];

    return (
        <>
            <div className="flex gap-4 flex-col-reverse items-center flex-wrap lg:items-start lg:flex-row lg:mb-0 mb-6 ">
                <div className="flex lg:flex-col space-y-2 items-center overflow-x-auto gap-2">
                    {imagesToDisplay?.map((img: string, index: number) => (
                        <Image
                            key={index}
                            src={img}
                            width={120}
                            height={120}
                            quality={100}
                            priority={false}
                            alt={`Imagem ${index + 1}`}
                            className="bg-gray-100 hover:scale-105 transition-all object-cover border border-gray-200 rounded cursor-pointer "
                            onClick={() => setImage(img)}
                        />
                    ))}
                </div>

                <div className="flex-1 px-2 flex justify-center items-start lg:mb-0">
                    <div className="bg-gray-100 w-full flex justify-center" style={{ borderRadius: "5px" }}>

                        {loading && <div className="w-32 h-32 bg-gray-300 animate-pulse rounded-lg"></div>}

                        <Image
                            src={image}
                            alt={`${produtos.name}`}
                            width={600}
                            height={600}
                            priority
                            quality={100}
                            className="rounded-lg cursor-pointer object-cover min-w-40"
                            onLoad={handleImageLoad}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
