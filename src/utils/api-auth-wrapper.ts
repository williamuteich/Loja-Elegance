import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";

export function withApiAuth(handler: (request: Request, session: any) => Promise<Response>) {
  return async function(request: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !["user", "admin"].includes(session.user.role ?? "")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    return handler(request, session.user);
  };
}
