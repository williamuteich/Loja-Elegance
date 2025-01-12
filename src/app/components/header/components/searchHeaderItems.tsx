import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchHeaderItems() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded="false"
          className="cursor-pointer hover:text-pink-600 transition-colors"
        >
          <Search className="w-6 h-6" />
        </button>
      </DialogTrigger>
      <DialogContent
        className="sm:w-[550px] sm:max-w-[550px] w-[330px] top-24 bg-white [&>button]:hidden p-3"
        style={{ borderRadius: "8px" }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only">Pesquisar em Nossa Loja</DialogTitle>
          <DialogDescription className="sr-only">
            Encontre os produtos que você deseja em nossa loja. Utilize a barra de pesquisa para buscar.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-start py-0 gap-4 text-2xl">
          <Search className="h-7 w-7 text-gray-500" />
          <Input
            type="search"
            className="w-full text-gray-600 font-normal rounded-lg bg-background pl-0 border-none shadow-none"
            style={{ fontSize: '1.1rem' }}
            placeholder="Pesquisar em Nossa Loja"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
