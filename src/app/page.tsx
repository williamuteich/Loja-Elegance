"use cache";

import { Container } from "./components/container";
import Produtos from "./(pages)/produtos/components/produtos";
import { Promocao } from "./(pages)/produtos/components/promocao";
import ListAllProdutos from "./(pages)/produtos/components/listAllProdutos";
import BannerHome from "./components/home/bannerHome";
import CategoriesCarousel from "./components/home/CategoriesCarousel";
import { Banners } from "./components/home/carousel/banners";
import Reels from "./components/reels";

export default async function Home() {

  return (
    <div className="text-red-800">
      <Banners/>
      <CategoriesCarousel />
      <Promocao />
      <Container >
        <Produtos titulo="Productos Destacados" isDestaque={true} />
        <BannerHome />
        <ListAllProdutos />
      </Container>
      <Reels />
    </div>
  );
}