import { Container } from "@/components/container";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Produtos from "@/components/home/produtos/produtos";

export default function Home() {
  return (
    <div className="text-red-800">
      <Header/>
      <Container>
        <Produtos/>
      </Container>
      <Footer/>
    </div>
  );
}
