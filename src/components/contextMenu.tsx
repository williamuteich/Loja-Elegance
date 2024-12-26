"use client"
import React from 'react';

interface ContextMenuProps {
  show: boolean; // Se o menu deve ser exibido
  position: { x: number; y: number }; // Posição onde o menu será exibido
  onAction: (action: 'addLayout' | 'edit' | 'create') => void; // Função chamada ao selecionar uma ação
}

const ContextMenu: React.FC<ContextMenuProps> = ({ show, position, onAction }) => {
  if (!show) return null; // Se o menu não deve ser exibido, retorna null

  return (
    <div
      className="absolute bg-white border border-gray-300 shadow-lg z-50 rounded-md w-48 p-2"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      <ul className="space-y-2">
        <li
          onClick={() => onAction('addLayout')}
          className="cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-md transition"
        >
          Adicionar Layout
        </li>
        <li
          onClick={() => onAction('edit')}
          className="cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-md transition"
        >
          Editar
        </li>
        <li
          onClick={() => onAction('create')}
          className="cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-md transition"
        >
          Criar
        </li>
      </ul>
    </div>
  );
};

export default ContextMenu;
