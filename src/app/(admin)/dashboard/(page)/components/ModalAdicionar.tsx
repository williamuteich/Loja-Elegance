
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { revalidatePath } from "next/cache";

interface FieldConfig {
    name: string;
    label: string;
    placeholder?: string;
    type: "text" | "email" | "password" | "select";
    options?: { value: string; label: string }[];
}

interface ButtonAdicionarProps {
    config: {
        title: string;
        description: string;
        fields: FieldConfig[];
        apiEndpoint: string;
        urlRevalidate: string;
    };
}

export default function ButtonAdicionar({ config }: ButtonAdicionarProps) {
    async function newUser(formData: FormData) {
        "use server"
    
        const data = Object.fromEntries(formData.entries());
    
        const response = await fetch(config.apiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data), 
        });
    
        if (!response.ok) {
            console.log("Erro ao adicionar usuário.");
        }
    
        revalidatePath(config.urlRevalidate);
    }
    

    return (
        <div className="mb-6 w-full text-end">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700 font-semibold py-1 px-4 rounded-md transition duration-300 ease-in-out">
                        Adicionar
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{config.title}</DialogTitle>
                        <DialogDescription>{config.description}</DialogDescription>
                    </DialogHeader>
                    <form action={newUser} className="grid gap-4 py-4">
                        {config.fields.map((field) => (
                            <div key={field.name} className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor={field.name} className="text-right">
                                    {field.label}
                                </Label>
                                {field.type === "select" && field.options ? (
                                    <Select name={field.name}>
                                        <SelectTrigger className="w-auto">
                                            <SelectValue placeholder={field.placeholder} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>{field.label}</SelectLabel>
                                                {field.options.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        className="col-span-3"
                                    />
                                )}
                            </div>
                        ))}
                        <DialogFooter>
                            <Button type="submit">Adicionar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
