
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaMobile, FaApple, FaAndroid, FaChrome, FaSafari } from "react-icons/fa";

export default function BaixarAppPage() {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent;
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const ios = /iPad|iPhone|iPod/.test(ua);
    const android = /Android/.test(ua);
    setIsMobile(mobile);
    setIsIOS(ios);
    setIsAndroid(android);
    // Detecta se está rodando como PWA (standalone)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
    // Para Android, escutar o evento de instalação
    if (android) {
      function handler(e: any) {
        e.preventDefault();
        setDeferredPrompt(e);
        setCanInstall(true);
      }
      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleInstallAndroid = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setCanInstall(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/icon-192x192.png"
              alt="Loja Elegance"
              width={230}
              height={230}
              quality={100}
              className="rounded-xl shadow-lg w-auto h-[80px] px-4 py-1 bg-white"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            ¡Descarga la App de Loja Elegance!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Disfruta de una experiencia de compra más rápida, notificaciones de ofertas exclusivas y acceso sin conexión.
          </p>
        </div>

        {/* Beneficios */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-pink-600 text-4xl mb-4">🚀</div>
            <h3 className="font-bold text-gray-800 mb-2">Más Rápido</h3>
            <p className="text-gray-600 text-sm">Carga instantánea y navegación fluida</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-pink-600 text-4xl mb-4">🔔</div>
            <h3 className="font-bold text-gray-800 mb-2">Notificaciones</h3>
            <p className="text-gray-600 text-sm">Recibe ofertas exclusivas al instante</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-pink-600 text-4xl mb-4">📱</div>
            <h3 className="font-bold text-gray-800 mb-2">Acceso Directo</h3>
            <p className="text-gray-600 text-sm">Icono en tu pantalla de inicio</p>
          </div>
        </div>

        {/* Instrucciones de instalación */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!isMobile ? (
            // Desktop
            <div className="text-center">
              <FaMobile className="text-6xl text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Descarga la App PWA
              </h2>
              <button
                disabled
                className="bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg text-lg mb-4 opacity-60 cursor-not-allowed"
              >
                Descarga la App PWA
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Accede a esta página desde tu móvil para descargar e instalar la app PWA.
              </p>
            </div>
          ) : isAndroid ? (
            // Android
            <div>
              <div className="flex items-center justify-center mb-6">
                <FaAndroid className="text-4xl text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Android</h2>
              </div>
              <div className="text-center mb-6">
                <button
                  onClick={handleInstallAndroid}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg text-lg transition-all mb-4 inline-flex items-center"
                >
                  <FaAndroid className="mr-2 text-xl" />
                  Instalar App PWA para Android
                </button>
                <p className="text-sm text-gray-500 mb-6">
                  Pulsa para instalar directamente en tu dispositivo <b>Android</b>.
                </p>
                {!canInstall && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 text-sm">
                      ⚠️ Si el botón no funciona, usa las instrucciones manuales abajo para Android.
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold px-4">1</div>
                  <div>
                    <p className="font-semibold">Abre Chrome</p>
                    <p className="text-gray-600 text-sm">Asegúrate de usar Google Chrome</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold px-4">2</div>
                  <div>
                    <p className="font-semibold">Busca "Instalar" en el menú</p>
                    <p className="text-gray-600 text-sm">Toca los 3 puntos (⋮) y busca "Instalar app" o "Añadir a pantalla de inicio"</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold px-4">3</div>
                  <div>
                    <p className="font-semibold">Confirma la instalación</p>
                    <p className="text-gray-600 text-sm">La app aparecerá en tu pantalla de inicio</p>
                  </div>
                </div>
              </div>
            </div>
          ) : isIOS ? (
            // iOS
            <div>
              <div className="flex items-center justify-center mb-6">
                <FaApple className="text-4xl text-gray-700 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">iPhone/iPad</h2>
              </div>
              {/* Si es PWA (standalone), muestra botón para activar notificaciones */}
              {isStandalone && (
                <div className="text-center mb-6">
                  <button
                    onClick={() => {
                      if ('Notification' in window) {
                        Notification.requestPermission();
                      }
                    }}
                    className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg text-lg transition-all mb-4 inline-flex items-center"
                  >
                    <FaApple className="mr-2 text-xl" />
                    Activar Notificaciones en iOS
                  </button>
                  <p className="text-sm text-gray-500 mb-6">
                    Permite notificaciones para recibir novedades y promociones.
                  </p>
                </div>
              )}
              {/* Siempre muestra el tutorial de agregar a la pantalla de inicio */}
              <div className="bg-white rounded-xl shadow p-4 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 text-center">¿Cómo instalar en iOS (Safari)?</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold">1</div>
                    <div>
                      <span className="font-semibold">Abre Safari</span>
                      <span className="block text-gray-600 text-xs">(no funciona en otros navegadores)</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold">2</div>
                    <div>
                      <span className="font-semibold">Toca el botón de compartir</span>
                      <span className="block text-gray-600 text-xs">(ícono de flecha hacia arriba en la barra inferior)</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold">3</div>
                    <div>
                      <span className="font-semibold">Selecciona "Agregar a pantalla de inicio"</span>
                      <span className="block text-gray-600 text-xs">(busca esta opción en el menú)</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold">4</div>
                    <div>
                      <span className="font-semibold">Confirma en "Agregar"</span>
                      <span className="block text-gray-600 text-xs">La app aparecerá en tu pantalla de inicio</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-2 bg-blue-50 rounded">
                  <span className="text-blue-800 text-xs">
                    💡 Solo funciona en Safari. Si estás en otro navegador, copia el enlace y ábrelo en Safari.
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* FAQ */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Preguntas Frecuentes</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">¿Es gratuita la app?</h3>
              <p className="text-gray-600 text-sm">Sí, la instalación y uso de la app es completamente gratuito.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">¿Por qué no hay botón de descarga en iOS?</h3>
              <p className="text-gray-600 text-sm">iOS requiere instalación manual a través de Safari. Apple no permite que las webs instalen apps automáticamente por seguridad. En Android sí hay botón automático cuando está disponible.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">¿Ocupa mucho espacio?</h3>
              <p className="text-gray-600 text-sm">No, es una app web progresiva que ocupa muy poco espacio en tu dispositivo.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">¿Funciona sin internet?</h3>
              <p className="text-gray-600 text-sm">Algunas funciones básicas funcionan sin conexión, pero necesitas internet para ver productos y realizar compras.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
