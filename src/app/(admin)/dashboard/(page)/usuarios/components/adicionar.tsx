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

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { revalidatePath } from "next/cache"

export default function ButtonAdicionar() {

    async function newUser(formData: FormData) {
        'use server'

        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            role: formData.get('role'),
            password: formData.get('password'),
        }

        const response = await fetch(`http://localhost:3000/api/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                role: data.role,
                password: data.password,
            })
        });

        if (!response.ok) { 
            console.log("Erro ao adicionar usuário.");
        }
        
        revalidatePath('/dashboard/usuarios');
    }

    return (
        <div className="mb-6 w-full text-end">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700 font-semibold py-1 px-4 rounded-md transition duration-300 ease-in-out">Adicionar</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Adicionar novos usuários</DialogTitle>
                        <DialogDescription>
                            Preencha os campos abaixo para adicionar um novo usuário. Esse poderá personalizar e configurar seu site.
                        </DialogDescription>
                    </DialogHeader>
                    <form action={newUser} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nome
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Digite o nome do usuário"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                placeholder="Digite o email"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Permissões
                            </Label>
                            <Select name="role">
                                <SelectTrigger className="w-auto">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Permissões</SelectLabel>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="colaborador">Colaborador</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Senha
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Digite uma senha"
                                className="col-span-3"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Adicionar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
