// app/actions/produto.ts
"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateProduct(data: any) {
  const cookieStore = cookies();
  const cookieHeader = (await cookieStore)
    .getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/privada/product`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erro ao atualizar produto." };
    }

    // Revalidar caminhos importantes
    revalidatePath("/dashboard/produtos");
    
    return { success: "Produto atualizado com sucesso!" };
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return { error: "Erro ao atualizar produto. Tente novamente mais tarde." };
  }
}