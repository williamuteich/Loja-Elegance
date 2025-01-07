"use client";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaWhatsapp, FaTelegram } from "react-icons/fa";
import { usePathname } from "next/navigation";

interface dadosContatoProps {
  config: {
    id: string;
    name: string;
    type: string;
    url: string;
    value: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export default function Header({ data }: { data: dadosContatoProps }) {
  const rotaUrl = usePathname();
  const resUrl = rotaUrl.includes("/dashboard");

  if (resUrl) {
    return null;
  }

  const redesSociais = data.config.filter(item => item.type === 'redeSocial' && (item.url || item.value));

  return (
    <header className="w-full z-50">
      <div className="bg-gray-800 text-white py-2">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex space-x-6">
            {redesSociais.map(social => (
              (social.url || social.value) && (
                <Link href={social.url || social.value} key={social.id} target="_blank">
                  {social.name.toLowerCase() === 'facebook' && <FaFacebookF className="h-6 w-6" />}
                  {social.name.toLowerCase() === 'instagram' && <FaInstagram className="h-6 w-6" />}
                  {social.name.toLowerCase() === 'twitter' && <FaTwitter className="h-6 w-6" />}
                  {social.name.toLowerCase() === 'linkedin' && <FaLinkedinIn className="h-6 w-6" />}
                  {social.name.toLowerCase() === 'whatsapp' && <FaWhatsapp className="h-6 w-6" />}
                  {social.name.toLowerCase() === 'telegram' && <FaTelegram className="h-6 w-6" />}
                </Link>
              )
            ))}
          </div>
          <div>
            <span>Seja bem-vindo(a)</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 text-white shadow-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-blue-400">
                Ecommerce
              </Link>
            </div>

            <div className="flex items-center space-x-6 ml-auto">
              <Link href="/sobre" className="hover:text-blue-400">
                Sobre
              </Link>
              <Link href="/contato" className="hover:text-blue-400">
                Contato
              </Link>
              <Link href="/faq" className="hover:text-blue-400">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
