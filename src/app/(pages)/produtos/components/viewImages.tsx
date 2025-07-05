"use client"
import Image from "next/image"
import { useState } from "react"
import { FaShoppingBag } from "react-icons/fa"

export default function ViewImages({ produtos }: { produtos: any }) {
    const [image, setImage] = useState(produtos.imagePrimary)
    const [loading, setLoading] = useState(true)

    const handleImageLoad = () => {
        setLoading(false)
    }

    const imagesToDisplay = [produtos.imagePrimary, ...produtos.imagesSecondary]

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-4 lg:items-start items-center mb-6 lg:mb-0 w-full">
            <div className="flex flex-nowrap lg:flex-col gap-2 items-center overflow-x-auto lg:overflow-visible w-full max-w-full">
                {imagesToDisplay?.map((img: string, index: number) => (
                    <div
                        key={index}
                        className="h-[100px] w-[100px] lg:h-[125px] lg:w-[125px] max-w-[140px] max-h-[140px] rounded cursor-pointer hover:scale-105 transition-all flex items-center justify-center border border-gray-200 flex-shrink-0"
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

            <div className="flex-1 w-full flex justify-center items-start px-2">
                <div className="relative w-full max-w-[300px] md:max-w-[350px] lg:max-w-[450px] aspect-square bg-white rounded-lg min-h-[280px] overflow-hidden">
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
                            sizes="(max-width: 768px) 350px, (max-width: 1024px) 350px, 500px"
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
