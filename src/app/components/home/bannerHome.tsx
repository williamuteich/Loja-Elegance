import Image from "next/image";

export default function BannerHome() {
    return (
        <div className="relative py-20 bg-gradient-to-r from-pink-600 to-pink-400 rounded-xl overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image
                    className="w-full h-full object-cover opacity-30"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={50}
                    priority={false}
                    fill
                    src="/novaImageDeFundo.jpg"
                    alt="Banner Home"
                />
            </div>
            <div className="absolute inset-0 z-[10] flex flex-col items-center justify-center text-center text-white px-6 md:px-12">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
                    Transforme seu estilo. Encontre o que foi feito para você.
                </h1>
                <p className="text-base sm:text-lg lg:text-xl font-medium">
                    Descubra as últimas tendências e produtos exclusivos para uma nova visão da sua essência.
                </p>
            </div>
        </div>
    );
}
