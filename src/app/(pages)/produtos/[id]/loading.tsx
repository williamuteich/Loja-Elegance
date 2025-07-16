"use client";

import { Container } from "@/app/components/container";

export default function ProductLoading() {
  return (
    <Container>
      <div className="py-4 md:py-8 animate-pulse">
        {/* Container principal */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
            {/* Coluna de imagens */}
            <div className="lg:w-1/2 p-4">
              <div className="relative">
                {/* Imagem principal */}
                <div className="w-full aspect-square bg-gray-200 rounded-lg" />
                
                {/* Miniaturas - desktop (lado esquerdo) */}
                <div className="hidden lg:flex flex-col gap-2 absolute top-0 -left-20">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-16 h-16 bg-gray-200 rounded-md" />
                  ))}
                </div>
                
                {/* Miniaturas - mobile (embaixo) */}
                <div className="lg:hidden mt-4 flex gap-2 overflow-x-auto">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0" />
                  ))}
                </div>
              </div>
            </div>

            {/* Coluna de detalhes */}
            <div className="lg:w-1/2 p-4 md:p-6">
              <div className="space-y-4 md:space-y-5">
                {/* Título e preço */}
                <div>
                  <div className="h-8 w-3/4 bg-gray-200 rounded mb-4" />
                  <div className="h-10 w-40 bg-gray-200 rounded" />
                </div>

                {/* Seletor de variantes */}
                <div className="space-y-3">
                  <div className="h-6 w-32 bg-gray-200 rounded" />
                  <div className="flex flex-wrap gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-24 h-8 bg-gray-200 rounded-full" />
                    ))}
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="hidden md:flex gap-3">
                  <div className="h-12 w-48 bg-gray-200 rounded-lg" />
                  <div className="h-12 w-12 bg-gray-200 rounded-lg" />
                </div>

                {/* Cards de informações */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-200 p-2 rounded-full">
                          <div className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                          <div className="h-4 w-full bg-gray-200 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Accordions */}
                <div className="space-y-3 md:space-y-4 pt-2">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-200 p-2 rounded-full">
                          <div className="w-5 h-5" />
                        </div>
                        <div className="h-6 w-2/3 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="md:hidden mt-4">
                  <div className="h-12 w-full bg-gray-200 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produtos relacionados */}
        <div className="mt-10 md:mt-16">
          <div className="h-7 w-56 bg-gray-200 rounded mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}