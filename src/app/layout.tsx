import Header from "@/app/components/header/header";
import type { Metadata } from 'next'
import "./globals.css";
import Footer from "./components/footer/footer";
import AuthProvider from "./components/providers/auth-provider";
import { CartProvider } from "@/context/cartContext";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Elegance Ecommerce - Descubra produtos incríveis para você',
  description: 'Elegance Ecommerce é uma loja virtual de produtos de qualidade e bom gosto.',
  icons: {
    icon: '/favicon.ico',
    //shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  },
  keywords: [
    'Elegance',
    'Ecommerce',
    'Elegance Ecommerce',
    'productos de calidad',
    'ropa interior',
    'productos variados',
    'productos con buen gusto',
    'productos de lujo',
    'productos de belleza',
    'productos de moda',
    'ropa y accesorios',
    'productos de bienestar',
    'salud y belleza',
    'joyas',
    'tienda online Uruguay',
    'moda femenina Uruguay',
    'compras en línea',
    'accesorios elegantes',
    'ropa de diseño Uruguay',
    'cosméticos online',
    'lencería de calidad',
    'estilo y elegancia',
    'artículos de bazar',
    'productos para el hogar',
    'decoración de interiores',
    'cocina y utensilios',
    'bazar online',
    'organización del hogar',
    'accesorios de cocina',
    'almacenamiento y orden',
  ],  
  openGraph: {
    images: ['/favicon.ico'],
    title: 'Elegance Ecommerce - Descubrí productos increíbles para vos',
    description: 'Elegance Ecommerce es una tienda online con productos de calidad y buen gusto.',
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
