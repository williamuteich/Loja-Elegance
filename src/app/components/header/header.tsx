import ClientHeader from "./components/ClientHeader";
import { prisma } from "@/lib/prisma"; 

async function getProducts() {
  try {
    // Fetch products directly from the database using Prisma
    const produtos = await prisma.product.findMany({
      // Add any necessary conditions or selections here, e.g.,
      // where: { active: true },
      // include: { variants: true } // If needed by ClientHeader
    });
    return { produtos }; // Return in the expected structure
  } catch (error) {
    console.error('Failed to fetch products directly:', error);
    return { produtos: [] }; // Return empty array on error
  }
}

export default async function Header() {
  const { produtos } = await getProducts();
  
  return (
    <ClientHeader initialProducts={produtos} />
  );
}
