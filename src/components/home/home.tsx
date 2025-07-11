export const dynamic = "force-dynamic";

import ListAllProdutos from "@/app/(pages)/produtos/components/listAllProdutos";
import Produtos from "@/app/(pages)/produtos/components/produtos";
import { Promocao } from "@/app/(pages)/produtos/components/promocao";
import { Container } from "@/app/components/container";
import BannerHome from "@/app/components/home/bannerHome";
import { Banners } from "@/app/components/home/carousel/banners";
import CategoriesCarousel from "@/app/components/home/CategoriesCarousel";
import Reels from "@/app/components/reels";

export default async function HomeSite() {
    return (
        <div className="text-red-800">
            <Banners />
            <CategoriesCarousel />
            <Promocao />
            <Container >
                <Produtos titulo="Productos Destacados" isDestaque={true} />
                <BannerHome />
                <ListAllProdutos />
            </Container>
            <Reels />
        </div>
    )
}