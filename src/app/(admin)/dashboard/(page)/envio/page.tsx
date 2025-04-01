"use client"
import { useState, useEffect, Suspense } from 'react';
import { FaEdit, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import Container from '../components/Container';

// Componente de loading
const Loading = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-blue-600">Carregando Endereços...</h2>
    </div>
  );
};

interface DeliveryOption {
  id: string;
  title: string;
  description: string;
  category: string;
}

export default function Envio() {
  const [pickupLocations, setPickupLocations] = useState<DeliveryOption[]>([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchDeliveryOptions = async () => {
      try {
        const response = await fetch('/api/delivery');
        const data = await response.json();
        setPickupLocations(data.pickupLocations);
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching delivery options:', error);
        setLoading(false);
      }
    };

    fetchDeliveryOptions();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch('/api/delivery', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      setPickupLocations(prevLocations =>
        prevLocations.filter(loc => loc.id !== id)
      );
    } catch (error) {
      console.error('Error deleting delivery option:', error);
    }
  };

  const handleEdit = (id: string, category: string) => {
    if (category === 'Retiro en tienda') {
      alert(`Você não pode excluir "Retiro en tienda", apenas altere a descrição ou o título.`);
    } else {
      alert(`Editar opção com ID: ${id}`);
    }
  };

  return (
    <Container>
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Configuração de Endereços de Retirada</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Endereço da Loja (Retirada)</h3>
        {loading ? (
          <Loading />
        ) : (
          pickupLocations
            .filter(location => location.category === 'Retiro en tienda')
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
                  <button
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    onClick={() => handleEdit(location.id, location.category)}
                  >
                    <FaEdit size={18} />
                    <span>Alterar</span>
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Outros Endereços de Retirada</h3>
        {loading ? (
          <Loading />
        ) : (
          pickupLocations
            .filter(location => location.category === 'Otras opciones')
            .map(location => (
              <div
                key={location.id}
                className="p-4 bg-white rounded-md shadow-md border border-gray-200 flex justify-between items-center mb-4"
              >
                <div>
                  <p className="text-lg font-semibold">{location.title}</p>
                  <p className="text-sm text-gray-600">{location.description}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEdit(location.id, location.category)}
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(location.id)}
                  >
                    <FaTrashAlt size={18} />
                  </button>
                </div>
              </div>
            ))
        )}

        <button
          className="mt-6 flex items-center gap-2 text-green-600 hover:text-green-800"
          onClick={() => alert('Adicionar novo endereço')}
        >
          <FaPlusCircle size={20} />
          <span>Adicionar Novo Endereço</span>
        </button>
      </div>
    </Container>
  );
}
