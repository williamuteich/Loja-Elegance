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

export default function ButtonAdicionar({data}: any) {

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        console.log(data);
    }

    return (
        <div className="mb-6 w-full text-end">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700 font-semibold py-1 px-4 rounded-md transition duration-300 ease-in-out">+</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Adicionar conteúdo</DialogTitle>
                        <DialogDescription>
                            Preencha os campos abaixo para adicionar um novo valor.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="question" className="text-right">
                                nome
                            </Label>
                            <Input id="question" placeholder="Digite a pergunta" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="response" className="text-right">
                                valor
                            </Label>
                            <Input id="response" placeholder="Digite a resposta" className="col-span-3" />
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
