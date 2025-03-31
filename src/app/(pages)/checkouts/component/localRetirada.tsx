import { Checkbox } from "@/components/ui/checkbox";

export default function LocalRetirada() {
    return (
        <div className="px-6 flex flex-col gap-4">
            <div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-base font-bold">Retiro en tienda</h1>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            className="w-6 h-6 border-2 border-gray-300 rounded-lg bg-white checked:bg-pink-800 checked:border-pink-800 checked:ring-0 focus:ring-0 transition-all duration-300"
                        />
                        <label
                            htmlFor="terms"
                            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Ney da Gama Ahrends, 706 - Centro, São José - SC, 88110-001
                        </label>
                    </div>
                </div>
            </div>
            <div>
                <h1 className="text-base font-bold">Otras opciones para retirar</h1>
                <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms2"
                            className="w-6 h-6 border-2 border-gray-300 rounded-lg bg-white checked:bg-pink-800 checked:border-pink-800 checked:ring-0 focus:ring-0 transition-all duration-300"
                        />
                        <label
                            htmlFor="terms2"
                            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Avenida 18 de Julio, 1300 - Montevideo, Uruguay
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms3"
                            className="w-6 h-6 border-2 border-gray-300 rounded-lg bg-white checked:bg-pink-800 checked:border-pink-800 checked:ring-0 focus:ring-0 transition-all duration-300"
                        />
                        <label
                            htmlFor="terms3"
                            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Calle Colón, 1234 - Montevideo, Uruguay
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms4"
                            className="w-6 h-6 border-2 border-gray-300 rounded-lg bg-white checked:bg-pink-800 checked:border-pink-800 checked:ring-0 focus:ring-0 transition-all duration-300"
                        />
                        <label
                            htmlFor="terms4"
                            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Av. Italia, 2500 - Montevideo, Uruguay
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms5"
                            className="w-6 h-6 border-2 border-gray-300 rounded-lg bg-white checked:bg-pink-800 checked:border-pink-800 checked:ring-0 focus:ring-0 transition-all duration-300"
                        />
                        <label
                            htmlFor="terms5"
                            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Calle Cerrito, 456 - Montevideo, Uruguay
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms6"
                            className="w-6 h-6 border-2 border-gray-300 rounded-lg bg-white checked:bg-pink-800 checked:border-pink-800 checked:ring-0 focus:ring-0 transition-all duration-300"
                        />
                        <label
                            htmlFor="terms6"
                            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Rambla República del Perú, 7000 - Montevideo, Uruguay
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
