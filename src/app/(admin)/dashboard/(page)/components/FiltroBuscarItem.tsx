"use client"

import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export function FiltroBuscarItem() {

  const [statusFilter, setStatusFilter] = useState<string>("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleChangeStatus(value: string) {
    const params = new URLSearchParams(searchParams);

    if (value){
      params.set("status", value);
    }else {
      params.delete("status");
    }

    setStatusFilter(value);
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter size={16} /> Filtrar
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-16 bg-white">
        <DropdownMenuLabel>Filtrar Por:</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={statusFilter} onValueChange={handleChangeStatus}>
          <DropdownMenuRadioItem value="">
            Todos
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="true">
            Ativo
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="false">
            Inativo
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
