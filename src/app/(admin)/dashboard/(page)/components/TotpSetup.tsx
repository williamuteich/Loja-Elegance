"use client";
import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

import { useEffect } from "react";

export default function TotpSetup() {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [secret, setSecret] = useState<string | null>(null);
    const [totpCode, setTotpCode] = useState("");
    const [step, setStep] = useState<"init" | "validate" | "done">("init");
    const [loading, setLoading] = useState(false);
    const [has2FA, setHas2FA] = useState<boolean | null>(null);
    const [checking, setChecking] = useState(true);

    // Verifica se já existe 2FA ao montar
    useEffect(() => {
        async function check2FA() {
            setChecking(true);
            try {
                const res = await fetch("/api/admin/me");
                const data = await res.json();
                setHas2FA(!!data.has2FA);
            } catch (err) {
                setHas2FA(false);
            }
            setChecking(false);
        }
        check2FA();
    }, []);

    async function startSetup() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/setup-totp", { method: "POST" });
            const data = await res.json();
            setQrCode(data.qrCodeDataURL);
            setSecret(data.secret);
            setStep("validate");
        } catch (err) {
            toast.error("Erro ao iniciar setup do 2FA");
        }
        setLoading(false);
    }

    async function validateTotp() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/setup-totp", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ totpCode })
            });
            const data = await res.json();
            if (res.ok) {
                setStep("done");
                toast.success("2FA ativado com sucesso!");
            } else {
                toast.error(data.message || "Código inválido");
            }
        } catch (err) {
            toast.error("Erro ao validar código TOTP");
        }
        setLoading(false);
    }

    if (checking) {
        return <p>Carregando...</p>;
    }
    if (has2FA) {
        return (
            <div className="flex flex-col items-center gap-4">
                <p className="text-green-700 font-semibold">2FA já está ativado para sua conta.</p>
                {/* Aqui pode adicionar botão para resetar/desativar o 2FA, se desejar */}
                {/* <button className="px-4 py-2 bg-red-600 text-white rounded">Desativar 2FA</button> */}
            </div>
        );
    }
    if (step === "init") {
        return (
            <button onClick={startSetup} className="px-4 py-2 bg-pink-700 text-white rounded">
                Ativar autenticação em duas etapas
            </button>
        );
    }
    if (step === "validate") {
        return (
            <div className="flex flex-col justify-center items-center gap-4">
                <p>Escaneie o QR Code abaixo no Google Authenticator ou app similar:</p>
                {qrCode && <Image src={qrCode} alt="QR Code" width={200} height={200} />}
                <p className="text-xs">Ou digite o código manualmente: <span className="font-mono">{secret}</span></p>
                <input
                    type="text"
                    placeholder="Digite o código gerado"
                    value={totpCode}
                    onChange={e => setTotpCode(e.target.value)}
                    className="border px-2 py-1 rounded"
                />
                <button onClick={validateTotp} className="px-4 py-2 bg-pink-700 text-white rounded" disabled={loading}>
                    Validar código
                </button>
            </div>
        );
    }
    if (step === "done") {
        return <p className="text-green-600 font-semibold">2FA ativado com sucesso!</p>;
    }
    return null;
}
