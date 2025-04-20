import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token y contraseña son obligatorios' }, { status: 400 });
    }

    // Verificar se o token é válido e não expirou
    const passwordReset = await prisma.passwordReset.findFirst({
      where: {
        token,
        expiresAt: {
          gt: new Date() // Token ainda não expirou
        }
      },
      include: {
        user: true
      }
    });

    if (!passwordReset) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 400 });
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Atualizar a senha do usuário
    await prisma.user.update({
      where: {
        id: passwordReset.userId
      },
      data: {
        password: hashedPassword
      }
    });

    // Remover o token de redefinição após uso
    await prisma.passwordReset.delete({
      where: {
        id: passwordReset.id
      }
    });

    return NextResponse.json({ message: 'Contraseña actualizada con éxito' }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
