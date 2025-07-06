"use client"
import Image from "next/image"
import { useState } from "react"
import { FaShoppingBag } from "react-icons/fa"

export default function ViewImages({ produtos }: { produtos: any }) {
    const [image, setImage] = useState(produtos.imagePrimary)
    const [loading, setLoading] = useState(true)

    const handleImageLoad = () => setLoading(false)

    const imagesToDisplay = [produtos.imagePrimary, ...produtos.imagesSecondary]

    return (
        <div className="flex flex-col-reverse lg:flex-col xl:flex-row gap-4 items-center xl:items-start w-full">
            {/* Miniaturas */}
            <div className="flex flex-nowrap lg:flex-row xl:flex-col gap-2 items-center justify-center overflow-x-auto xl:overflow-x-hidden overflow-y-hidden xl:overflow-y-auto w-full xl:w-auto xl:max-h-[500px] custom-scrollbar mb-4 lg:mb-0 px-1">
                {imagesToDisplay?.map((img: string, index: number) => (
                    <div
                        key={index}
                        className="h-[90px] w-[90px] lg:h-[100px] lg:w-[100px] xl:h-[125px] xl:w-[125px] rounded cursor-pointer hover:scale-105 transition-all flex items-center justify-center border border-gray-200 flex-shrink-0"
                        onClick={() => setImage(img)}
                    >
                        {img ? (
                            <Image
                                src={img}
                                width={200}
                                height={200}
                                quality={100}
                                priority={false}
                                alt={`Imagem ${index + 1}`}
                                className="object-contain rounded max-w-full max-h-full"
                            />
                        ) : (
                            <FaShoppingBag className="text-gray-400" size={40} />
                        )}
                    </div>
                ))}
            </div>

            {/* Imagem principal */}
            <div className="flex-1 w-full flex justify-center items-start px-2">
                <div className="relative w-full max-w-[300px] md:max-w-[350px] xl:max-w-[450px] aspect-square bg-white rounded-lg min-h-[280px] overflow-hidden">
                    {loading && (
                        <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-lg" />
                    )}
                    {image ? (
                        <Image
                            src={image}
                            alt={`${produtos.name}`}
                            fill
                            priority
                            quality={100}
                            sizes="(max-width: 768px) 350px, (max-width: 1024px) 450px, 500px"
                            className="object-contain rounded-lg"
                            onLoad={handleImageLoad}
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full">
                            <FaShoppingBag className="text-gray-400" size={100} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
