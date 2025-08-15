"use client";
import Image from "next/image";
import { useDebouncedCallback } from "use-debounce";
import { Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface SearchHeaderItemsProps {
  initialProducts: any[];
}

export default function SearchHeaderItems({ initialProducts = [] }: SearchHeaderItemsProps) {
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
  const [searchTerm, setSearchTerm] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleChange = useDebouncedCallback((searchString: string) => {
    if (searchString) {
      setLoading(true);

      const filtered = initialProducts.filter((produto) =>
        produto.name.toLowerCase().includes(searchString.toLowerCase()) &&
        produto.active &&
        produto.variants.some((variant: any) =>
          variant.stock && variant.stock.quantity > 0
        )
      );

      setFilteredProducts(filtered);
      setLoading(false);
      setOpen(true);
    } else {
      setFilteredProducts([]);
      setOpen(false);
    }
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleChange(value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={resultsRef}>
      <div className="relative">
        <Search className="absolute left-4 top-2 h-5 w-5 text-gray-400" />
        <input
          type="search"
          className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-white text-gray-800 border border-gray-300 shadow-sm outline-none focus:ring-1 focus:ring-red-500 placeholder:text-gray-400"
          placeholder="Buscar produtos..."
          onChange={handleInputChange}
          value={searchTerm}
          onFocus={() => searchTerm && setOpen(true)}
        />
        {loading && (
          <div className="absolute right-4 top-2.5">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 animate-spin fill-red-500"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M100 50.6C100 78.2 77.6 100.6 50 100.6C22.4 100.6 0 78.2 0 50.6C0 23 22.4 0.6 50 0.6C77.6 0.6 100 23 100 50.6Z" fill="currentColor" />
              <path d="M93.968 39.041C96.393 38.404 97.862 35.912 97.008 33.554C95.293 28.823 92.871 24.369 89.817 20.348C85.845 15.119 80.883 10.724 75.212 7.413C69.542 4.102 63.275 1.94 56.77 1.051C51.767 0.368 46.698 0.447 41.735 1.279C39.261 1.693 37.813 4.198 38.45 6.623C39.087 9.049 41.569 10.472 44.051 10.107C47.851 9.549 51.719 9.527 55.54 10.049C60.864 10.777 65.993 12.546 70.633 15.255C75.274 17.965 79.335 21.562 82.585 25.841C84.918 28.912 86.8 32.291 88.181 35.876C89.083 38.216 91.542 39.678 93.968 39.041Z" fill="currentFill" />
            </svg>
          </div>
        )}
      </div>

      {/* Resultados da busca */}
      {open && filteredProducts.length > 0 && !loading && (
        <div className="absolute top-12 left-0 w-full z-20 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-100">
            {filteredProducts.map((item) => {
              const totalStock = item.variants.reduce((sum, v) => sum + (v.stock?.quantity || 0), 0);
              const inStock = totalStock > 0;
              const stockLabel = inStock ? (totalStock > 1 ? `${totalStock} disponíveis` : "Última unidade") : "Indisponível";
              const stockColor = inStock
                ? totalStock > 1 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-700";

              return (
                <Link
                  href={`/produtos/${item.id}`}
                  key={item.id}
                  onClick={() => {
                    setOpen(false);
                    setSearchTerm("");
                  }}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 transition"
                >
                  {item.imagePrimary ? (
                    <Image
                      src={item.imagePrimary}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-[50px] h-[50px] bg-gray-200 flex items-center justify-center rounded-md text-gray-500 text-xs font-medium">
                      Sem imagem
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <h2 className="text-sm font-semibold text-gray-800 truncate max-w-[220px]">
                      {item.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-red-600">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.price)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stockColor}`}>
                        {stockLabel}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
