import { NextResponse } from "next/server";
import { auth as authOptions } from "@/lib/auth-config";
import { getServerSession } from "next-auth";
import logger from '@/lib/logger';

export async function requireAdmin(request: Request) {
  const session = await getServerSession(authOptions);
  const method = request.method;
  const url = request.url;
  const userAgent = request.headers.get('user-agent') || null;
  if (!session) {
    logger.warn({
      acao: 'acesso negado',
      motivo: 'nao autenticado',
      metodo: method,
      url,
      userAgent,
      status: 401,
      data: new Date().toISOString(),
    });
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    logger.warn({
      acao: 'acesso negado',
      motivo: 'sem permissao',
      usuario: {
        email: session.user?.email,
        id: session.user?.id,
        nome: session.user?.name,
      },
      metodo: method,
      url,
      userAgent,
      status: 403,
      data: new Date().toISOString(),
    });
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }
  return null; 
}
