import { Produto } from "@/utils/types/produto";
import { FaWhatsapp } from 'react-icons/fa';

interface VendaWhatsappProps {
    produto: Produto;
}

export default async function VendaWhatsapp({ produto }: VendaWhatsappProps) {
    const availableStock = Array.isArray(produto.variants)
        ? produto.variants.reduce((acc: number, v: any) => acc + ((v.availableStock ?? v.stock?.quantity) || 0), 0)
        : 0;
    const isAvailable = produto.active && availableStock > 0;

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/publica/setup`, { cache: "force-cache", next: { tags: ["loadingSetup"] } });

    if (!response.ok) {
        return null; 
    }

    const { config } = await response.json();
    const whatsappConfig = config.find((item: { name: string }) => item.name === "whatsapp");

    if (!whatsappConfig || !whatsappConfig.value) {
        return null;  
    }

    const whatsappNumber = `55${whatsappConfig.value}`; // Ajustado para Brasil

    const price = produto.price;
    const formattedPrice = (price && !isNaN(price))
        ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
        : "Preço não disponível";

    const message = encodeURIComponent(
        `Olá! Gostaria de comprar o seguinte produto:\n\n` +
        `Produto: ${produto.name}\n` +
        `Preço: ${formattedPrice}\n\n` +
        `Por favor, me envie as instruções para pagamento.`
    );

    const variantLink = isAvailable ? `https://wa.me/${whatsappNumber}?text=${message}` : "#";

    return isAvailable ? (
        <a
            href={variantLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex py-3 text-sm px-4 rounded-lg bg-green-500 text-white font-semibold items-center justify-center gap-2 transition-colors duration-300 hover:bg-green-600"
        >
            <FaWhatsapp size={22} />
            <span>Faça sua compra pelo WhatsApp</span>
        </a>
    ) : (
        <button
            disabled
            className="mt-1 w-full rounded-[4px] flex py-3 text-sm px-4 bg-gray-600 text-white font-semibold items-center justify-center gap-2 transition-colors duration-300 cursor-not-allowed"
        >
            <FaWhatsapp size={22} />
            <span>Indisponível</span>
        </button>
    );
}
