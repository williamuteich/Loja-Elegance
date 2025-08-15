'use client';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação simples de e-mail
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Por favor, insira um e-mail válido.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/publica/reset-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailEnviado(true);
      } else {
        toast.error(data.error || 'Ocorreu um erro ao enviar o e-mail.');
      }
    } catch {
      toast.error('Erro ao conectar com o servidor. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailEnviado) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 border border-gray-200">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-pink-700 mb-4">
            E-mail enviado
          </h2>
          <p className="text-gray-600 mb-6">
            Enviamos um link para redefinir sua senha para{' '}
            <span className="font-semibold">{email}</span>.
            Verifique sua caixa de entrada e siga as instruções.
          </p>
          <p className="text-sm text-gray-500">
            Se não receber o e-mail em alguns minutos, verifique sua pasta de
            spam ou tente novamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="bg-white shadow-md rounded-lg p-8 border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-pink-700">
            Recuperar senha
          </h2>
          <p className="text-gray-600 mt-2">
            Digite seu e-mail e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              placeholder="seu@email.com"
              aria-label="E-mail"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-pink-300 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
