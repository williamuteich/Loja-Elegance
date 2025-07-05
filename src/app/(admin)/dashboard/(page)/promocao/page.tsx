import { promoProduto } from "@/app/actions/promoProduto";
import PromocaoProdutos from "./components/PromocaoProdutos";

export default function Page() {
  return <PromocaoProdutos promoAction={promoProduto} />;
}