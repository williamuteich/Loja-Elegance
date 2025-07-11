import EditarProduto from "../components/editProdutc";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditarProduto id={id} />;
}