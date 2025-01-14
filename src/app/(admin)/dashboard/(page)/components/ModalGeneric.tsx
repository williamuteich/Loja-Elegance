import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
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
        id?: string;
        title: string;
        description: string;
        fields: FieldConfig[];
        apiEndpoint: string;
        urlRevalidate: string;
        method: string;
        action: string;
        initialValues?: { [key: string]: string };
    };
}

export default function ButtonAdicionar({ config }: ButtonAdicionarProps) {

    async function newUser(formData: FormData) {
        "use server";
    
        const data = Object.fromEntries(formData.entries());
    
        if (config.id) {
            data.id = config.id;
        }
    
        const response = await fetch(config.apiEndpoint, {
            method: `${config.method}`,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    
        if (!response.ok) {
            console.log("Erro ao adicionar Conteúdo.");
        }
    
        revalidatePath(config.urlRevalidate);
    }
    

    return (
        <div className="w-full text-end">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    {config.action === "Adicionar" ? (
                        <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700 font-semibold py-1 px-4 rounded-md transition duration-300 ease-in-out">
                            {config.action}
                        </Button>
                    ) : (
                        <Button className="bg-blue-500 text-white hover:bg-blue-600 font-semibold py-1 px-3 rounded-md transition duration-300 ease-in-out">
                            {config.action}
                        </Button>
                    )}
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{config.title}</AlertDialogTitle>
                        <AlertDialogDescription>{config.description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <form action={newUser} className="grid gap-4 py-4">
                        {config.fields.map((field) => (
                            <div key={field.name} className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor={field.name} className="text-right">
                                    {field.label}
                                </Label>
                                {field.type === "select" && field.options ? (
                                    <Select  name={field.name} defaultValue={field.options[0].value}>
                                        <SelectTrigger className="w-[340px]">
                                            <SelectValue placeholder={field.placeholder} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup className="bg-white cursor-pointer">
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
                                        defaultValue={config.initialValues?.[field.name]}
                                        className="col-span-3"
                                    />
                                )}
                            </div>
                        ))}
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction type="submit">Salvar</AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
