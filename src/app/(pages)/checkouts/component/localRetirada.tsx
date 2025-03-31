import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function LocalRetirada() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const pickupLocations = [
    {
      id: "retirada",
      label: "Ney da Gama Ahrends, 706 - Centro, São José - SC, 88110-001",
      category: "Retiro en tienda"
    },
    {
      id: "op1",
      label: "Avenida 18 de Julio, 1300 - Montevideo, Uruguay",
      category: "Otras opciones"
    },
    {
        id: "op2",
        label: "Avenida 18 de Julio, 1300 - Montevideo, Uruguay",
        category: "Otras opciones"
      },
      {
        id: "op3",
        label: "Avenida 18 de Julio, 1300 - Montevideo, Uruguay",
        category: "Otras opciones"
      },
      {
        id: "op4",
        label: "Avenida 18 de Julio, 1300 - Montevideo, Uruguay",
        category: "Otras opciones"
      },
  ];

  return (
    <div className="px-4 sm:px-6 pb-4 flex flex-col gap-4 max-w-3xl mx-auto">
 
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-3 mb-2">
            Retiro en tienda
          </h2>
          
          {pickupLocations
            .filter(loc => loc.category === "Retiro en tienda")
            .map((location) => (
              <div 
                key={location.id}
                className={`flex items-start space-x-2 p-2 rounded-lg transition-colors
                  ${selectedOption === location.id 
                    ? 'bg-pink-50 border border-pink-200' 
                    : 'hover:bg-gray-50'}`}
              >
                <Checkbox
                  id={location.id}
                  checked={selectedOption === location.id}
                  onCheckedChange={(checked) => {
                    setSelectedOption(checked ? location.id : null);
                  }}
                  className="mt-1 w-6 h-6 border-2 border-gray-300 rounded-lg checked:bg-pink-600 checked:border-pink-600"
                />
                <label
                  htmlFor={location.id}
                  className="flex-1 text-base leading-tight text-gray-700 cursor-pointer"
                >
                  {location.label}
                  <span className="block mt-1 text-sm text-gray-500">
                    Horario de atención: 09:00 - 18:00
                  </span>
                </label>
              </div>
            ))}
        </div>
      </div>

      {/* Card Otras opciones */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
  <div className="flex flex-col gap-4">
    <h2 className="text-xl font-semibold text-gray-900 border-b pb-3 mb-2">
      Otras opciones para retirar
    </h2>

    {/* Contêiner com rolagem sempre visível */}
    <div className="space-y-3 max-h-[205px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
      {pickupLocations
        .filter((loc) => loc.category === "Otras opciones")
        .map((location) => (
          <div
            key={location.id}
            className={`flex items-start space-x-3 p-4 rounded-lg transition-colors
              ${selectedOption === location.id
                ? 'bg-pink-50 border border-pink-200'
                : 'hover:bg-gray-50'}`}
          >
            <Checkbox
              id={location.id}
              checked={selectedOption === location.id}
              onCheckedChange={(checked) => {
                setSelectedOption(checked ? location.id : null);
              }}
              className="mt-1 w-6 h-6 border-2 border-gray-300 rounded-lg checked:bg-pink-600 checked:border-pink-600"
            />
            <label
              htmlFor={location.id}
              className="flex-1 text-base leading-tight text-gray-700 cursor-pointer"
            >
              {location.label}
              <span className="block mt-1 text-sm text-gray-500">
                Horario de atención: 10:00 - 20:00
              </span>
            </label>
          </div>
        ))}
    </div>
  </div>
</div>

    </div>
  );
}