import Produtos from "./components/home/produtos/produtos";
import { Container } from "./components/container";

export default function Home() {
  return (
    <div className="text-red-800">
      <Container>
        <Produtos/>
      </Container>
    </div>
  );
}
