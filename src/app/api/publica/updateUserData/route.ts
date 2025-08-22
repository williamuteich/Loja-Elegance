import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.userID) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { userID, name, email, cpf, telefone } = await request.json();

    // Verificar se o userID da sessão confere com o enviado
    if (session.user.userID !== userID) {
      return NextResponse.json(
        { message: "Acesso não autorizado" },
        { status: 403 }
      );
    }

    // Validações básicas
    if (!name || !email || !cpf || !telefone) {
      return NextResponse.json(
        { message: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar formato do CPF (básico)
    const cpfClean = cpf.replace(/\D/g, "");
    if (cpfClean.length !== 11) {
      return NextResponse.json(
        { message: "CPF deve ter 11 dígitos" },
        { status: 400 }
      );
    }

    // Validar formato do telefone (básico)
    const telefoneClean = telefone.replace(/\D/g, "");
    if (telefoneClean.length < 10) {
      return NextResponse.json(
        { message: "Telefone deve ter pelo menos 10 dígitos" },
        { status: 400 }
      );
    }

    // Verificar se o CPF já está sendo usado por outro usuário
    const existingUserWithCPF = await prisma.user.findFirst({
      where: {
        cpf: cpfClean,
        id: {
          not: userID
        }
      }
    });

    if (existingUserWithCPF) {
      return NextResponse.json(
        { message: "Este CPF já está sendo usado por outro usuário" },
        { status: 400 }
      );
    }

    // Atualizar dados do usuário
    const updatedUser = await prisma.user.update({
      where: { id: userID },
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        cpf: cpfClean, // Salvar CPF limpo (só números)
        telefone: telefoneClean, // Salvar telefone limpo (só números)
      },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        telefone: true,
      }
    });

    return NextResponse.json({
      message: "Dados atualizados com sucesso",
      user: updatedUser
    });

  } catch (error) {
    console.error("Erro ao atualizar dados do usuário:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
