import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";
import { withApiAuth } from "@/utils/api-auth-wrapper";

const prisma = new PrismaClient();

export const GET = withApiAuth(async (request, session) => {
  const url = new URL(request.url);
  const requestedUserId = url.searchParams.get("userID") || undefined;
  
  if (session.role === "admin" && !requestedUserId) {
    try {
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          telefone: true,
          enderecos: {
            select: {
              id: true,
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
      return NextResponse.json(allUsers, { status: 200 });
    } catch (error) {
      console.error("Erro ao buscar todos os usuários:", error);
      return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 }
      );
    }
  }

  if (session.role !== "admin") {
    if (!requestedUserId) {
      return NextResponse.json(
        { error: "ID do usuário é obrigatório" },
        { status: 400 }
      );
    }
    if (session.userID !== requestedUserId) {
      return NextResponse.json(
        { error: "Acesso não autorizado" },
        { status: 403 }
      );
    }
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { id: requestedUserId },
      select: {
        name: true,
        email: true,
        telefone: true,
        enderecos: {
          select: {
            id: true, // Adicionando o campo `id`
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

    if (!userData) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Erro na busca de endereços:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
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