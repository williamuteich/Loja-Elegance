import { Truck } from "lucide-react";
import { Container } from "../../components/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Rastreamento() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center">
        <div className="min-h-screen p-12 w-1/2">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2">
              <Truck className="w-8 h-8 text-black" aria-hidden="true" />
              <h1 className="text-2xl font-bold tracking-wide text-black">
                RASTREAR PEDIDO
              </h1>
            </div>
            <p className="mt-2 text-gray-600 text-sm">
              Insira o código de rastreio que você recebeu por e-mail. Com ele, você poderá acompanhar a localização e o status da sua encomenda em tempo real.
            </p>
            <p className="mt-2 text-gray-500 text-xs">
              Se você não encontrou o código, verifique sua caixa de entrada ou entre em contato com o suporte.
            </p>
          </div>
          <form className="mt-6 w-full">
            <Input
              className="w-full h-12 px-4 text-sm border border-gray-300 rounded focus:outline-none focus:ring focus:ring-black"
              placeholder="Código de rastreio"
              aria-label="Código de rastreio"
            />
            <Button
              type="submit"
              className="w-full h-12 mt-4 text-sm font-bold text-white uppercase bg-black hover:bg-gray-800"
              aria-label="Rastrear pedido"
            >
              RASTREAR
            </Button>
          </form>
        </div>
      </div>
    </Container>
  );
}
