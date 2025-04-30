export default function NotFound() {
    return (
      <div className="flex justify-center bg-gray-100">
        <div className="text-center min-h-screen py-16">
          <h1 className="text-6xl font-extrabold text-pink-700">404</h1>
          <p className="text-xl font-semibold text-gray-700 mt-4">
            Página não encontrada
          </p>
          <p className="text-gray-500 mt-2">Desculpe, a página que você está procurando não existe.</p>
          <div className="mt-6">
            <a
              href="/"
              className="px-6 py-2 bg-pink-700 text-white font-semibold rounded-lg hover:bg-pink-600 transition duration-300"
            >
              Voltar para a página inicial
            </a>
          </div>
        </div>
      </div>
    );
  }
  