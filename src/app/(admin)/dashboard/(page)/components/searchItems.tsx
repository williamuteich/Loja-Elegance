"use client";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function SearchItems() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleChange = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams);
        const searchString = e.target.value;
    
        if (searchString) {
            params.set("search", searchString);
            params.delete("page");
        } else {
            params.delete("search");
        }
    
        replace(`${pathname}?${params.toString()}`);
    }, 600);

    return (
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                type="search" 
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                placeholder="Pesquisar" 
                onChange={handleChange}
            />
        </div>
    );
}
