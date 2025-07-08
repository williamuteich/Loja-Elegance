import Link from "next/link";
import { FaLock, FaFileContract, FaCookieBite } from "react-icons/fa";

export default function PoliticaPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* Cabeçalho da página */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            Política de Privacidad, Términos de Uso y Cookies
          </h1>
        </div>
      </header>

      {/* Conteúdo principal */}
      <section className="container mx-auto px-4 py-12 space-y-16 max-w-4xl">
        {/* Seção 1 – Política de Privacidade */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <FaLock className="text-blue-500 w-6 h-6" />
            <h2 className="text-2xl font-semibold">Política de Privacidad</h2>
          </div>
          <div className="space-y-4 text-sm leading-6">
            <p>
              Recopilamos los siguientes datos cuando creas una cuenta:
              <strong> nombre completo, correo electrónico, contraseña, teléfono</strong> y
              <em> dirección (opcional)</em>.
            </p>
            <p>
              Utilizamos esta información exclusivamente para el inicio de sesión,
              la personalización de tu experiencia y la comunicación contigo.
            </p>
            <p>
              Nuestro sitio <strong>no procesa pagos</strong>; al finalizar la
              compra, serás redirigido a un canal externo (por ejemplo,
              WhatsApp) para completar el pago.
            </p>
            <p>
              Nunca vendemos ni compartimos tus datos con terceros y
              almacenamos todo con <strong>seguridad y cifrado</strong>.
            </p>
          </div>
        </div>

        {/* Seção 2 – Termos de Uso */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <FaFileContract className="text-green-500 w-6 h-6" />
            <h2 className="text-2xl font-semibold">Términos de Uso</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-sm leading-6">
            <li>Debes proporcionar información veraz al registrarte.</li>
            <li>La contraseña es personal e intransferible; mantenla en secreto.</li>
            <li>
              Está prohibido cualquier uso indebido del sitio que pueda perjudicar a
              la tienda o a otros usuarios.
            </li>
            <li>
              Todo el contenido (imágenes, textos) pertenece a Elegance y no puede
              ser copiado sin autorización.
            </li>
            <li>
              Los pagos se completan fuera de este sitio (por ejemplo, vía
              WhatsApp).
            </li>
          </ul>
        </div>

        {/* Seção 3 – Política de Cookies */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <FaCookieBite className="text-orange-500 w-6 h-6" />
            <h2 className="text-2xl font-semibold">Política de Cookies</h2>
          </div>
          <div className="space-y-4 text-sm leading-6">
            <p>
              Las cookies son pequeños archivos guardados en tu dispositivo que nos
              ayudan a recordarte y mejorar tu experiencia.
            </p>
            <p>
              Utilizamos <strong>cookies esenciales</strong> (login, carrito) y
              <strong> cookies opcionales</strong> (analytics).
            </p>
            <p>
              Al navegar por el sitio aceptas el uso de cookies. Puedes
              cambiar tus preferencias en cualquier momento.
            </p>
            <Link
              href="#"
              className="inline-block mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm font-medium transition-colors"
            >
              Gestionar preferencias de cookies
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
