import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";

export function withApiAuth(handler: (request: Request, session: any) => Promise<Response>) {
  return async function(request: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    return handler(request, session.user);
  };
}