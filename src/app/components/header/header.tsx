import ClientHeader from "./components/ClientHeader";

async function getProducts() {
  const apiUrl = `${process.env.NEXTAUTH_URL}/api/privada/product?fetchAll=true`;
  console.log(`Fetching products from: ${apiUrl}`); // Log para debug no build

  try {
    const res = await fetch(apiUrl, {
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) {
     
      let errorBody = '';
      try {
        errorBody = await res.text();
      } catch (_) { }
      console.error(`Failed to fetch products: ${res.status} ${res.statusText}`, errorBody);
      return { produtos: [] };
    }
    
    return res.json();

  } catch (error) {
   
    console.error('Network or fetch error in getProducts:', error);
    return { produtos: [] }; 
  }
}

export default async function Header() {
  const { produtos } = await getProducts();
  
  return (
    <ClientHeader initialProducts={produtos} />
  );
}
