"use client";
import { useEffect, useState } from "react";
import { Container } from "./components/container";
import Produtos from "./(pages)/produtos/components/produtos";
import { Promocao } from "./(pages)/produtos/components/promocao";
import ListAllProdutos from "./(pages)/produtos/components/listAllProdutos";
import BannerHome from "./components/home/bannerHome";
import { Banners } from "./components/home/carousel/banners";

export default function Home() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const url = "/api/publica/product?fetchAll=true";
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao buscar produtos");
        const res = await response.json();
        setProdutos(res.produtos || []);
      } catch (e) {
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, []);

  return (
    <div className="text-red-800">
      <Banners/>
      <Promocao produtos={produtos} /> 
      <Container >
        <Produtos produtos={produtos} titulo="Productos Destacados" isDestaque={true}/>
        <BannerHome />
        <ListAllProdutos />
      </Container>
    </div>
  );
}
