import { Container } from "@/app/components/container";

export default function Sobre() {
    return (
        <Container>
            <div className="bg-gradient-to-b from-pink-50 to-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Sección de texto */}
                        <div className="order-last md:order-first space-y-6">
                            <h2 className="text-3xl lg:text-4xl font-bold text-rose-800 uppercase tracking-wide border-l-4 border-rose-600 pl-4">
                                Sobre Nosotros
                            </h2>
                            
                            <p className="text-lg leading-relaxed text-gray-700">
                                En Punto Crear, somos una empresa innovadora apasionada por transformar ideas en realidades concretas. 
                                Nuestro equipo de profesionales orientados al resultado trabaja incansablemente para ofrecer soluciones 
                                creativas con el más alto estándar de calidad.
                            </p>
                            
                            <div className="bg-rose-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-rose-900 mb-3">Nuestros Pilares</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li>✅ Innovación constante en procesos</li>
                                    <li>✅ Compromiso con la excelencia</li>
                                    <li>✅ Orientación al cliente uruguayo</li>
                                    <li>✅ Sustentabilidad en cada proyecto</li>
                                </ul>
                            </div>
                        </div>

                        {/* Sección de imagen */}
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-gradient-to-r from-rose-200 to-pink-200 rounded-2xl transform rotate-1 group-hover:rotate-0 transition duration-500"></div>
                            <img 
                                src="/novaImageDeFundo.jpg" 
                                alt="Equipo de trabajo" 
                                className="relative rounded-xl shadow-2xl w-full h-auto object-cover transform group-hover:scale-105 transition duration-500"
                            />
                        </div>
                    </div>

                    {/* Sección adicional */}
                    <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-rose-50">
                        <h3 className="text-2xl font-bold text-rose-800 mb-6">Nuestra Visión</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Aspiramos a ser referentes en innovación dentro del mercado uruguayo, contribuyendo al desarrollo 
                            empresarial nacional con soluciones creativas y sustentables. Buscamos constantemente superar 
                            expectativas, manteniendo siempre la autenticidad y calidez que nos caracteriza.
                        </p>
                    </div>
                </div>
            </div>
        </Container>
    );
}