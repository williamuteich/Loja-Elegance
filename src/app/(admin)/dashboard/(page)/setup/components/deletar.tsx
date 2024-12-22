"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export default function ButtonDelete({ id }: { id: string }) {
    const handleDelete = async () => {

        const response = await fetch(`/api/setup`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        })

        if (!response.ok) {
            alert("Erro ao deletar a variável")
        }

        alert("Variável deletada com sucesso!");
        window.location.reload();
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="bg-red-500 text-white hover:bg-red-600 font-semibold py-[6px] px-3 rounded-md transition duration-300 ease-in-out">
                    Excluir
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza de que deseja excluir esta variável?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação irá remover permanentemente a variável do seu site. Isso pode afetar a configuração do seu site, como URLs ou nomes,
                        e pode causar erros em partes do sistema que dependem dessa variável.
                        <br />
                        Certifique-se de que não há dependências antes de prosseguir com a exclusão.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Excluir Variável</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
