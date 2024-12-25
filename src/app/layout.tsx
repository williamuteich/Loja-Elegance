import Header from "@/app/components/header/header";
import Footer from "@/app/components/footer/footer";
import "./globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dadosGerais = await fetch("http://localhost:3000/api/setup", { next: {revalidate: 25}});
  const data = await dadosGerais.json();

  return (
    <html lang="en">
      <body>
        <Header data={data} />
        <div>{children}</div>
        <Footer data={data}/>
      </body>
    </html>
  );
}
