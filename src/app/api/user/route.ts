import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from "@/utils/auth";
import { auth as authOptions } from "@/lib/auth-config";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {

    const authError = await requireAdmin(request);
    if (authError) {
        return authError;
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

export async function POST(request: Request) {

    const authError = await requireAdmin(request);
    if (authError) {
        return authError;
    }

    try {
        const body = await request.json();
        const saltRounds = 10;

        if (!body.name || !body.email || !body.password) {
            return new Response(JSON.stringify({ message: "Name, email and password are required" }), {
                status: 400,
            });
        }

        body.role = body.role || 'user';
        body.active = body.active === 'true' ? true : false;
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

        const newUser = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                role: body.role,
                password: hashPassword,
                active: body.active,
                telefone: body.telefone,
            }
        });

        return new Response(JSON.stringify({ message: 'User created successfully' }), { status: 201 });

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
    const url = new URL(request.url);
    const userID = url.searchParams.get("userID");

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

    if (userID) {
      console.log("Comparando", session.user.userID, "==", userID);

      if (session.user.role !== "admin" && session.user.userID !== userID) {
        return NextResponse.json(
          { message: "Sem permissão para alterar outro usuário" },
          { status: 403 }
        );
      }

      if (!currentPassword || !newPassword || !confirmPassword) {
        return NextResponse.json(
          {
            message:
              "Current password, new password, and confirmation are required",
          },
          { status: 400 }
        );
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { message: "New password and confirmation do not match" },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: userID },
      });

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordCorrect) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatedUser = await prisma.user.update({
        where: { id: userID },
        data: {
          password: hashedPassword,
          name: user.name,
          email: user.email,
          role: user.role,
          active: user.active,
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
        { message: "Apenas administradores podem alterar dados de usuário" },
        { status: 403 }
      );
    }

    if (!id || !name || !email || !role || !password || active === undefined) {
      return NextResponse.json(
        { message: "ID, name, email, role and password are required" },
        { status: 400 }
      );
    }

    const updatedActive = active === "true" ? true : false;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
        password: hashedPassword,
        active: updatedActive,
      },
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

        await prisma.endereco.deleteMany({
            where: { userId: id }
        })

        await prisma.user.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}