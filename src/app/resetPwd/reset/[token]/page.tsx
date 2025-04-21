import { redirect } from 'next/navigation';

async function validateToken(token: string | null) {
  if (!token) return { valid: false, email: null };

  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/publica/reset-password/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      cache: 'no-store'
    });

    if (!response.ok) return { valid: false, email: null };
    return await response.json();
  } catch (error) {
    return { valid: false, email: null };
  }
}

export default async function ResetPasswordPage({ params, searchParams }: any) {
  const token = params.token;
  const error = searchParams?.error || null;
  const { valid, email } = await validateToken(token || null);

  if (!token || !valid) {
    return redirect('/login'); 
  }

  const updatePassword = async (formData: FormData) => {
    'use server';

    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const token = formData.get('token');

    if (password !== confirmPassword) {
      return redirect(`/resetPwd/reset/${token}?error=password_mismatch`);
    }

    if (typeof password !== 'string' || password.length < 6) {
      return redirect(`/resetPwd/reset/${token}?error=invalid_password`);
    }

    try {
      const validation = await fetch(`${process.env.NEXTAUTH_URL}/api/publica/reset-password/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
        cache: 'no-store'
      });

      if (!validation.ok) {
        return redirect(`/resetPwd/reset/${token}?error=invalid_token`);
      }

      const updateResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/publica/reset-password/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (!updateResponse.ok) {
        const error = await updateResponse.json();
        return redirect(`/resetPwd/reset/${token}?error=${encodeURIComponent(error.message)}`);
      }

      return redirect('/login');

    } catch (error) {
      return redirect(`/resetPwd/reset/${token}?error=connection_error`);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 border border-gray-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-pink-700">Crear nueva contraseña</h2>
        <p className="text-gray-600 mt-2">
          Ingresa tu nueva contraseña para la cuenta {email}
        </p>

        {error === 'password_mismatch' && (
          <p className="text-red-500 mt-2">Las contraseñas no coinciden</p>
        )}
        {error === 'invalid_password' && (
          <p className="text-red-500 mt-2">La contraseña debe tener al menos 6 caracteres</p>
        )}
        {error === 'connection_error' && (
          <p className="text-red-500 mt-2">Error de conexión con el servidor</p>
        )}
      </div>

      <form action={updatePassword} className="space-y-6">
        <input type="hidden" name="token" value={token} />

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Nueva contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            placeholder="Repite tu nueva contraseña"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          Actualizar contraseña
        </button>
      </form>
    </div>
  );
}
