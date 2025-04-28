import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import ModalCategoriaClient from "./ModalCategoriaClient";

export default function ModalCategoria({ config, params }: { config: any, params?: string }) {
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
                        <ModalCategoriaClient config={config} params={params} initialValues={config.initialValues} />
                        <AlertDialogCancel className="bg-red-700 w-full text-white hover:bg-red-600 hover:textwhite hover:text-white">Fechar</AlertDialogCancel>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
