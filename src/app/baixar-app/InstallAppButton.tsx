"use client";
import React from "react";

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [canInstall, setCanInstall] = React.useState(false);
  React.useEffect(() => {
    function handler(e: any) {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    }
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  if (!canInstall) {
    return <span className="text-gray-500 text-sm">Abra pelo navegador do seu celular para instalar o app.</span>;
  }
  return (
    <button
      className="bg-blue-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-blue-700 transition w-full"
      onClick={async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          await deferredPrompt.userChoice;
        }
      }}
    >
      Instalar app agora
    </button>
  );
}
