import { Button } from "@/components/ui/button";
import {
    AlertDialog,
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
import Form from "@/components/Form";
import Submit from "@/components/Submit";
import { ButtonAdicionarProps } from "@/utils/types/modaGeneric";
import { cookies } from "next/headers";

export default function ButtonAdicionar({ config, params  }: ButtonAdicionarProps) {

    async function newUser(prevState: any, formData: FormData): Promise<{ success?: string; error?: string }> {
        "use server";

        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        const data = Object.fromEntries(formData.entries());

        for (const [key, value] of Object.entries(data)) {
            if (!value) {
                return { error: `O campo ${key} não pode estar vazio.` }; 
            }
        }
        
        if (params) {
            data.id = params; 
        }

        try {
            const response = await fetch(config.apiEndpoint, {
                method: config.method,
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieHeader,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                return { error: "Erro ao adicionar conteúdo." };
            }

            revalidatePath(config.urlRevalidate);

            return { success: "Conteúdo adicionado com sucesso!" };
        } catch (error) {
            console.error("Erro ao adicionar conteúdo:", error);
            return { error: "Erro ao adicionar conteúdo. Tente novamente mais tarde." };
        }
    }

    return (
        <div className="w-full text-end">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    {config.action === "Adicionar" ? (
                        <Button variant="outline" className="bg-green-800 text-white hover:bg-green-600 font-semibold py-1 px-4 rounded-md transition duration-300 ease-in-out">
                            {config.action}
                        </Button>
                    ) : (
                        <Button className="bg-blue-800 text-white hover:bg-blue-700 font-semibold py-1 px-3 rounded-md transition duration-300 ease-in-out">
                            {config.action}
                        </Button>
                    )}
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{config.title}</AlertDialogTitle>
                        <AlertDialogDescription>{config.description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <div>
                        <Form action={newUser} className="grid gap-4 py-4 pb-0">
                            {config.fields.map((field) => (
                                <div key={field.name} className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor={field.name} className="text-right">
                                        {field.label}
                                    </Label>
                                    {field.type === "select" && field.options ? (
                                        <Select name={field.name} defaultValue={field.options[0].value || undefined}>
                                            <SelectTrigger className="w-[340px]">
                                                <SelectValue placeholder={field.placeholder} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup className="bg-white cursor-pointer">
                                                    <SelectLabel>{field.label}</SelectLabel>
                                                    {field.options.map((option) => (
                                                        <SelectItem key={option.value} value={option.value || "user"}>
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
                                <Submit className="bg-blue-800 w-full hover:bg-blue-700 text-white" type="submit">Salvar</Submit>
                            </AlertDialogFooter>
                        </Form>
                        <AlertDialogCancel className="bg-red-700 w-full text-white hover:bg-red-600 hover:textwhite hover:text-white">Fechar</AlertDialogCancel>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
