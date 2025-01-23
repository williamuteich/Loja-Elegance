import { Container } from "./components/container";
import { Banners } from "./components/home/carousel/banners";
import Produtos from "./(pages)/produtos/components/produtos";
import { Promocao } from "./(pages)/produtos/components/promocao";


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
