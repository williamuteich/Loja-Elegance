import { Container } from "./components/container";
import { Banners } from "./components/home/carousel/banners";
import Produtos from "./(pages)/produtos/components/produtos";
import { Promocao } from "./(pages)/produtos/components/promocao";

export default async function Home() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/product`, { next: { revalidate: 160 } });
  const res = await response.json(); 

  return (
    <div className="text-red-800">
      <Banners/>
      <Promocao produtos={res} /> 
      <Container data={res}>
        <Produtos/>
      </Container>
    </div>
  );
}
