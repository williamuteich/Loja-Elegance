import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { requireAdmin } from "@/utils/auth";

const prisma = new PrismaClient();

export async function PACTH(request: Request) {

    const authError = await requireAdmin(request);
    if (authError) {
      return authError;
    }

    try{
        
    const body = await request.json();

    console.log("recebendo produtos em promo", body)

    
  } catch (error) {
    console.error("Erro na criação:", error);
    return NextResponse.json(
        "Erro ao tentar adicionar Promoção no(S) produto(S)",
        { status: 500 }
    );
  }
}