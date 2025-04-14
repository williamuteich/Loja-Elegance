import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "user") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  try {
    const userId = session.user.userID;

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
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "user") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  try {
    const {
      name,
      email,
      telefone,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      pais
    } = await request.json();

    const userID = session.user.userID;

    if (!userID || !name || !email || !cep || !logradouro || !numero || !bairro || !cidade || !estado || !pais) {
      return NextResponse.json({ message: 'Todos os campos obrigatórios devem ser preenchidos' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userID },
      select: {
        id: true,
        role: true,
        active: true,
        enderecos: true,
        telefone: true
      }
    });

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: userID },
      data: {
        name,
        email,
        telefone
      }
    });

    if (user.enderecos && user.enderecos.length > 0) {
      const updatedAddress = await prisma.endereco.update({
        where: { id: user.enderecos[0].id },
        data: {
          cep,
          logradouro,
          numero,
          complemento,
          bairro,
          cidade,
          estado,
          pais
        }
      });
      return NextResponse.json({ ...user, updatedAddress }, { status: 200 });
    } else {
      const newAddress = await prisma.endereco.create({
        data: {
          userId: user.id,
          cep,
          logradouro,
          numero,
          complemento,
          bairro,
          cidade,
          estado,
          pais
        }
      });
      return NextResponse.json({ ...user, newAddress }, { status: 200 });
    }

  } catch (err) {
    console.error("Erro ao atualizar endereço", err);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
