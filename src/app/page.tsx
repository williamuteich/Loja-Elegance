
import Footer from "@/app/components/footer/footer";
import Header from "@/app/components/header/header";
import Produtos from "./components/home/produtos/produtos";
import { Container } from "./components/container";
import Link from "next/link";

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
