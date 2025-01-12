import Link from "next/link";
import LinksMenu from "./components/LinksMenu";
import HeaderActions from "./components/HeaderActions";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Header() {
  return (
    <header className="w-full z-50">
      <div className="bg-pink-500">
        <div className="max-w-[1400px] py-1 mx-auto px-4 font-medium text-center sm:px-6 lg:px-8 text-white">
          Frete Grátis para compras acima de R$ 100,00
        </div>
      </div>
      <div className="bg-white text-gray-900 font-bold shadow-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 pb-2">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-3xl font-bold text-pink-600 hover:text-pink-800 transition-all monsieur-la-doulaise-regular"
              >
                Elegance
              </Link>
            </div>
            <LinksMenu />
            <HeaderActions />
            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                      Make changes to your profile here. Click save when you're done.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Username
                      </Label>
                      <Input id="username" defaultValue="@peduarte" className="col-span-3" />
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button type="submit">Save changes</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>

          </div>
        </div>
      </div>


    </header>
  );
}
