import { Container } from "@/app/components/container";

export default function Sobre() {
    return (
        <Container>
            <div className="flex items-center justify-center py-12 px-6">
                <div className="max-w-7xl min-h-screen w-full p-6 flex flex-col md:flex-row items-start gap-2 lg:gap-8">
                    <div className="flex-1 mb-6 md:mb-0 md:pr-8">
                    <h2 className="text-2xl text-center mb-2 lg:text-start uppercase font-extrabold text-pink-700">
                                Sobre a Empresa
                            </h2>
                        <p className="text-md text-center lg:text-start text-gray-700 leading-relaxed">
                            Somos uma empresa inovadora e apaixonada por criar soluções que transformam ideias em realidade. 
                            Nosso time é dedicado em oferecer os melhores resultados com qualidade, criatividade e compromisso.
                            Estamos sempre em busca de inovação e excelência, com foco na satisfação dos nossos clientes.
                        </p>
                    </div>
                    
                    <div className="flex-shrink-0 w-full md:w-1/2">
                        <img 
                            src="/imagem1.jpg" 
                            alt="Imagem ilustrativa" 
                            className="rounded-lg shadow-xl w-full h-auto object-cover" 
                        />
                    </div>
                </div>
            </div>
        </Container>
    );
}
