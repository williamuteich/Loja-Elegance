import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Permite apenas usuários autenticados (admin OU user) para GET/POST de pedidos
export function withOrderApiAuth(handler: (request: Request, token: any) => Promise<Response>) {
  return async function(request: Request) {
    const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    // Permite tanto admin quanto user
    if (token.role !== "admin" && token.role !== "user") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }
    return handler(request, token);
  };
}
