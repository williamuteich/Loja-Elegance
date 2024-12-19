"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ButtonAdicionar() {

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const question = document.getElementById("question") as HTMLInputElement;
        const response = document.getElementById("response") as HTMLInputElement;

        if (!question.value || !response.value) {
            alert("Preencha todos os campos!");
            return;
        }

        const data = await fetch(`/api/faq`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question: question.value,
                response: response.value
            })
        });

        if(data.status === 201) {
            alert("Pergunta frequente adicionada com sucesso!");
            window.location.reload();
        } else {
            alert("Erro ao adicionar pergunta frequente.");
        }
    }

    return (
        <div className="mb-6 px-6 w-full text-end">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700 font-semibold py-2 px-6 rounded-md transition duration-300 ease-in-out">Adicionar</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Adicionar Pergunta Frequente</DialogTitle>
                        <DialogDescription>
                            Preencha os campos abaixo para adicionar uma nova pergunta frequente à plataforma.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="question" className="text-right">
                                Pergunta
                            </Label>
                            <Input id="question" placeholder="Digite a pergunta" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="response" className="text-right">
                                Resposta
                            </Label>
                            <Input id="response" placeholder="Digite a resposta" className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleSubmit}>Adicionar FAQ</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
