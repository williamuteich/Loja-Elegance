import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const items = [
  { label: "Camiseta", value: "camiseta" },
  { label: "Calça", value: "calca" },
  { label: "Tênis", value: "tenis" },
  { label: "Boné", value: "bone" },
  { label: "Mochila", value: "mochila" },
  // Adicione mais itens conforme necessário
];

export default function SearchHeaderItems() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

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
        className="sm:w-[550px] sm:max-w-[550px] w-[330px] top-24 bg-white [&>button]:hidden p-0"
        style={{ borderRadius: "8px" }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only">Pesquisar em Nossa Loja</DialogTitle>
          <DialogDescription className="sr-only">
            Encontre os produtos que você deseja em nossa loja. Utilize a barra de pesquisa para buscar.
          </DialogDescription>
        </DialogHeader>
        <div className="flex relative items-start justify-start py-0 gap-4 text-2xl ">
          <Command className="w-full">
            <CommandInput
              placeholder="Pesquisar em Nossa Loja"
              className="w-full text-gray-600 font-normal rounded-lg bg-background  border-none shadow-none"
              style={{ fontSize: "1.1rem" }}
              value={value}
              onValueChange={setValue}
            />
            {/* Só exibe a lista de sugestões se houver valor no campo */}
            <div className="absolute top-12 -left-[1px] sm:w-[550px] sm:max-w-[550px] w-[330px] rounded-sm px-6 z-10 bg-white" style={{ borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }}
            >
            {value && (
              <CommandList>
                {items.filter((item) => item.label.toLowerCase().includes(value.toLowerCase())).length === 0 ? (
                  <CommandEmpty>No items found.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {items
                      .filter((item) =>
                        item.label.toLowerCase().includes(value.toLowerCase())
                      )
                      .map((item) => (
                        <CommandItem key={item.value}>{item.label}</CommandItem>
                      ))}
                  </CommandGroup>
                )}
              </CommandList>
            )}
            </div>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  );
}
