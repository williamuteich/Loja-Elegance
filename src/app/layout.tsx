import Header from "@/app/components/header/header";
import ReduxProvider from "../store/redux-provider";
import type { Metadata } from 'next'
import "./globals.css";
import Footer from "./components/footer/footer";
import HeaderFooter from "@/app/components/headerFooter/headerFooter";
import AuthProvider from "./components/providers/auth-provider";
import { CartProvider } from "@/context/newCartContext"; 
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
    'loja de eletrônicos online',
    'celulares e acessórios',
    'eletrônicos variados',
    'joias e bijuterias',
    'maquiagem importada',
    'brinquedos educativos',
    'cabos e carregadores para celular',
    'acessórios para celular',
    'ofertas de eletrônicos',
    'loja virtual de tecnologia',
    'comprar eletrônicos no Brasil',
    'ecommerce com frete grátis',
    'melhor preço iPhone',
    'carregadores rápidos para celular',
    'kit de maquiagem profissional',
    'relógios inteligentes',
    'smartwatches e acessórios',
    'fones de ouvido sem fio',
    'fones com cancelamento de ruído',
    'câmeras de segurança Wi-Fi',
    'gadgets tecnológicos 2024',
    'power bank portátil',
    'películas protetoras para celular',
    'capas personalizadas para iPhone',
    'caixas de som Bluetooth',
    'teclados mecânicos gamer',
    'adaptadores USB-C para HDMI',
    'fontes universais para notebooks',
    'anéis de prata 925',
    'pingentes personalizados em ouro',
    'brincos pequenos folheados',
    'pulseiras femininas delicadas',
    'relógios masculinos à prova d’água',
    'colares longos dourados',
    'kits de joias minimalistas',
    'pingentes de signos do zodíaco',
    'conjuntos de joias folheadas a ouro',
    'anel de compromisso de prata',
    'paleta de sombras nude',
    'base líquida de alta cobertura',
    'kits de maquiagem completos',
    'perfumes importados femininos',
    'pincéis de maquiagem profissionais',
    'delineador líquido à prova d’água',
    'gloss labial hidratante',
    'cosméticos coreanos',
    'protetor solar facial FPS 60',
    'pincéis de maquiagem veganos',
    'controle sem fio PS5',
    'headset gamer RGB',
    'teclados mecânicos com iluminação',
    'figuras de coleção Marvel',
    'Lego educativo para crianças',
    'patinete elétrico para adultos',
    'kits STEM para crianças',
    'consoles portáteis retrô',
    'carrinhos de controle remoto',
    'jogos educativos para crianças de 6 anos',
    'capas de silicone para iPhone 15',
    'suportes veiculares magnéticos',
    'cartões de memória 256GB',
    'canetas stylus para tablet',
    'lentes telefoto para celular',
    'cabos lightning originais',
    'power bank 20000mAh',
    'adaptadores USB-C duplos',
    'headset com cancelamento de ruído',
    'protetores de tela de vidro temperado',
    'descontos em eletrônicos',
    'ofertas relâmpago em celulares',
    'loja virtual com pagamento parcelado',
    'frete grátis em eletrônicos',
    'cupom de desconto primeira compra',
    'garantia estendida para notebooks',
    'preços baixos em acessórios',
    'Black Friday tecnologia',
    'promoções de maquiagem',
    'outlet de joias de prata',
    'melhor tablet até 1500 reais',
    'onde comprar AirPods originais',
    'carregadores rápidos Samsung A54',
    'maquiagem hipoalergênica',
    'relógio smartwatch com oxímetro',
    'headset Bluetooth esportivo à prova d’água',
    'cabos USB-C 100W 2 metros',
    'kits de joias para noivas',
    'películas de privacidade para notebooks',
    'power bank para viagens aéreas',
    'loja de eletrônicos em São Paulo',
    'eletrônicos baratos no Brasil',
    'melhor ecommerce no Brasil',
    'entrega rápida no Brasil',
    'loja de tecnologia em SP',
    'comprar eletrônicos no RJ',
    'distribuidor de acessórios em MG',
    'joias finas em Curitiba',
    'maquiagem importada no Brasil'
  ],
  openGraph: {
    images: ['/favicon.ico'],
    title: 'Elegance Ecommerce - Eletrônicos, Brinquedos, Acessórios e Maquiagem | Loja Online no Brasil',
    description: 'Descubra uma ampla variedade de produtos: eletrônicos, brinquedos, acessórios e maquiagem. Compre online no Brasil com as melhores condições de pagamento.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col bg-neutral-50">
        <ReduxProvider>
          <AuthProvider>
            <CartProvider>
              <VisitTracker />
              <Header />
              <HeaderFooter />
              <main className="flex-1 flex flex-col">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
