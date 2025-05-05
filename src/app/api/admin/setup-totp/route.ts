import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";
import { PrismaClient } from "@prisma/client";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

const prisma = new PrismaClient();

// POST: Gera segredo e retorna QRCode
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
    }
    
    const userId = session.user.userID;
    
    try {
        // Gera segredo TOTP
        const secret = speakeasy.generateSecret({ 
            name: `Loja Elegance (${session.user.email})`,
            length: 32
        });

        // Verifica se otpauth_url existe
        if (!secret.otpauth_url) {
            throw new Error("Falha ao gerar URL de autenticação");
        }

        // Gera QRCode
        const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);

        // Atualiza segredo no banco
        await prisma.user.update({
            where: { id: userId },
            data: { totpSecret: secret.base32 }
        });

        return NextResponse.json({
            qrCodeDataURL,
            secret: secret.base32
        });

    } catch (error) {
        console.error("Erro no setup TOTP:", error);
        return NextResponse.json(
            { message: "Erro na configuração do 2FA" },
            { status: 500 }
        );
    }
}

// PATCH: Valida código e ativa TOTP
export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
    }

    const userId = session.user.userID;

    try {
        const { totpCode } = await request.json();
        
        // Valida código
        const user = await prisma.user.findUnique({ 
            where: { id: userId }, 
            select: { totpSecret: true } 
        });

        if (!user?.totpSecret) {
            return NextResponse.json(
                { message: "Configuração TOTP não encontrada" },
                { status: 400 }
            );
        }

        const verified = speakeasy.totp.verify({
            secret: user.totpSecret,
            encoding: "base32",
            token: totpCode,
            window: 1
        });

        if (!verified) {
            return NextResponse.json(
                { message: "Código inválido ou expirado" },
                { status: 400 }
            );
        }

        return NextResponse.json({ message: "2FA ativado com sucesso!" });

    } catch (error) {
        console.error("Erro na validação TOTP:", error);
        return NextResponse.json(
            { message: "Erro na validação do código" },
            { status: 500 }
        );
    }
}