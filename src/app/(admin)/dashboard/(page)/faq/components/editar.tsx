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
import { useState } from "react"

interface ButtonEditProps {
    id: string;
    question: string;
    response: string;
}

export default function ButtonEditar({ id, question, response }: ButtonEditProps) {
    const [editedQuestion, setEditedQuestion] = useState(question);
    const [editedResponse, setEditedResponse] = useState(response);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === "question") {
            setEditedQuestion(value);
        } else if (id === "response") {
            setEditedResponse(value);
        }
    }

    const handleSave = async () => {
        console.log("Salvando FAQ:", id, editedQuestion, editedResponse);
        const response = await fetch('/api/faq', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({id, question: editedQuestion, response: editedResponse}),
        })

        if(!response.ok) {
            alert("Erro ao atualizar a FAQ");
        }

        alert("FAQ atualizada com sucesso!");
        window.location.reload();
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 text-white hover:bg-blue-600 font-semibold py-1 px-3 rounded-md transition duration-300 ease-in-out">Editar</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Editar Pergunta Frequente</DialogTitle>
                    <DialogDescription>
                        Faça alterações na pergunta e resposta abaixo.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="question" className="text-right">
                            Pergunta
                        </Label>
                        <Input 
                            id="question" 
                            value={editedQuestion} 
                            onChange={handleChange} 
                            placeholder="Digite a pergunta" 
                            className="col-span-3" 
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="response" className="text-right">
                            Resposta
                        </Label>
                        <Input 
                            id="response" 
                            value={editedResponse} 
                            onChange={handleChange} 
                            placeholder="Digite a resposta" 
                            className="col-span-3" 
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSave}>Salvar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
