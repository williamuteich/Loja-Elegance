"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaWhatsapp, FaFacebookF, FaInstagram, FaTiktok, FaYoutube, FaLinkedinIn, FaTelegramPlane, FaBarcode, FaQrcode, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { useSession } from "next-auth/react";
import { LogoutMenu } from "../logoutAccount";
import { useEffect, useState } from "react";

export default function Footer() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [socialMedia, setSocialMedia] = useState<{ name: string; url: string; type: string; active: boolean }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/publica/setup`, { next: { revalidate: 3800 } });
        if (!response.ok) throw new Error("Erro ao carregar as configurações.");

        const { config } = await response.json();
        if (config) {
          const filteredSocialMedia = config.filter((item: { type: string; active: boolean }) => item.type === 'social');
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
    <footer className="bg-black text-white py-10 relative">
      {whatsapp && (
        <div className="fixed bottom-6 right-6 xl:right-12 z-50">
          <Link
            href={whatsapp.url}
            target="_blank"
            aria-label="Fale conosco pelo WhatsApp"
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all border border-green-500"
          >
            <FaWhatsapp className="w-6 h-6 text-green-600" />
            <span className="text-sm text-green-700 font-medium">¿Necesitás ayuda?</span>
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
              <h3 className="font-semibold mb-4">Explorar la tienda</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:underline">Inicio</Link>
                </li>
                <li>
                  <Link href="/produtos" className="hover:underline">Productos</Link>
                </li>
                <li>
                  <Link href="/promocoes" className="hover:underline">Promociones</Link>
                </li>
                <li>
                  <Link href="/sobre" className="hover:underline">Sobre nosotros</Link>
                </li>
                <li>
                  <Link href="/contato" className="hover:underline">Contáctanos</Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:underline">Preguntas frecuentes</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Nuestra calidad</h3>
              <p className="text-sm">
                Trabajamos con los mejores proveedores para garantizar productos de alta calidad y durabilidad, siempre enfocados en la satisfacción del cliente.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Mi cuenta</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={session?.user ? '/profile' : '/login'} className="hover:underline">
                    {session?.user ? 'Mi perfil' : 'Ingresar'}
                  </Link>
                </li>
                {session?.user ? (
                  <>
                    <li>
                      <p className="hover:underline flex gap-1 hover:text-pink-600 transition-colors duration-300 cursor-pointer">
                        <LogoutMenu />
                      </p>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/cadastro" className="hover:underline">Crear cuenta</Link>
                    </li>
                    <li>
                      <Link href="/resetPwd" className="hover:underline">Olvidé mi contraseña</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="mailto:contato@elegance.com.br" className="hover:underline">
                    elegancers.barra@gmail.com
                  </Link>
                </li>
                <li>Atención de lunes a sábado, de 09:00 a 18:00 horas</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Formas de pago</h3>
              <div className="flex flex-wrap gap-4 text-white">
                <div className="flex items-center gap-2">
                  <FaMoneyBillWave className="w-6 h-6" />
                  <span className="text-sm">Efectivo</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCreditCard className="w-6 h-6" />
                  <span className="text-sm">Tarjeta</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaQrcode className="w-6 h-6" />
                  <span className="text-sm">Pix</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBarcode className="w-6 h-6" />
                  <span className="text-sm">Transferencia bancaria</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm">© 2024 | Elegance | Todos los derechos reservados.</p>
          <Link href="https://wa.me/5196615024" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
            &lt;/&gt; William Uteich
          </Link>
        </div>
      </div>
    </footer>
  );
}
