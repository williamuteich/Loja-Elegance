"use client";
import { useEffect } from "react";

export default function PushSubscribe() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) return;

    navigator.serviceWorker.ready.then(async (registration) => {
      // Já está inscrito?
      const existing = await registration.pushManager.getSubscription();
      if (existing) return;
      // Pede permissão
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;
      // Faz subscribe
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
      // Salva no backend
      await fetch("/api/publica/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
    });

    // Função utilitária para converter a chave VAPID
    function urlBase64ToUint8Array(base64String: string) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
  }, []);
  return null;
}
