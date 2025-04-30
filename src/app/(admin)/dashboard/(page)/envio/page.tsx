import Container from "../components/Container";
import ModalDeletar from "../components/ModalDeletar";
import ModalGeneric from "../components/ModalGeneric";
import { Suspense } from "react";
import { LoadSkeleton } from "../components/loadSkeleton";
import { DeliveryOption } from "@prisma/client";
import { FieldConfig } from "@/utils/types/fieldConfig";

const modalConfig = (action: string, initialValues?: DeliveryOption) => {
  const initialValuesFormatted = initialValues
    ? {
        title: initialValues.title,
        description: initialValues.description,
        category: initialValues.category
      }
    : undefined;

  return {
    title: `${action} Endereço`,
    description: action === "Adicionar"
      ? "Preencha os campos abaixo para adicionar um novo endereço de retirada."
      : "Faça alterações no endereço abaixo.",
    action,
    fields: [
      { 
        name: "title", 
        label: "Título", 
        type: "text", 
        placeholder: "Título do endereço" 
      },
      { 
        name: "description", 
        label: "Descrição", 
        type: "text", 
        placeholder: "Descrição completa do endereço" 
      },
      {
        name: "category",
        label: "Categoria",
        type: "select",
        options: [
          { value: "Retiro en tienda", label: "Retiro en tienda" },
          { value: "Otras opciones", label: "Outras opções" }
        ]
      }
    ] as FieldConfig[],
    apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/delivery`,
    urlRevalidate: "/dashboard/envio",
    method: action === "Adicionar" ? "POST" : "PUT",
    initialValues: initialValuesFormatted,
  };
};

const fetchAddresses = async (): Promise<{ pickupLocations: DeliveryOption[] }> => {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/privada/delivery`, {
      next: { tags: ['delivery'] }
    });

    if (!response.ok) {
      return { pickupLocations: [] };
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar endereços:", error);
    return { pickupLocations: [] };
  }
};

const EnvioList = async () => {
  const { pickupLocations } = await fetchAddresses();

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Endereço Principal</h3>
        {pickupLocations
          .filter((location: DeliveryOption) => location.category === 'Retiro en tienda')
          .map(location => (
            <div
              key={location.id}
              className="p-4 bg-gray-100 rounded-md shadow-md flex justify-between items-center mb-4"
            >
              <div>
                <p className="text-lg font-semibold">{location.title}</p>
                <p className="text-sm text-gray-600">{location.description}</p>
              </div>
              <div className="flex gap-4">
                <ModalGeneric config={modalConfig("Editar", location)} params={location.id} />
                <ModalDeletar
                  config={{
                    id: location.id,
                    title: "Excluir Endereço",
                    description: "Tem certeza que deseja excluir este endereço permanentemente?",
                    apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/delivery`,
                    urlRevalidate: "/dashboard/envio"
                  }}
                />
              </div>
            </div>
          ))}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Outros Endereços</h3>
        <div className="space-y-4">
          {pickupLocations
            .filter(location => location.category === 'Otras opciones')
            .map(location => (
              <div
                key={location.id}
                className="p-4 bg-white rounded-md shadow-md border border-gray-200 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold">{location.title}</p>
                  <p className="text-sm text-gray-600">{location.description}</p>
                </div>
                <div className="flex gap-4">
                  <ModalGeneric config={modalConfig("Editar", location)} params={location.id} />
                  <ModalDeletar
                    config={{
                      id: location.id,
                      title: "Excluir Endereço",
                      description: "Tem certeza que deseja excluir este endereço permanentemente?",
                      apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/delivery`,
                      urlRevalidate: "/dashboard/envio"
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-5 flex justify-between">
        <ModalGeneric config={modalConfig("Adicionar")} />
      </div>
    </div>
  );
};

const EnvioWrapper = () => {
  return (
    <Suspense fallback={<LoadSkeleton />}>
      <EnvioList />
    </Suspense>
  );
};

export default function Envio() {
  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Configuração de Endereços de Retirada</h2>
      <EnvioWrapper />
    </Container>
  );
}

export const dynamic = 'force-dynamic';