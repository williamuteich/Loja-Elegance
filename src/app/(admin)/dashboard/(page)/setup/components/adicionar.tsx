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

export default function ButtonAdicionar() {
    const [type, setType] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [value, setValue] = useState<string>("");

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (!type || !name) {
            alert("Preencha os campos Variável e Nome!");
            return;
        }

        const response = await fetch(`/api/setup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type,
                name,
                url,
                value,
            })
        });

        if (response.status === 201) {
            alert("Configuração adicionada com sucesso!");
            window.location.reload();
        } else {
            alert("Erro ao adicionar configuração.");
        }
    }

    return (
        <div className="mb-6 w-full text-end">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700 font-semibold py-1 px-4 rounded-md transition duration-300 ease-in-out">Adicionar</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Adicionar novo conteúdo</DialogTitle>
                        <DialogDescription>
                            Preencha os campos abaixo para adicionar uma nova variável com seu respectivo nome e valor. Esses dados serão utilizados para personalizar a configuração do seu site.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Variável
                            </Label>
                            <Input 
                                id="type" 
                                placeholder="Digite o nome da variável" 
                                className="col-span-3" 
                                value={type}
                                onChange={(e) => setType(e.target.value)} 
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nome
                            </Label>
                            <Input 
                                id="name" 
                                placeholder="Digite o nome" 
                                className="col-span-3" 
                                value={name}
                                onChange={(e) => setName(e.target.value)} 
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="url" className="text-right">
                                URL
                            </Label>
                            <Input 
                                id="url" 
                                placeholder="Digite a URL" 
                                className="col-span-3" 
                                value={url}
                                onChange={(e) => setUrl(e.target.value)} 
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="value" className="text-right">
                                Valor
                            </Label>
                            <Input 
                                id="value" 
                                placeholder="Digite o valor" 
                                className="col-span-3" 
                                value={value}
                                onChange={(e) => setValue(e.target.value)} 
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleSubmit}>Adicionar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
