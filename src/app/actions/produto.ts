// app/actions/produto.ts
"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createProduct(data: any) {
  const cookieStore = cookies();
  const cookieHeader = (await cookieStore)
    .getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/privada/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erro ao adicionar produto." };
    }

    revalidatePath("/dashboard/produtos");
    return { success: "Produto adicionado com sucesso!" };
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    return { error: "Erro ao adicionar produto. Tente novamente mais tarde." };
  }
}