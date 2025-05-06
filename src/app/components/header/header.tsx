import ClientHeader from "./components/ClientHeader";

async function getProducts() {
  const apiUrl = `${process.env.NEXTAUTH_URL}/api/privada/product?fetchAll=true`;

  try {
    const res = await fetch(apiUrl, {
      next: { revalidate: 20 } 
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
