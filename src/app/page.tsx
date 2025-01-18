import { Container } from "./components/container";
import { Banners } from "./components/home/carousel/banners";
import Produtos from "./components/home/produtos/produtos";
import { Promocao } from "./components/home/produtos/promocao";

export default function Home() {
  return (
    <div className="text-red-800">
      <Banners/>
        <Promocao/>
      <Container>
        <Produtos/>
      </Container>
    </div>
  );
}
