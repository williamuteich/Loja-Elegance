"use cache";

import { Container } from "./components/container";
import HomeClientWrapper from "./components/HomeClientWrapper";
import Produtos from "./(pages)/produtos/components/produtos";
import { Promocao } from "./(pages)/produtos/components/promocao";
import ListAllProdutos from "./(pages)/produtos/components/listAllProdutos";
import BannerHome from "./components/home/bannerHome";
import CategoriesCarousel from "./components/home/CategoriesCarousel";
import { Banners } from "./components/home/carousel/banners";
import Reels from "./components/reels";
import ProductsStoreInit from "./components/providers/productsStoreInit";

export default async function Home() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/publica/product?fetchAll=true`, {
     next: { tags: ["loadProduct"], revalidate: 14400 }
  });
  const res = await response.json(); 

  return (
    <div className="text-red-800">
      <HomeClientWrapper />
      <Banners/>
      <CategoriesCarousel />
      <ProductsStoreInit produtos={res.produtos} />
      <Promocao produtos={res.produtos} /> 
      <Container >
        <Produtos produtos={res.produtos} titulo="Productos Destacados" isDestaque={true}/>
        <BannerHome />
        <ListAllProdutos />
      </Container>
      <Reels />
    </div>
  );
}