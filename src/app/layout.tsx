import Header from "@/app/components/header/header";
import type { Metadata } from 'next'
import "./globals.css";
import Footer from "./components/footer/footer";
import AuthProvider from "./components/providers/auth-provider";


export const metadata: Metadata = {
  title: 'Elegance Ecommerce - Descubra produtos incríveis para você',
  description: 'Elegance Ecommerce é uma loja virtual de produtos de qualidade e bom gosto.',
  keywords: [
    'Elegance',
    'Ecommerce',
    'Elegance Ecommerce',
    'Produtos de qualidade',
    'roupas intimas',
    'diversos produtos',
    'produtos de qualidade',
    'produtos de bom gosto',
    'produtos de luxo',
    'produtos de beleza',
    'produtos de moda',
    'produtos de vestuário',
    'produtos de acessórios',
    'produtos de beleza',
    'produtos de saúde',
    'produtos de bem estar',
    'joias',
    'bijuterias',
  ],
  openGraph: {
    images: ['/Frame8.webp'],
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
        <AuthProvider>
        <Header />
        <div>{children}</div>
        <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

