'use server'

import { prisma } from "@/lib/prisma";

export const updateAddress = async (userId: string, enderecoId: string, formData: FormData) => {
  const cep = formData.get("cep") as string;
  const logradouro = formData.get("logradouro") as string;
  const bairro = formData.get("bairro") as string;
  const cidade = formData.get("cidade") as string;
  const estado = formData.get("estado") as string;
  const numero = formData.get("numero") as string;
  const complemento = formData.get("complemento") as string;

  try {
    await prisma.endereco.update({
      where: { id: enderecoId },
      data: {
        cep,
        logradouro,
        bairro,
        cidade,
        estado,
        numero,
        complemento,
        userId
      }
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro ao atualizar endereço" };
  }
};