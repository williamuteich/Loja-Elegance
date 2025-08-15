import { FaLock, FaFileContract, FaCookieBite } from "react-icons/fa";

export default function PoliticaPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            Política de Privacidade, Termos de Uso e Cookies
          </h1>
        </div>
      </header>

      <section className="container mx-auto px-4 py-12 space-y-16 max-w-4xl">
        
        {/* Política de Privacidade */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <FaLock className="text-blue-500 w-6 h-6" />
            <h2 className="text-2xl font-semibold">Política de Privacidade</h2>
          </div>
          <div className="space-y-4 text-sm leading-6">
            <p>
              Coletamos os seguintes dados quando você cria uma conta:
              <strong> nome completo, e-mail, senha, telefone</strong> e
              <em> endereço (opcional)</em>.
            </p>
            <p>
              Utilizamos essas informações exclusivamente para login,
              personalização da sua experiência e comunicação com você.
            </p>
            <p>
              Nosso site aceita pagamentos via <strong>PIX, cartão de crédito e cartão de débito</strong>,
              processados com segurança por parceiros de pagamento certificados.
            </p>
            <p>
              Não armazenamos os dados do seu cartão de crédito ou débito. Essas
              informações são enviadas de forma criptografada diretamente para o
              processador de pagamentos.
            </p>
            <p>
              Também aceitamos pedidos realizados via <strong>WhatsApp</strong>,
              onde o atendimento e as instruções de pagamento serão fornecidos
              diretamente por nossa equipe.
            </p>
            <p>
              Nunca vendemos nem compartilhamos seus dados com terceiros e
              armazenamos tudo com <strong>segurança e criptografia</strong>.
            </p>
          </div>
        </div>

        {/* Termos de Uso */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <FaFileContract className="text-green-500 w-6 h-6" />
            <h2 className="text-2xl font-semibold">Termos de Uso</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-sm leading-6">
            <li>Você deve fornecer informações verdadeiras ao se cadastrar.</li>
            <li>A senha é pessoal e intransferível; mantenha-a em sigilo.</li>
            <li>
              É proibido qualquer uso indevido do site que possa prejudicar a
              loja ou outros usuários.
            </li>
            <li>
              Todo o conteúdo (imagens, textos) pertence à Elegance e não pode
              ser copiado sem autorização.
            </li>
            <li>
              Os pagamentos são processados por intermediadores confiáveis, e
              seus dados financeiros não são armazenados por nós.
            </li>
            <li>
              Aceitamos PIX, cartão de crédito, cartão de débito e pedidos via
              WhatsApp.
            </li>
          </ul>
        </div>

        {/* Política de Cookies */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <FaCookieBite className="text-orange-500 w-6 h-6" />
            <h2 className="text-2xl font-semibold">Política de Cookies</h2>
          </div>
          <div className="space-y-4 text-sm leading-6">
            <p>
              Cookies são pequenos arquivos salvos no seu dispositivo que nos
              ajudam a lembrar de você e melhorar sua experiência.
            </p>
            <p>
              Utilizamos <strong>cookies essenciais</strong> (login, carrinho) e
              <strong> cookies opcionais</strong> (análises/estatísticas).
            </p>
            <p>
              Ao navegar pelo site, você aceita o uso de cookies. É possível
              alterar suas preferências a qualquer momento.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
