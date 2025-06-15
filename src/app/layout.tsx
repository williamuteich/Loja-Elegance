import Header from "@/app/components/header/header";
import type { Metadata } from 'next'
import "./globals.css";
import Footer from "./components/footer/footer";
import AuthProvider from "./components/providers/auth-provider";
import { CartProvider } from "@/context/cartContext";
import VisitTracker from "./components/visitTracker";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Elegance Ecommerce - Eletrônicos, Celulares e Acessórios | Loja Virtual',
  description: 'Compre celulares, eletrônicos, joias, maquiagem e brinquedos com os melhores preços. Frete rápido, parcelamento e garantia!',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  keywords: [
    'tienda de electrónicos online',
    'celulares y accesorios',
    'electrónica variada',
    'joyas y bisutería',
    'maquillaje importado',
    'juguetes educativos',
    'cables y cargadores para celular',
    'accesorios para celular',
    'ofertas de electrónicos',
    'tienda virtual de tecnología',
    'comprar electrónicos en Uruguay',
    'ecommerce con envío gratis',
    'mejor precio iPhone',
    'cargadores rápidos para celular',
    'kit de maquillaje profesional',
    'relojes inteligentes',
    'smartwatches y accesorios',
    'auriculares inalámbricos',
    'auriculares con cancelación de ruido',
    'cámaras de seguridad Wi-Fi',
    'gadgets tecnológicos 2024',
    'power bank portátil',
    'películas protectoras para celular',
    'fundas personalizadas para iPhone',
    'altavoces Bluetooth',
    'teclados mecánicos para gamers',
    'adaptadores USB-C a HDMI',
    'fuentes universales para notebooks',
    'anillos de plata 925',
    'colgantes personalizados en oro',
    'pendientes pequeños chapados',
    'pulseras femeninas delicadas',
    'relojes masculinos resistentes al agua',
    'collares largos dorados',
    'kits de joyas minimalistas',
    'colgantes de signos zodiacales',
    'conjuntos de joyas bañadas en oro',
    'anillo de compromiso de plata',
    'paleta de sombras nude',
    'base líquida de alta cobertura',
    'kits de maquillaje completos',
    'perfumes importados femeninos',
    'brochas de maquillaje profesionales',
    'eyeliner líquido waterproof',
    'gloss labial hidratante',
    'cosméticos coreanos',
    'protector solar facial SPF 60',
    'pinceles de maquillaje veganos',
    'controlador inalámbrico PS5',
    'headset gamer RGB',
    'teclados mecánicos retroiluminados',
    'figuras de colección Marvel',
    'Lego educativo para niños',
    'scooter eléctrico para adultos',
    'kits STEM para niños',
    'consolas portátiles retro',
    'autos a control remoto',
    'juegos educativos para niños de 6 años',
    'fundas de silicona para iPhone 15',
    'soportes vehiculares magnéticos',
    'tarjetas de memoria 256GB',
    'lapiceros stylus para tablet',
    'lentes telefoto para celular',
    'cables lightning originales',
    'power bank 20000mAh',
    'adaptadores USB-C duales',
    'headset con cancelación de ruido',
    'protectores de pantalla de vidrio templado',
    'descuentos en electrónicos',
    'ofertas flash en celulares',
    'tienda virtual con pagos en cuotas',
    'envío gratis en electrónicos',
    'cupón de descuento primera compra',
    'garantía extendida para notebooks',
    'precios bajos en accesorios',
    'Black Friday tecnología',
    'promociones de maquillaje',
    'outlet de joyas de plata',
    'mejor tablet hasta 1500 pesos',
    'dónde comprar AirPods originales',
    'cargadores rápidos Samsung A54',
    'maquillaje no alérgico',
    'reloj smartwatch con oxímetro',
    'headset Bluetooth deportivo resistente al agua',
    'cables USB-C 100W 2 metros',
    'kits de joyas para novias',
    'películas de privacidad para notebooks',
    'power bank para viajes aéreos',
    'tienda de electrónicos en Montevideo',
    'electrónica barata en Uruguay',
    'mejor ecommerce en Uruguay',
    'entrega rápida en Uruguay',
    'tienda de tecnología en Montevideo',
    'comprar electrónicos en Maldonado',
    'distribuidor de accesorios en Canelones',
    'joyas finas en Paysandú',
    'maquillaje importado en Uruguay'
  ],
  openGraph: {
    images: ['/favicon.ico'],
    title: 'Elegance Ecommerce - Electrónica, Juguetes, Accesorios y Maquillaje | Tienda Online en Uruguay',
    description: 'Descubrí una amplia variedad de productos: electrónicos, juguetes, accesorios y maquillaje. Comprá online en Uruguay con las mejores condiciones de pago.',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
    }
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <VisitTracker />
        <AuthProvider>
          <CartProvider>
            <Header />
            <div>{children}</div>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
