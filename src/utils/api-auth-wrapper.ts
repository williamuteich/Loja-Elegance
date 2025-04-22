import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export function withApiAuth(handler: (request: Request, token: any) => Promise<Response>) {
  return async function(request: Request) {
    const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    // Se quiser restringir por role:
    if (token.role !== "admin") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }
    return handler(request, token);
  };
}
