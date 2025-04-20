import React from 'react';

export default function VerifyEmailSuccess() {
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
