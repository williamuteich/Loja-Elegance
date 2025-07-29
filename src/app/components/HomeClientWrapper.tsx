"use client";
import AcceptTermsAndSubscribe from "./AcceptTermsAndSubscribe";
import { useEffect } from "react";

export default function HomeClientWrapper() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      }).then(() => {
        // Service worker registrado!
      }).catch((err) => {
        console.error("Erro ao registrar service worker:", err);
      });
    }
  }, []);
  return <AcceptTermsAndSubscribe />;
}
