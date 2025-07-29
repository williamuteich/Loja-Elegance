"use client";
import { useState, useEffect } from "react";

export default function AcceptTermsAndSubscribe() {
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detecta se é mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const aceitou = localStorage.getItem('elegance_terms_accepted');
      setAccepted(aceitou === 'true');
      // Detecção simples de mobile
      const ua = navigator.userAgent;
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      setIsMobile(mobile);
    }
  }, []);

  if (accepted === null || isMobile === null) return null; // Evita flicker
  if (accepted || !isMobile) return null;

  async function handleAccept() {
    setLoading(true);
    setError(null);
    try {
      console.log('[PWA] Clique em aceitar termos');
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        console.log('[PWA] Service worker pronto');
        const permission = await Notification.requestPermission();
        console.log('[PWA] Permissão de notificação:', permission);
        if (permission !== 'granted') {
          setError('Permissão de notificações negada pelo navegador.');
          setLoading(false);
          return;
        }
        // Busca a VAPID public key do endpoint
        let vapidKey = '';
        try {
          const res = await fetch('/api/publica/vapid-key');
          const data = await res.json();
          vapidKey = data.key;
        } catch (err) {
          setError('Erro ao obter chave pública do servidor.');
          setLoading(false);
          return;
        }
        let sub;
        try {
          sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey),
          });
          console.log('[PWA] Subscription criada:', sub);
        } catch (err) {
          setError('Erro ao registrar subscription no navegador.');
          setLoading(false);
          console.error('[PWA] Erro no subscribe:', err);
          return;
        }
        try {
          const res = await fetch('/api/publica/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sub),
          });
          console.log('[PWA] Requisição para /api/publica/subscribe enviada', res.status);
          if (!res.ok) {
            setError('Erro ao salvar subscription no servidor.');
            setLoading(false);
            console.error('[PWA] Erro ao salvar subscription:', await res.text());
            return;
          }
        } catch (err) {
          setError('Erro de rede ao salvar subscription.');
          setLoading(false);
          console.error('[PWA] Erro de rede:', err);
          return;
        }
        // Não faz mais nada, só mostra sucesso
      } else {
        setError('Seu navegador não suporta notificações push.');
        setLoading(false);
        return;
      }
      setAccepted(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('elegance_terms_accepted', 'true');
      }
    } catch (e) {
      setError('Erro inesperado ao processar sua aceitação.');
      console.error('[PWA] Erro inesperado:', e);
    } finally {
      setLoading(false);
    }
  }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      style={{ pointerEvents: loading ? 'none' : 'auto' }}
    >
      <div className="max-w-md w-full bg-white border border-gray-300 shadow-2xl rounded-xl p-6 flex flex-col items-center animate-fade-in">
        <p className="mb-4 text-center text-gray-800 text-base font-medium">
          Para continuar navegando, você precisa aceitar nossos termos e condições.<br />
          Saiba mais em nossa <a href="/politica" className="underline text-blue-600">Política de Privacidade</a>.
        </p>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50 w-full"
          onClick={handleAccept}
          disabled={loading || accepted}
        >
          {loading ? 'Processando...' : 'Aceitar e continuar'}
        </button>
        {error && <div className="mt-3 text-red-600 text-sm">{error}</div>}
      </div>
    </div>
  );
}
