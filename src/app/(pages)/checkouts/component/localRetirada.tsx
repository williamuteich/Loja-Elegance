"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface LocalRetiradaProps {
  setSelectedPickupLocation: (location: { id: string; title: string } | null) => void;
}

interface SelectedPickupLocation {
  id: string;
  title: string;
  description?: string;
  category: string;
}

export default function LocalRetirada({ setSelectedPickupLocation }: LocalRetiradaProps) {
  const [selectedOption, setSelectedOption] = useState<SelectedPickupLocation | null>(null);
  const [pickupLocations, setPickupLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedOptionStr = localStorage.getItem("selectedPickupLocation");
    if (savedOptionStr) {
      try {
        const savedOption: SelectedPickupLocation = JSON.parse(savedOptionStr);
        setSelectedOption(savedOption);
      } catch (error) {
        console.error("Erro ao parsear selectedPickupLocation", error);
      }
    }

    const fetchPickupLocations = async () => {
      try {
        const response = await fetch("/api/privada/delivery");
        const data = await response.json();
 
        setPickupLocations(data.pickupLocations || []);
      } catch (error) {
        console.error("Erro ao buscar as opções de retirada", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPickupLocations();
  }, []);

  useEffect(() => {
    if (selectedOption) {
      localStorage.setItem("selectedPickupLocation", JSON.stringify(selectedOption));
    } else {
      localStorage.removeItem("selectedPickupLocation");
    }
    setSelectedPickupLocation(selectedOption);
  }, [selectedOption, setSelectedPickupLocation]);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 pb-4 flex flex-col gap-4 max-w-3xl mx-auto">
        <div className="text-center py-8">
          <h2 className="text-lg font-semibold text-gray-600">Cargando opções...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 pb-4 flex flex-col gap-4 max-w-3xl mx-auto">
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-3 mb-2">
            Retiro en tienda
          </h2>
          {pickupLocations
            .filter((loc) => loc.category === "Retiro en tienda")
            .map((location) => (
              <div
                key={location.id}
                className={`flex items-start space-x-2 p-2 rounded-lg transition-colors
                  ${
                    selectedOption && selectedOption.id === location.id
                      ? "bg-pink-50 border border-pink-200"
                      : "hover:bg-gray-50"
                  }`}
              >
                <Checkbox
                  id={location.id}
                  checked={selectedOption ? selectedOption.id === location.id : false}
                  onCheckedChange={(checked) => {
                    setSelectedOption(checked ? { id: location.id, title: location.title, description: location.description, category: location.category } : null);
                  }}
                  className="mt-1 w-4 h-4 border-2 border-gray-300 rounded-lg checked:bg-pink-600 checked:border-pink-600"
                />
                <label
                  htmlFor={location.id}
                  className="flex-1 text-base leading-tight text-gray-800 font-bold cursor-pointer"
                >
                  {location.title}
                  <span className="block mt-1 text-sm text-gray-500 font-normal">
                    {location.description}
                  </span>
                </label>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-3 mb-2">
            Selecciona una opción de entrega
          </h2>
          <div className="space-y-3 max-h-[205px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {pickupLocations
              .filter((loc) => loc.category === "Otras opciones")
              .map((location) => (
                <div
                  key={location.id}
                  className={`flex items-start space-x-3 p-1 rounded-lg transition-colors
                    ${
                      selectedOption && selectedOption.id === location.id
                        ? "bg-pink-50 border border-pink-200"
                        : "hover:bg-gray-50"
                    }`}
                >
                  <Checkbox
                    id={location.id}
                    checked={selectedOption ? selectedOption.id === location.id : false}
                    onCheckedChange={(checked) => {
                      setSelectedOption(checked ? { id: location.id, title: location.title, description: location.description, category: location.category } : null);
                    }}
                    className="mt-1 w-4 h-4 border-2 border-gray-300 rounded-lg checked:bg-pink-600 checked:border-pink-600"
                  />
                  <label
                    htmlFor={location.id}
                    className="flex-1 text-base leading-tight text-gray-800 font-bold cursor-pointer"
                  >
                    {location.title}
                    <span className="block mt-1 text-sm text-gray-500 font-normal">
                      {location.description}
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