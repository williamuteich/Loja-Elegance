import ClientHeader from "./components/ClientHeader";

async function getProducts() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/privada/product?fetchAll=true`, {
    next: { revalidate: 3600 } 
  });
  
  if (!res.ok) {
    console.error('Failed to fetch products');
    return { produtos: [] };
  }
  
  return res.json();
}

export default async function Header() {
  const { produtos } = await getProducts();
  
  return (
    <ClientHeader initialProducts={produtos} />
  );
}
