import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from "@/utils/auth";
import { auth as authOptions } from "@/lib/auth-config";
import { getServerSession } from "next-auth";
import logger from '@/lib/logger';

const prisma = new PrismaClient();

export async function GET(request: Request) {

  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Não autorizado" }), { status: 403 });
  }

  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const status = url.searchParams.get('status');
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    const where: any = search
      ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { role: { contains: search, mode: 'insensitive' } },
        ],
      }
      : {};

    if (status !== null) {
      where.active = status === "true";
    }

    const users = await prisma.user.findMany({
      skip,
      take: pageSize,
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true
      }
    });

    const totalRecords = await prisma.user.count({
      where,
    });

    return NextResponse.json({ usuarios: users, totalRecords }, { status: 200 });
  } catch (err) {
    console.error("Erro no filtro de status", err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { generateToken } from "@/utils/generateToken";
import { SendEmail } from "@/infra/SendEmail";
import { VerifyEmail } from "@/emails/VerifyEmail";
import { render } from "@react-email/render";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const saltRounds = 10;

    if (!body.name || !body.email || !body.password) {
      return new Response(JSON.stringify({ message: "Name, email and password are required" }), {
        status: 400,
      });
    }

    body.role = body.role || 'user';
    body.active = false;
    body.telefone = body.telefone || null;

    const emailVerify = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    });

    if (emailVerify) {
      return new Response(JSON.stringify({ message: 'Email já em uso' }), { status: 400 });
    }

    if (body.password.length < 8) {
      return new Response(JSON.stringify({ message: 'Password must be at least 8 characters long' }), { status: 400 });
    }

    const hashPassword = await bcrypt.hash(body.password, saltRounds);

    const verificationToken = generateToken(32);
    const verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        role: body.role,
        password: hashPassword,
        active: false,
        telefone: body.telefone,
        verificationToken,
        verificationTokenExpires,
      }
    });

    logger.info({
      acao: 'criação de conta',
      status: 201,
      user: {
        name: body.name,
        email: body.email,
        role: body.role,
        telefone: body.telefone,
        active: body.active,
      },
      data: new Date().toISOString(),
      message: 'Usuário criado com sucesso, aguardando verificação de e-mail',
    });

    const baseUrl = process.env.NEXTAUTH_URL;
    const verifyUrl = `${baseUrl}/verify-email?token=${verificationToken}`;

    const emailHtml = await render(VerifyEmail({ verifyUrl }));

    const emailService = new SendEmail();
    await emailService.sendEmail(
      newUser.email,
      "Confirme seu e-mail | Loja Elegance",
      emailHtml
    );

    return new Response(JSON.stringify({ message: 'User created successfully. Please verify your email.' }), { status: 201 });

  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: 'Internal server error', details: errorMessage }), { status: 500 });
  }
}
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const {
      id,
      name,
      email,
      role,
      password,
      active,
      currentPassword,
      newPassword,
      confirmPassword,
    } = await request.json();


    const userID = session.user.role === "admin" ? new URL(request.url).searchParams.get("userID") : session.user.userID;

    if (currentPassword || newPassword || confirmPassword) {
      if (session.user.role !== "admin" && session.user.userID !== userID) {

        return NextResponse.json(
          { message: "Sem permissão para alterar outro usuário" },
          { status: 403 }
        );
      }

      if (!currentPassword || !newPassword || !confirmPassword) {
        return NextResponse.json(
          { message: "Senha atual, nova senha e confirmação são obrigatórias" },
          { status: 400 }
        );
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { message: "Nova senha e confirmação não coincidem" },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: userID || undefined },
      });

      if (!user) {
        return NextResponse.json(
          { message: "Usuário não encontrado" },
          { status: 404 }
        );
      }

      if (!user.password) {
        return NextResponse.json({ message: "Usuário sem senha cadastrada" }, { status: 400 });
      }

      if (session.user.role === "user") {
        const isPasswordCorrect = await bcrypt.compare(
          currentPassword,
          user.password
        );

        if (!isPasswordCorrect) {
          return NextResponse.json(
            { message: "Senha atual incorreta" },
            { status: 400 }
          );
        }
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatedUser = await prisma.user.update({
        where: { id: userID || undefined },
        data: {
          password: hashedPassword,
        },
      });

      return NextResponse.json(
        {
          message: "Senha atualizada com sucesso",
          user: updatedUser,
        },
        { status: 200 }
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Apenas administradores podem editar dados de usuários" },
        { status: 403 }
      );
    }

    if (!id || !name || !email || !password || active === undefined) {
      return NextResponse.json(
        { message: "ID, nome, email, senha e status são obrigatórios" },
        { status: 400 }
      );
    }

    const updatedActive = active === "true" || active === true;
    const hashedPassword = await bcrypt.hash(password, 10);

    let updateData: any = {
      name,
      email,
      password: hashedPassword,
      active: updatedActive,
    };
    if (session.user.role === "admin" && role) {
      updateData.role = role;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Usuário atualizado com sucesso", user },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {

  const authError = await requireAdmin(request);
  if (authError) {
    return authError;
  }

  try {
    const body = await request.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: 'Id not provided' }, { status: 400 });
    }

    await prisma.passwordReset.deleteMany({
      where: { userId: id }
    });

    await prisma.endereco.deleteMany({
      where: { userId: id }
    });

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}