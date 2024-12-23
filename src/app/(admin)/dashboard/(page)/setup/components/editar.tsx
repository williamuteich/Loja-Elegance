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

interface ButtonEditarProps {
    config: {
        id: string;
        type: string;
        name: string;
        url?: string;
        value?: string;
    };
}

export default function ButtonEditar({ config }: ButtonEditarProps) {
    const [editedType, setEditedType] = useState(config.type);
    const [editedName, setEditedName] = useState(config.name);
    const [editedUrl, setEditedUrl] = useState(config.url || '');
    const [editedValue, setEditedValue] = useState(config.value || '');

    const handleSave = async () => {
        if (!editedType || !editedName) {
            alert("Preencha os campos variável e nome!");
            return;
        }

        const response = await fetch(`/api/setup`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: config.id,
                type: editedType,
                name: editedName,
                url: editedUrl,
                value: editedValue
            })
        });

        console.log(response);

        if (response.ok) {
            alert("Configuração atualizada com sucesso!");
            window.location.reload();
        } else {
            alert("Erro ao atualizar configuração.");
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 text-white hover:bg-blue-600 font-semibold py-1 px-3 rounded-md transition duration-300 ease-in-out">Editar</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Editar Configuração</DialogTitle>
                    <DialogDescription>
                        Faça alterações na variável, nome, URL e valor abaixo.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Variável
                        </Label>
                        <Input 
                            id="type" 
                            value={editedType} 
                            onChange={(e) => setEditedType(e.target.value)} 
                            placeholder="Digite o nome da variável" 
                            className="col-span-3" 
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nome
                        </Label>
                        <Input 
                            id="name" 
                            value={editedName} 
                            onChange={(e) => setEditedName(e.target.value)} 
                            placeholder="Digite o nome" 
                            className="col-span-3" 
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="url" className="text-right">
                            URL
                        </Label>
                        <Input 
                            id="url" 
                            value={editedUrl} 
                            onChange={(e) => setEditedUrl(e.target.value)} 
                            placeholder="Digite a URL" 
                            className="col-span-3" 
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="value" className="text-right">
                            Valor
                        </Label>
                        <Input 
                            id="value" 
                            value={editedValue} 
                            onChange={(e) => setEditedValue(e.target.value)} 
                            placeholder="Digite o valor" 
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
