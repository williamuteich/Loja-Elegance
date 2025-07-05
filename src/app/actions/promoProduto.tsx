"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function promoProduto(data: any) {
  
  const cookieStore = cookies();
  const cookieHeader = (await cookieStore).getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    let endpoint = '/api/privada/promo';
    let bodyData = data;
    
    if (data.actionType === 'revert') {
      endpoint = '/api/privada/revert-promo';
      bodyData = { produtoId: data.produtoId };
    }

    const response = await fetch(`${process.env.NEXTAUTH_URL}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erro ao processar promoção." };
    }

    revalidateTag("loadProduct");
    revalidatePath("/dashboard/produtos");
    
    return { success: "Operação realizada com sucesso!" };
  } catch (error) {
    console.error("Erro ao processar promoção:", error);
    return { error: "Erro ao processar promoção. Tente novamente mais tarde." };
  }
}