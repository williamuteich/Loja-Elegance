'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BsCheckCircle, BsChevronDown } from 'react-icons/bs';

const statusOptions = [
  { value: 'pending', label: '🕓 Pendiente' },
  { value: 'confirmed', label: '✅ Confirmado' },
  { value: 'shipped', label: '📦 Enviado' },
  { value: 'delivered', label: '📬 Entregado' },
  { value: 'cancelled', label: '❌ Cancelado' },
];

interface UpdateStatusProps {
  orderId: string;
  currentStatus: string;
}

export default function UpdateStatus({ orderId, currentStatus }: UpdateStatusProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    if (selectedStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    try {
      setIsUpdating(true);
      const response = await fetch(`/api/privada/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (!response.ok) throw new Error('Error en la actualización');

      router.refresh();
      setIsOpen(false);
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      alert('¡Error al actualizar el estado!');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BsCheckCircle className="w-4 h-4" />
          <span>Actualizar estado</span>
        </div>
        <BsChevronDown className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 right-0 z-10 bg-white rounded-lg shadow-xl border border-gray-100 p-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isUpdating}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isUpdating ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
