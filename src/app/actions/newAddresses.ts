// app/actions/address.ts
'use server'

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const saveAddress = async (userId: string, formData: FormData) => {
    const cep = formData.get("cep") as string;
    const logradouro = formData.get("logradouro") as string;
    const bairro = formData.get("bairro") as string;
    const cidade = formData.get("cidade") as string;
    const estado = formData.get("estado") as string;
    const numero = formData.get("numero") as string;
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

    redirect("/checkouts");
};