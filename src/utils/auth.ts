import { NextResponse } from "next/server";
import { auth as authOptions } from "@/lib/auth-config";
import { getServerSession } from "next-auth";

export async function requireAdmin(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }
  return null; 
}
