import { Button } from "@/components/ui/button";

import { Formulario } from "@/utils/types/formulario";
import { useRouter } from 'next/navigation'

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EnvForm({ formulario, resposta }: { formulario: Formulario; resposta: string }) {
    const router = useRouter();

    const handleEnviarResposta = async () => {
        if (!resposta) {
            toast.error("Campo de Resposta está vázio.",{
                position: "top-center",
                autoClose: 1000,
            });
            return;
        }

        const res = await fetch(`/api/email/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                formulario, resposta,
            })
        })

        if (!res.ok) {
            toast.error("Erro ao enviar a resposta.", {
                position: "top-center",
                autoClose: 3000,
            })
            return;
        }

        toast.success("Resposta enviada com sucesso.", {
            position: "top-center",
            autoClose: 2000,
        });
        setTimeout(() => {
            router.push(`/dashboard/formulario`)
        }, 3000);
    };

    return (
        <>
            <ToastContainer />
            <Button
                variant="outline"
                className="bg-green-800 text-white hover:bg-green-600"
                onClick={handleEnviarResposta}
            >
                Enviar Resposta
            </Button>
        </>
    );
}
