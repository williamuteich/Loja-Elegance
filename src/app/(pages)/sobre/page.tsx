import { Container } from "@/app/components/container";

export default function Sobre() {
    return (
        <Container>
            <div className="bg-gradient-to-b from-pink-50 to-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Seção de texto */}
                        <div className="order-last md:order-first space-y-6">
                            <h2 className="text-3xl lg:text-4xl font-bold text-rose-800 uppercase tracking-wide border-l-4 border-rose-600 pl-4">
                                Sobre Nós
                            </h2>
                            
                            <p className="text-lg leading-relaxed text-gray-700">
                                No Bazar Elegance, somos uma empresa inovadora apaixonada por transformar ideias em realidades concretas. 
                                Nossa equipe de profissionais orientados a resultados trabalha incansavelmente para oferecer soluções 
                                criativas com o mais alto padrão de qualidade.
                            </p>
                            
                            <div className="bg-rose-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-rose-900 mb-3">Nossos Pilares</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li>✅ Inovação constante em processos</li>
                                    <li>✅ Compromisso com a excelência</li>
                                    <li>✅ Foco no cliente brasileiro</li>
                                    <li>✅ Sustentabilidade em cada projeto</li>
                                </ul>
                            </div>
                        </div>

                        {/* Seção de imagem */}
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-gradient-to-r from-rose-200 to-pink-200 rounded-2xl transform rotate-1 group-hover:rotate-0 transition duration-500"></div>
                            <img 
                                src="/novaImageDeFundo.jpg" 
                                alt="Equipe de trabalho" 
                                className="relative rounded-xl shadow-2xl w-full h-auto object-cover transform group-hover:scale-105 transition duration-500"
                            />
                        </div>
                    </div>

                    {/* Seção adicional */}
                    <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-rose-50">
                        <h3 className="text-2xl font-bold text-rose-800 mb-6">Nossa Visão</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Aspiramos ser referência em inovação dentro do mercado brasileiro, contribuindo para o desenvolvimento 
                            empresarial nacional com soluções criativas e sustentáveis. Buscamos constantemente superar 
                            expectativas, mantendo sempre a autenticidade e a proximidade que nos caracteriza.
                        </p>
                    </div>
                </div>
            </div>
        </Container>
    );
}
