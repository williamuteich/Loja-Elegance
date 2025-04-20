'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'fail'>('loading');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('fail');
      return;
    }
    fetch(`/api/verify-email?token=${token}`)
      .then(async (res) => {
        if (res.redirected) {
          // Next.js API route redirected, so we follow the redirect
          if (res.url.includes('/verify-email/success')) {
            setStatus('success');
          } else {
            setStatus('fail');
          }
        } else if (res.ok) {
          setStatus('success');
        } else {
          setStatus('fail');
        }
      })
      .catch(() => setStatus('fail'));
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7fafc' }}>
        <div style={{ background: '#fff', padding: '2rem 3rem', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <span>Validando seu e-mail...</span>
        </div>
      </div>
    );
  }
  if (status === 'success') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f7fafc' }}>
        <div style={{ background: '#fff', padding: '2rem 3rem', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <svg width="64" height="64" fill="none" viewBox="0 0 24 24" style={{ marginBottom: '1rem' }}>
            <circle cx="12" cy="12" r="12" fill="#e6fffa"/>
            <path d="M8 12.5l2.5 2.5 5-5" stroke="#38b2ac" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 style={{ color: '#2b6cb0', marginBottom: '0.5rem' }}>Conta verificada com sucesso!</h1>
          <p style={{ color: '#4a5568', marginBottom: '1.5rem' }}>
            Seu e-mail foi confirmado. Agora você pode acessar sua conta normalmente.
          </p>
          <a href="/login" style={{ background: '#38b2ac', color: '#fff', padding: '0.75rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, boxShadow: '0 2px 8px rgba(56,178,172,0.10)' }}>
            Ir para o Login
          </a>
        </div>
      </div>
    );
  }
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f7fafc' }}>
      <div style={{ background: '#fff', padding: '2rem 3rem', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" style={{ marginBottom: '1rem' }}>
          <circle cx="12" cy="12" r="12" fill="#fed7d7"/>
          <path d="M9 9l6 6m0-6l-6 6" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h1 style={{ color: '#e53e3e', marginBottom: '0.5rem' }}>Falha ao verificar a conta</h1>
        <p style={{ color: '#4a5568', marginBottom: '1.5rem' }}>
          O link de verificação é inválido ou expirou. Solicite um novo link ou entre em contato com o suporte.
        </p>
        <a href="/" style={{ background: '#e53e3e', color: '#fff', padding: '0.75rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, boxShadow: '0 2px 8px rgba(229,62,62,0.10)' }}>
          Voltar para o início
        </a>
      </div>
    </div>
  );
}
