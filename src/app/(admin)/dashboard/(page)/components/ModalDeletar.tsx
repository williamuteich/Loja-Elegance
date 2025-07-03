import Form from "@/components/Form";
import Submit from "@/components/Submit";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

interface ButtonDeleteProps {
    config: {
        id: string;
        title: string;
        description: string;
        apiEndpoint: string;
        urlRevalidate: string[]; // Alterado para array de strings
    }
}

export default function ButtonDelete({ config }: ButtonDeleteProps) {
    async function handleDelete(prevState: any, formData: FormData): Promise<{ success?: string; error?: string }> {
        "use server";

        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        const id = formData.get('id') as string;
        const apiEndpoint = formData.get('apiEndpoint') as string;

        let urlRevalidateRaw = formData.get('urlRevalidate') as string;
        let urlRevalidate: string[];

        try {
            // Garante que urlRevalidate sempre seja array
            const parsed = JSON.parse(urlRevalidateRaw);
            urlRevalidate = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
            urlRevalidate = [urlRevalidateRaw];
        }

        try {
            const response = await fetch(apiEndpoint, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieHeader,
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                return { error: "Erro ao excluir o conteúdo." };
            }

            // Revalida cada rota
            urlRevalidate.forEach((path) => revalidatePath(path));

            return { success: "Conteúdo excluído com sucesso!" };
        } catch (error) {
            console.error("Erro ao excluir conteúdo:", error);
            return { error: "Erro ao excluir conteúdo. Tente novamente mais tarde." };
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="bg-red-700 text-white hover:bg-red-600 font-semibold py-[6px] px-3 rounded-md transition duration-300 ease-in-out">
                    Excluir
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white gap-0">
                <Form action={handleDelete}>
                    {/* Campos ocultos com dados de configuração */}
                    <input type="hidden" name="id" value={config.id} />
                    <input type="hidden" name="apiEndpoint" value={config.apiEndpoint} />
                    <input type="hidden" name="urlRevalidate" value={JSON.stringify(config.urlRevalidate)} />
                    
                    <AlertDialogHeader>
                        <AlertDialogTitle>{config.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {config.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Submit className="bg-red-700 mt-4 text-white w-full hover:bg-red-600" >Excluir</Submit>
                    </AlertDialogFooter>
                </Form>
                <AlertDialogCancel className="bg-blue-800 hover:bg-blue-700 text-white hover:text-white">Fechar</AlertDialogCancel>
            </AlertDialogContent>
        </AlertDialog>
    );
}