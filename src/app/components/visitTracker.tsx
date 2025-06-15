'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const TRACKING_ENDPOINT = '/api/analytics/track';

// Função para gerar um identificador único do cliente
function getClientId() {
  const clientId = localStorage.getItem('clientId');
  if (!clientId) {
    const newClientId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('clientId', newClientId);
    return newClientId;
  }
  return clientId;
}

// Função para verificar se é um novo dia
function isNewDay() {
  const lastVisit = localStorage.getItem('lastVisitDate');
  const today = new Date().toISOString().split('T')[0];
  
  if (!lastVisit || lastVisit !== today) {
    localStorage.setItem('lastVisitDate', today);
    localStorage.removeItem('hasTrackedVisit');
    return true;
  }
  return false;
}

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Verifica se é um novo dia
    isNewDay();

    // Verifica se já rastreamos uma visita nesta sessão
    const hasTrackedVisit = localStorage.getItem('hasTrackedVisit');
    
    if (!hasTrackedVisit && typeof window !== 'undefined') {
      const trackVisit = async () => {
        try {
          // Obter a data atual no horário local do Brasil
          const now = new Date();
          const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          
          await fetch(TRACKING_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              path: pathname,
              type: 'page_view',
              clientId: getClientId(),
              timestamp: localDate.toISOString()
            }),
          });

          // Limpar o localStorage quando o usuário fechar o navegador
          window.addEventListener('beforeunload', () => {
            localStorage.removeItem('hasTrackedVisit');
          });

          localStorage.setItem('hasTrackedVisit', 'true');
        } catch (error) {
          console.error('Error tracking visit:', error);
        }
      };

      trackVisit();
    }
  }, [pathname]);

  return null;
}