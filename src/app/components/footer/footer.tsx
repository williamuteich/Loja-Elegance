"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaWhatsapp, FaFacebookF, FaInstagram } from 'react-icons/fa';
import { useSession } from "next-auth/react";
import { LogoutMenu } from "../logoutAccount";
import { useEffect, useState } from "react";

export default function Footer() {
  const [socialMedia, setSocialMedia] = useState<{ name: string; url: string; type: string; active: boolean }[]>([]);
  const { data: session } = useSession();
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/setup`, { next: { revalidate: 3600 } });
        if (!response.ok) throw new Error("Erro ao carregar as configurações.");

        const { config } = await response.json();
        if (config) {
          const filteredSocialMedia = config.filter((item: { type: string; active: boolean }) => item.type === 'social' && item.active);
          setSocialMedia(filteredSocialMedia);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const socialIcons = {
    whatsapp: { icon: FaWhatsapp, color: "text-green-500" },
    facebook: { icon: FaFacebookF, color: "text-blue-600" },
    instagram: { icon: FaInstagram, color: "text-pink-600" },
  };

  const whatsapp = socialMedia.find(({ name }) => name === "whatsapp");

  return (
    <footer className="bg-black text-white py-10 relative">
      {whatsapp && (
        <div className="flex items-center justify-center fixed z-50 bottom-0 h-[12vh] right-[5vw] xl:right-[8vw] 2xl:right-[7vw] lg:right-[8vw]">
          <Link href={whatsapp.url} aria-label="Fale conosco pelo WhatsApp" target="_blank">
            <FaWhatsapp className="w-12 h-12 text-green-500 animate-pulse cursor-pointer transition-all" />
          </Link>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div>
          <div>
            <h2 className="font-bold text-3xl mb-3">Elegance</h2>
            <div className="flex gap-1 mb-6">
              {socialMedia.map(({ name, url }) => {
                const social = socialIcons[name as keyof typeof socialIcons];
                return social ? (
                  <Link key={name} href={url} target="_blank" aria-label={`Visite nosso perfil no ${name}`}>
                    <social.icon size={20} className={`${social.color} cursor-pointer transition-all hover:scale-110`} />
                  </Link>
                ) : null;
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
            <div>
              <h3 className="font-semibold mb-4">Explore a Loja</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:underline">Início</Link>
                </li>
                <li>
                  <Link href="/produtos" className="hover:underline">Produtos</Link>
                </li>
                <li>
                  <Link href="/promocoes" className="hover:underline">Promoções</Link>
                </li>
                <li>
                  <Link href="/sobre" className="hover:underline">Sobre nós</Link>
                </li>
                <li>
                  <Link href="/contato" className="hover:underline">Entre em Contato</Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:underline">Perguntas Frequentes</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Nossa Qualidade</h3>
              <p className="text-sm">
                Trabalhamos com os melhores fornecedores para garantir produtos de alta qualidade e durabilidade, sempre focados na satisfação do cliente.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Minha conta</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={session?.user ? '/profile' : '/login'} className="hover:underline">
                    {session?.user ? 'Meu perfil' : 'Entrar'}
                  </Link>
                </li>
                {session?.user ? (
                  <>
                    <li>
                      <Link href="/rastreamento" className="hover:underline">Rastreamento</Link>
                    </li>
                    <li>
                      <p className="hover:underline flex gap-1 hover:text-pink-600 transition-colors duration-300 cursor-pointer">
                        <LogoutMenu />
                        Sair
                      </p>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/cadastro" className="hover:underline">Criar conta</Link>
                    </li>
                    <li>
                      <Link href="/rastreamento" className="hover:underline">Rastreamento</Link>
                    </li>
                    <li>
                      <Link href="/resetPwd" className="hover:underline">Esqueci minha senha</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="mailto:contato@elegance.com.br" className="hover:underline">
                    contato@elegance.com.br
                  </Link>
                </li>
                <li>Atendimento das 8h às 17h</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Formas de Pagamento</h3>
              <div className="flex flex-wrap gap-4">
                <Image src="/visa.svg" alt="Visa" width={16} height={16} className="h-8 w-auto" />
                <Image src="/mastercard.svg" alt="Mastercard" width={16} height={16} className="h-8 w-auto" />
                <Image src="/pix.svg" alt="Pix" width={16} height={16} className="h-8 w-auto" />
                <Image src="/boleto.svg" alt="Boleto" width={16} height={16} className="h-8 w-auto" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm">© 2024 | Elegance | Todos os direitos reservados.</p>
          <Link href="https://wa.me/5196615024" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
            &lt;/&gt; William Uteich
          </Link>
        </div>
      </div>
    </footer>
  );
}