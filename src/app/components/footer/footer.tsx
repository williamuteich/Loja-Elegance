"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaLinkedinIn,
  FaTelegramPlane,
  FaQrcode,
  FaCreditCard,
} from "react-icons/fa";
import { useSession } from "next-auth/react";
import { LogoutMenu } from "../logoutAccount";
import { useEffect, useState } from "react";

export default function Footer() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [socialMedia, setSocialMedia] = useState<
    { name: string; url: string; type: string; active: boolean }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/publica/setup`, {
          next: { tags: ["loadingSetup"], revalidate: 18000 },
        });
        if (!response.ok) throw new Error("Erro ao carregar as configurações.");

        const { config } = await response.json();
        if (config) {
          const filteredSocialMedia = config.filter(
            (item: { type: string; active: boolean }) => item.type === "social"
          );
          setSocialMedia(filteredSocialMedia);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  const socialIcons = {
    whatsapp: { icon: FaWhatsapp, color: "text-green-500" },
    facebook: { icon: FaFacebookF, color: "text-blue-600" },
    instagram: { icon: FaInstagram, color: "text-pink-600" },
    tiktok: { icon: FaTiktok, color: "text-white" },
    youtube: { icon: FaYoutube, color: "text-red-600" },
    telegram: { icon: FaTelegramPlane, color: "text-blue-400" },
    linkedin: { icon: FaLinkedinIn, color: "text-blue-700" },
  };

  const whatsapp = socialMedia.find(({ name }) => name === "whatsapp");

  return (
    <footer className="bg-black text-white py-10 relative mb-20 md:mb-0">
      {whatsapp && (
        <div className="fixed bottom-6 right-6 xl:right-12 z-50">
          <Link
            href={whatsapp.url}
            target="_blank"
            aria-label="Fale conosco pelo WhatsApp"
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all border border-green-500"
          >
            <FaWhatsapp className="w-6 h-6 text-green-600" />
            <span className="text-sm text-green-700 font-medium">Precisa de ajuda?</span>
          </Link>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div>
          <div className="max-[400px]:flex max-[400px]:flex-col max-[400px]:items-center max-[400px]:text-center">
            <h2 className="font-bold text-3xl mb-3">Elegance</h2>
            <div className="flex gap-1 mb-6 max-[400px]:justify-center">
              {socialMedia.map(({ name, url }) => {
                const social = socialIcons[name as keyof typeof socialIcons];
                return social ? (
                  <Link
                    key={name}
                    href={url}
                    target="_blank"
                    aria-label={`Visite nosso perfil no ${name}`}
                  >
                    <social.icon
                      size={20}
                      className={`${social.color} cursor-pointer transition-all hover:scale-110`}
                    />
                  </Link>
                ) : null;
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10 max-[400px]:flex max-[400px]:flex-col max-[400px]:items-center max-[400px]:text-center">
            <div>
              <h3 className="font-semibold mb-4">Explorar a loja</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:underline">Início</Link></li>
                <li><Link href="/produtos" className="hover:underline">Produtos</Link></li>
                <li><Link href="/promocoes" className="hover:underline">Promoções</Link></li>
                <li><Link href="/sobre" className="hover:underline">Sobre nós</Link></li>
                <li><Link href="/faq" className="hover:underline">Perguntas frequentes</Link></li>
                <li><Link href="/politica" className="hover:underline">Política &amp; Termos</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Nossa qualidade</h3>
              <p className="text-sm">
                Trabalhamos com os melhores fornecedores para garantir produtos
                de alta qualidade e durabilidade, sempre focados na satisfação
                do cliente.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Minha conta</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href={session?.user ? "/profile" : "/login"}
                    className="hover:underline"
                  >
                    {session?.user ? "Meu perfil" : "Entrar"}
                  </Link>
                </li>
                {session?.user ? (
                  <li>
                    <p className="hover:underline flex gap-1 hover:text-pink-600 transition-colors duration-300 cursor-pointer">
                      <LogoutMenu />
                    </p>
                  </li>
                ) : (
                  <>
                    <li><Link href="/cadastro" className="hover:underline">Criar conta</Link></li>
                    <li><Link href="/resetPwd" className="hover:underline">Esqueci minha senha</Link></li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="mailto:contato@elegance.com.br" className="hover:underline">
                    elegancers.barra@gmail.com
                  </Link>
                </li>
                <li>Atendimento de segunda a sábado, das 09:00 às 18:00</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Formas de pagamento</h3>
              <div className="flex flex-wrap gap-4 text-white">
                <div className="flex items-center gap-2">
                  <FaCreditCard className="w-6 h-6" />
                  <span className="text-sm">Crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCreditCard className="w-6 h-6" />
                  <span className="text-sm">Débito</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaQrcode className="w-6 h-6" />
                  <span className="text-sm">Pix</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center text-center">
          <p className="text-sm">© 2024 | Elegance | Todos os direitos reservados.</p>
          <Link
            href="https://wa.me/5196615024"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:underline"
          >
            &lt;/&gt; William Uteich
          </Link>
        </div>
      </div>
    </footer>
  );
}
