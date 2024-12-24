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
import { useState } from "react"

interface ButtonEditarProps {
    config: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

export default function ButtonEditar({ config }: ButtonEditarProps) {
    const [editedName, setEditedName] = useState(config.name);
    const [editedEmail, setEditedEmail] = useState(config.email);
    const [editedRole, setEditedRole] = useState(config.role);
    const [editedPassword, setEditedPassword] = useState<string>("");

    const handleSave = async () => {
        if (!editedName || !editedEmail || !editedRole || !editedPassword) {
            alert("Preencha todos os campos!");
            return;
        }

        const response = await fetch(`/api/user`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: config.id,
                name: editedName,
                email: editedEmail,
                role: editedRole,
                password: editedPassword,
            }),
        });

        if (response.ok) {
            alert("Usuário atualizado com sucesso!");
            window.location.reload();
        } else {
            alert("Erro ao atualizar o usuário.");
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 text-white hover:bg-blue-600 font-semibold py-1 px-3 rounded-md transition duration-300 ease-in-out">
                    Editar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Editar Usuário</DialogTitle>
                    <DialogDescription>
                        Faça alterações nas informações do usuário abaixo.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nome
                        </Label>
                        <Input
                            id="name"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)} 
                            placeholder="Digite o nome do usuário"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            E-mail
                        </Label>
                        <Input
                            id="email"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)} 
                            placeholder="Digite o e-mail do usuário"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Permissão
                        </Label>
                        <Select value={editedRole} onValueChange={(value) => setEditedRole(value)}>
                            <SelectTrigger className="w-auto">
                                <SelectValue placeholder="Selecione a permissão" />
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
                            value={editedPassword}
                            onChange={(e) => setEditedPassword(e.target.value)}
                            placeholder="Digite a nova senha"
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSave}>Salvar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
