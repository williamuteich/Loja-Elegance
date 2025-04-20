import * as React from "react";

export function VerifyEmail({ verifyUrl }: { verifyUrl: string }) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#222', padding: 24 }}>
      <h2>Confirme seu e-mail</h2>
      <p>Obrigado por se cadastrar! Para ativar sua conta, clique no botão abaixo:</p>
      <a
        href={verifyUrl}
        style={{
          display: 'inline-block',
          background: '#0070f3',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 6,
          textDecoration: 'none',
          fontWeight: 600,
          marginTop: 16
        }}
      >
        Ativar Conta
      </a>
      <p style={{ marginTop: 24 }}>
        Se você não se cadastrou, ignore este e-mail.
      </p>
    </div>
  );
}
