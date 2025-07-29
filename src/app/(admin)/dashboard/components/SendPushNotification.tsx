"use client";
import { useState } from "react";

export default function SendPushNotification() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSend() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/send-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(`Notificações enviadas: ${data.sent}`);
      } else {
        setResult("Erro ao enviar notificações");
      }
    } catch (e) {
      setResult("Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-8 p-4 border rounded bg-white">
      <h3 className="font-bold mb-2">Enviar notificação push</h3>
      <input
        className="border px-2 py-1 rounded w-full mb-2"
        type="text"
        placeholder="Mensagem da notificação"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleSend}
        disabled={loading || !message.trim()}
      >
        {loading ? "Enviando..." : "Enviar"}
      </button>
      {result && <div className="mt-2 text-sm">{result}</div>}
    </div>
  );
}
