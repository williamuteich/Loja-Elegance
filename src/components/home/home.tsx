"use cache";

import ListAllProdutos from "@/app/(pages)/produtos/components/listAllProdutos";
import Produtos from "@/app/(pages)/produtos/components/produtos";
import { Promocao } from "@/app/(pages)/produtos/components/promocao";
import { Container } from "@/app/components/container";
import BannerHome from "@/app/components/home/bannerHome";
import { Banners } from "@/app/components/home/carousel/banners";
import CategoriesCarousel from "@/app/components/home/CategoriesCarousel";
import Reels from "@/app/components/reels";

export default async function HomeSite() {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/publica/product?fetchAll=true`, {
        cache: 'force-cache',
        next: { tags: ['loadProduct'] }
      });
    const res = await response.json();
    return (
        <div className="text-red-800">
            <Banners />
            <CategoriesCarousel />
            <Promocao produtos={res.produtos} />
            <Container >
                <Produtos titulo="Productos Destacados" isDestaque={true} produtos={res.produtos} />
                <BannerHome />
                <ListAllProdutos />
            </Container>
            <Reels />
        </div>
    )
}