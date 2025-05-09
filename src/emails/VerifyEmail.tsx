import * as React from "react";

export function VerifyEmail({ verifyUrl }: { verifyUrl: string }) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#222', padding: 24 }}>
      <h2>Confirma tu correo electrónico</h2>
      <p>¡Gracias por registrarte! Para activar tu cuenta, haz clic en el siguiente botón:</p>
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
        Activar Cuenta
      </a>
      <p style={{ marginTop: 24 }}>
        Si no te registraste, ignora este correo.
      </p>
    </div>
  );
}
