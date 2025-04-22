import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { withUserOrAdminApiAuth } from "@/utils/api-auth-wrapper-user-or-admin";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";

const prisma = new PrismaClient();

export const GET = withUserOrAdminApiAuth(async (request: Request, token: any) => {
  try {
    const url = new URL(request.url);
    let userId = token.userID;

    // Se admin, pode buscar qualquer usuário pelo query param userId
    if (token.role === "admin") {
      const paramUserId = url.searchParams.get("userId");
      if (paramUserId) userId = paramUserId;
    }

    if (!userId) {
      return NextResponse.json({ message: 'ID do usuário ausente' }, { status: 400 });
    }

    const getAddresses = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        telefone: true,
        enderecos: {
          select: {
            cep: true,
            logradouro: true,
            numero: true,
            complemento: true,
            bairro: true,
            cidade: true,
            estado: true,
            pais: true
          }
        }
      }
    });

    return NextResponse.json(getAddresses, { status: 200 });
  } catch (err) {
    console.error("Erro ao buscar endereços", err);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
});

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "user") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const userID = session.user.userID!;
  const body = await request.json();

  if (!body.name || !body.email) {
    return NextResponse.json(
      { message: "Nome e email são obrigatórios" },
      { status: 400 }
    );
  }

  const userUpdateData: any = {
    name: body.name,
    email: body.email,
  };
  if (body.telefone !== undefined) {
    userUpdateData.telefone = body.telefone;
  }

  await prisma.user.update({
    where: { id: userID },
    data: userUpdateData,
  });

  const addressData: any = {};
  const addressFields = [
    "cep",
    "logradouro",
    "numero",
    "complemento",
    "bairro",
    "cidade",
    "estado",
    "pais",
  ];
  addressFields.forEach((field) => {
    if (body[field] !== undefined) {
      addressData[field] = body[field];
    }
  });


  if (Object.keys(addressData).length > 0) {
    const existing = await prisma.endereco.findFirst({
      where: { userId: userID },
    });

    if (existing) {
      await prisma.endereco.update({
        where: { id: existing.id },
        data: addressData,
      });
    } else {
      await prisma.endereco.create({
        data: {
          userId: userID,
          ...addressData,
        },
      });
    }
  }

  return NextResponse.json(
    { message: "Dados atualizados com sucesso" },
    { status: 200 }
  );
}