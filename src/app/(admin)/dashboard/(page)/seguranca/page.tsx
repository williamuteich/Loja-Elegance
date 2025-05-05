import TotpSetup from "../components/TotpSetup";

export default function SegurancaPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Configurações de Segurança
                        </h1>
                        <p className="text-gray-600">
                            Proteja sua conta administrativa com autenticação de dois fatores
                        </p>
                    </div>
                    
                    <div className="border-t border-gray-200 flex flex-col items-center">
                        <div className="space-y-2 mb-8">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Autenticação em Duas Etapas (2FA)
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Requer um código de acesso adicional para entrar na conta
                            </p>
                        </div>
                        <TotpSetup />
                    </div>
                </div>
            </div>
        </div>
    );
}