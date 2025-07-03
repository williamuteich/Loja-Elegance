import EditarProduto from "../components/editProdutc";

export default function Page({ params }: { params: { id: string } }) {
  return <EditarProduto id={params.id} />;
}