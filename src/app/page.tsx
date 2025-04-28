export const dynamic = "force-dynamic";

import { Container } from "./components/container";
import Produtos from "./(pages)/produtos/components/produtos";
import { Promocao } from "./(pages)/produtos/components/promocao";
import ListAllProdutos from "./(pages)/produtos/components/listAllProdutos";
import BannerHome from "./components/home/bannerHome";
import CategoriesCarousel from "./components/home/CategoriesCarousel";
import { Banners } from "./components/home/carousel/banners";

export default async function Home() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/publica/product?fetchAll=true`, { next: {revalidate: 800 } });
  const res = await response.json(); 

  return (
    <div className="text-red-800">
      <Banners/>
      <CategoriesCarousel />
      <Promocao produtos={res.produtos} /> 
      <Container >
        <Produtos produtos={res.produtos} titulo="Productos Destacados" isDestaque={true}/>
        <BannerHome />
        <ListAllProdutos />
      </Container>
    </div>
  );
}