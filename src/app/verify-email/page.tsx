import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function validateToken(token: string | null) {
  if (!token) return 'fail';
  
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`, {
      cache: 'no-store',
    });

    if (response.redirected) {
      return response.url.includes('/verify-email/success') ? 'success' : 'fail';
    }
    
    return response.ok ? 'success' : 'fail';
  } catch (error) {
    return 'fail';
  }
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { token } = await searchParams;
  const status = await validateToken(token || null);

  return (
    <div className="min-h-screen flex justify-center bg-white">
      <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl text-center">
        <h1 className="text-2xl font-bold text-pink-700 mb-6 uppercase">Verificación de Correo</h1>

        {status === 'success' ? (
          <>
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mb-4 mx-auto">
              <circle cx="12" cy="12" r="12" fill="#e6fffa"/>
              <path d="M8 12.5l2.5 2.5 5-5" stroke="#38b2ac" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2 className="text-xl font-bold text-green-700 mb-2">¡Verificación Exitosa!</h2>
            <p className="text-gray-600 mb-6">
              Tu correo electrónico ha sido confirmado. Redirigiendo...
            </p>
            <meta http-equiv="refresh" content="3;url=/login" />
          </>
        ) : (
          <>
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mb-4 mx-auto">
              <circle cx="12" cy="12" r="12" fill="#fed7d7"/>
              <path d="M9 9l6 6m0-6l-6 6" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2 className="text-xl font-bold text-red-600 mb-2">Error al verificar la cuenta</h2>
            <p className="text-gray-600 mb-6">
              El enlace de verificación es inválido o ha expirado. Solicita un nuevo enlace o contacta al soporte.
            </p>
            <Button asChild className="w-full p-6 bg-pink-700 text-white font-semibold uppercase rounded-md hover:bg-pink-600">
              <Link href="/">
                Volver al Inicio
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}