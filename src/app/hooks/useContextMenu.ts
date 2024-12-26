"use client"
import { useState, useEffect } from 'react';

// Definindo os tipos para a posição do menu
interface MenuPosition {
  x: number;
  y: number;
}

// Definindo os tipos para a função de ações
type Action = 'addLayout' | 'edit' | 'create';

const useContextMenu = () => {
  const [showMenu, setShowMenu] = useState<boolean>(false); // Estado que controla a visibilidade do menu
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({ x: 0, y: 0 }); // Posição do menu

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault(); // Impede o menu padrão do navegador
    setMenuPosition({ x: event.pageX, y: event.pageY });
    setShowMenu(true);
  };

  // Fechar o menu se o usuário clicar fora
  useEffect(() => {
    const closeMenu = () => setShowMenu(false);
    document.addEventListener('click', closeMenu);
    return () => {
      document.removeEventListener('click', closeMenu);
    };
  }, []);

  // Função para lidar com as ações do menu
  const handleAction = (action: Action) => {
    console.log(`Ação selecionada: ${action}`);
    setShowMenu(false);

    // Adicionar lógica conforme a ação selecionada
    switch (action) {
      case 'addLayout':
        // Lógica para adicionar layout
        break;
      case 'edit':
        // Lógica para editar
        break;
      case 'create':
        // Lógica para criar
        break;
      default:
        break;
    }
  };

  return {
    showMenu,
    menuPosition,
    handleContextMenu,
    handleAction,
  };
};

export default useContextMenu;
