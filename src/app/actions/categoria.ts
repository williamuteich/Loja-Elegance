"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function saveCategoria(
  formData: { 
    name: string; 
    description: string; 
    imageUrl: string 
  }, 
  params: string | undefined,
  config: {
    apiEndpoint: string;
    method: string;
    urlRevalidate: string[];
  }
) {
  try {

    const cookieStore = cookies();
    const cookieHeader = (await cookieStore)
      .getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const bodyData = params 
      ? { ...formData, id: params } 
      : formData;

    const response = await fetch(config.apiEndpoint, {
      method: config.method,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      return { error: "Erro ao salvar categoria." };
    }

    config.urlRevalidate.forEach(path => revalidatePath(path));

    return { success: "Categoria salva com sucesso!" };
  } catch (error) {
    console.error("Erro ao salvar categoria:", error);
    return { error: "Erro ao salvar categoria. Tente novamente mais tarde." };
  }
}