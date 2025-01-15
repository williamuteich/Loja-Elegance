import { Truck } from "lucide-react";
import { Container } from "../../components/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Rastreamento() {
  return (
    <>
      <Container>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2">
              <Truck className="w-8 h-8 text-black" aria-hidden="true" />
              <h1 className="text-2xl font-bold tracking-wide text-black">
                RASTREAR PEDIDO
              </h1>
            </div>
            <p className="mt-2 text-gray-600 text-sm">
              Insira o código que você recebeu por e-mail.
            </p>
          </div>
          <form className="mt-6 w-full max-w-sm">
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
      </Container>
    </>
  );
}
