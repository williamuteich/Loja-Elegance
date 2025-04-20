import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 400 });
    }

    // Buscar o token no banco de dados
    const passwordReset = await prisma.passwordReset.findFirst({
      where: {
        token,
        expiresAt: {
          gt: new Date() // Token ainda não expirou
        }
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    });

    if (!passwordReset) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 400 });
    }

    return NextResponse.json({ 
      valid: true, 
      email: passwordReset.user.email 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error al validar el token:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
