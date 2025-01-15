import { Container } from "./components/container";
import { Banners } from "./components/home/carousel/banners";
import Produtos from "./components/home/produtos/produtos";

export default function Home() {
  return (
    <div className="text-red-800">
      <Banners/>
      <Container>
        <Produtos/>
      </Container>
    </div>
  );
}
