"use client";
import MenuSuspenso from "./menuSuspenso";

interface ClientHeaderProps {
  initialProducts: any[];
}

export default function ClientHeader({ initialProducts }: ClientHeaderProps) {
  return (
    <header className="w-full z-50 bg-black">
      <MenuSuspenso initialProducts={initialProducts} />
    </header>
  );
}