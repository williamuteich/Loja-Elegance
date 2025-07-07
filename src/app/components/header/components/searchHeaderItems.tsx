"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Command,
  CommandGroup,
  CommandList,
} from "@/components/ui/command";
import Image from "next/image";
import { useDebouncedCallback } from "use-debounce";
import { Search } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

interface SearchHeaderItemsProps {
  initialProducts: any[];
}

export default function SearchHeaderItems({ initialProducts = [] }: SearchHeaderItemsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  interface Product {
    id: string;
    name: string;
    imagePrimary: string;
    price: number;
    active: boolean; 
    variants: {
      stock: {
        quantity: number;
      };
    }[];
  }

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams);
    const searchString = e.target.value;

    if (searchString) {
      setLoading(true);
      params.set("search", searchString);
      
      const filtered = initialProducts.filter((produto) => 
        produto.name.toLowerCase().includes(searchString.toLowerCase()) &&
        produto.active && 
        produto.variants.some((variant: any) => 
          variant.stock && variant.stock.quantity > 0
        )
      );
      
      setFilteredProducts(filtered);
      setLoading(false);
    } else {
      setFilteredProducts([]);
      params.delete("search");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Buscar en nuestra tienda"
          className="cursor-pointer hover:text-pink-600 transition-colors"
        >
          <Search className="w-6 h-6" />
        </button>
      </DialogTrigger>

      <DialogContent
        className="sm:w-[700px] sm:max-w-[700px] w-[330px] top-24 bg-white [&>button]:hidden p-0"
        style={{ borderRadius: "8px" }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only">Buscar en nuestra tienda</DialogTitle>
          <DialogDescription className="sr-only">
            Encuentra los productos que deseas en nuestra tienda. Usa la barra de búsqueda para buscar.
          </DialogDescription>
        </DialogHeader>
        <div className="flex relative items-start justify-start py-0 gap-4 text-2xl">
          <Command className="w-full">
            <div className="relative">
              <Search color="#525252" className="absolute left-4 top-5 h-6 w-6 text-muted-foreground" />
              <input
                type="search"
                className="w-full mx-8 p-4 font-normal rounded-lg bg-background border-none shadow-none outline-none focus:outline-none focus:ring-0 hover:outline-none placeholder:text-gray-800 placeholder:text-sm"
                style={{ fontSize: "1.0rem" }}
                placeholder="Buscar en nuestra tienda"
                onChange={handleChange}
              />
              {loading && (
                <div className="absolute bg-white right-4 top-1/2 transform z-10 -translate-y-1/2">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Cargando...</span>
                  </div>
                </div>
              )}
            </div>

            {filteredProducts.length > 0 && !loading ? (
              <div className="absolute px-2 top-14 -left-[1px] sm:w-[700px] sm:max-w-[700px] w-[330px] rounded-sm z-10 bg-white shadow-lg">
                <CommandList>
                  <CommandGroup>
                    {filteredProducts.map((item) => (
                      <Link
                        href={`/produtos/${item.id}`}
                        key={item.id} 
                        onClick={() => setOpen(false)}
                        className="flex gap-4 items-start border-t-[1px] border-gray-300 pt-3"
                      >
                        {item.imagePrimary ? (
                          <Image src={item.imagePrimary} alt={item.name} width={75} height={75} quality={100} />
                        ) : (
                          <div className="w-[75px] h-[75px] bg-gray-100 flex items-center justify-center rounded-lg text-gray-500 text-xs font-medium">
                            Sem imagem
                          </div>
                        )}

                        <div className="flex flex-col gap-0 w-full px-4">
                          <h2 className="text-base uppercase font-bold">{item.name}</h2>
                          <span className="text-base font-medium uppercase flex items-end gap-2 mb-2 w-full">
                             {new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU" }).format(item.price)}
                            <div
                              className={`mt-2 text-xs font-semibold text-white ${item.variants.some((variant: any) => variant.stock && variant.stock.quantity > 0)
                                ? item.variants.reduce((total: number, variant: any) => total + (variant.stock?.quantity || 0), 0) > 1
                                  ? "bg-green-700"
                                  : "bg-yellow-700"
                                : "bg-red-700 text-white"
                                } px-2 py-1 rounded-md w-max`}
                            >
                              {item.variants.some((variant: any) => variant.stock && variant.stock.quantity > 0)
                                ? item.variants.reduce((total: number, variant: any) => total + (variant.stock?.quantity || 0), 0) > 1
                                  ? `${item.variants.reduce((total: number, variant: any) => total + (variant.stock?.quantity || 0), 0)} Disponíveis`
                                  : "Última Unidade"
                                : "Indisponível"}
                            </div>
                          </span>
                        </div>
                      </Link>
                    ))}
                  </CommandGroup>
                </CommandList>
              </div>
            ) : null}
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  );
}
