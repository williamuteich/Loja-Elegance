"use client";
import { useEffect, useState } from "react";

export default function InstallAppBanner() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Detectar mobile e iOS
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    // Não mostrar se já instalou
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    if (!isMobile || isStandalone) return;

    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // Para iOS, mostrar sempre (sem evento beforeinstallprompt)
      setShow(true);
    } else if (isAndroid) {
      // Para Android, aguardar o evento beforeinstallprompt
      function handler(e: any) {
        e.preventDefault();
        setDeferredPrompt(e);
        setShow(true);
      }
      window.addEventListener('beforeinstallprompt', handler, { once: true });
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  if (!show) return null;

  function handleClose() {
    setShow(false);
  }

  async function handleInstall() {
    if (isIOS) {
      // Para iOS, mostrar instruções
      alert('Para instalar: toque no botão de compartilhar (⬆️) no Safari e escolha "Adicionar à Tela de Início"');
    } else if (deferredPrompt) {
      // Para Android, usar o prompt nativo
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setShow(false);
    }
  }

  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-pink-600 text-white backdrop-blur-sm shadow-md flex items-center justify-between px-4 py-2 text-sm lg:hidden animate-fade-in rounded-b-xl">
      <div className="flex items-center gap-2 flex-1">
        <span className="font-semibold">¡Instalá la app de Loja Elegance!</span>
        <span className="hidden xs:inline">para una mejor experiencia</span>
      </div>
      <button
        className="bg-white text-pink-600 font-bold px-3 py-1 rounded-md ml-2 shadow hover:bg-pink-100 transition-colors"
        onClick={handleInstall}
      >
        {isIOS ? 'Cómo instalar' : 'Instalar'}
      </button>
      <button
        className="ml-2 text-white hover:text-gray-200 text-xl font-bold"
        onClick={handleClose}
        aria-label="Cerrar"
      >
        ×
      </button>
    </div>
  );
}
