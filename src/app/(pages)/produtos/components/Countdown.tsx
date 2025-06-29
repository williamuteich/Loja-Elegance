"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  deadlineISO: string;
  updatedAt: string;
}

export default function Countdown({ deadlineISO, updatedAt }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const deadline = new Date(deadlineISO).getTime();
    const now = Date.now();
    const initialTimeLeft = deadline - now;

    if (initialTimeLeft <= 0) {
      setTimeLeft(0);
      return;
    }

    setTimeLeft(initialTimeLeft);

    const interval = setInterval(() => {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadlineISO]);

  if (!isClient) {
    return <div className="h-20" />;
  }

  if (timeLeft <= 0) {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mb-4">
        <div className="text-center">
          <p className="text-rose-600 font-semibold text-base">⏱ Promoción finalizada</p>
          <p className="text-rose-500 text-sm mt-1">Esta oferta especial ha terminado</p>
        </div>
      </div>
    );
  }

  const deadline = new Date(deadlineISO).getTime();
  const updated = new Date(updatedAt).getTime();
  const now = Date.now();

  const totalDuration = deadline - updated;
  const elapsed = now - updated;

  const progress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));

  const seconds = Math.floor((timeLeft / 1000) % 60);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mb-4 mt-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-rose-400 text-white rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-rose-600 font-semibold text-sm sm:text-base">La promoción termina en:</h3>
        </div>
        <span className="bg-rose-200 text-rose-700 text-xs px-2 py-0.5 rounded-full">🔥 Oferta relámpago</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <CountdownBox value={days} label="Días" />
        <CountdownBox value={hours} label="Horas" />
        <CountdownBox value={minutes} label="Minutos" />
        <CountdownBox value={seconds} label="Segundos" />
      </div>

      <div className="mt-3 w-full bg-rose-100 rounded-full h-2 overflow-hidden">
        <div
          className="bg-rose-500 h-2 transition-all duration-1000 ease-linear"
          style={{
            width: `${progress}%`,
          }}
        ></div>
      </div>

      <p className="text-rose-500 text-sm mt-2 text-center">
        ¡No te pierdas esta oportunidad única!
      </p>
    </div>
  );
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white border border-rose-200 rounded-md w-full p-2 text-center shadow-sm">
        <span className="text-rose-600 font-semibold text-lg">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-rose-500 text-xs mt-1">{label}</span>
    </div>
  );
}
