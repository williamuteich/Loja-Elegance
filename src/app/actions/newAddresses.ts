'use server'

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const saveAddress = async (userId: string, formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const cpf = formData.get("cpf") as string;
    const telefone = formData.get("telefone") as string;

    await prisma.user.update({
        where: { id: userId },
        data: {
            name,
            email,
            cpf: cpf.replace(/\D/g, ""),
            telefone: telefone.replace(/\D/g, ""),
        }
    });
    const cep = formData.get("cep") as string;
    const logradouro = formData.get("logradouro") as string;
    const bairro = formData.get("bairro") as string;
    const cidade = formData.get("cidade") as string;
    const estado = formData.get("estado") as string;
    let numero = formData.get("numero") as string;
    numero = numero.replace(/\D/g, "");
    const complemento = formData.get("complemento") as string;

    await prisma.endereco.create({
        data: {
            cep,
            logradouro,
            bairro,
            cidade,
            estado,
            pais: "Brasil",
            numero,
            complemento,
            userId
        }
    });

    redirect("/checkout");
};