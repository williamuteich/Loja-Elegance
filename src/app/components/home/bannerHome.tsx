import Image from "next/image";

export default function BannerHome() {
    return (
        <div className="py-10">
            <div className="w-full h-auto">
                <img className="w-full h-96 object-cover rounded-xl" src="/BannerParcelamento.webp" alt="Banner Home" />
            </div>
        </div>
    );
}
