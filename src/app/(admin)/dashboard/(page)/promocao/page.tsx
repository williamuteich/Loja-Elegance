'use client'
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Container from '../components/Container';

interface Produto {
  id: string;
  nome: string;
  precoOriginal: number;
  imagem: string;
  categoria: string;
  estoque: number;
}

interface ProdutoPromocao {
  produto: Produto;
  precoPromo: string;
  promotionDeadline: string;
}

export default function PromocaoProdutos() {
  const [produtosEmPromocao, setProdutosEmPromocao] = useState<ProdutoPromocao[]>([]);
  const [termoBusca, setTermoBusca] = useState<string>('');
  const [resultadosBusca, setResultadosBusca] = useState<Produto[]>([]);
  const [mostrarResultados, setMostrarResultados] = useState<boolean>(false);
  const [buscaProdutos, setBuscaProdutos] = useState<Produto[]>([]);

  function formatarParaDatetimeLocalBrasileiro(dataUTC: string): string {
    const data = new Date(dataUTC);
  
    // Ajusta para horário de Brasília (GMT-3)
    const dataBrasilia = new Date(data.getTime() - 3 * 60 * 60 * 1000);
  
    const ano = dataBrasilia.getFullYear();
    const mes = String(dataBrasilia.getMonth() + 1).padStart(2, '0');
    const dia = String(dataBrasilia.getDate()).padStart(2, '0');
    const horas = String(dataBrasilia.getHours()).padStart(2, '0');
    const minutos = String(dataBrasilia.getMinutes()).padStart(2, '0');
  
    return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
  }
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/privada/product?fetchAll=true`, {
          method: "GET",
        });
  
        const data = await response.json();
        console.log("recebendo produtos", data)
  
        if (data.produtos && Array.isArray(data.produtos)) {
          const agora = new Date();
  
          const produtosMapeados = data.produtos.map((prod: any) => {
            const precoOriginal = prod.priceOld || prod.price;
            const estoque = prod.variants.reduce((total: number, variant: any) => {
              return total + (variant.stock?.quantity ?? 0);
            }, 0);
  
            return {
              id: prod.id,
              nome: prod.name,
              precoOriginal,
              imagem: prod.imagePrimary,
              categoria: prod.categories?.[0]?.category?.name || 'Sem categoria',
              estoque,
              onSale: prod.onSale,
              precoAtual: prod.price,
              promotionDeadline: prod.promotionDeadline,
            };
          });
  
          const ativos = produtosMapeados.filter(p =>
            p.onSale &&
            p.precoOriginal &&
            p.promotionDeadline &&
            new Date(p.promotionDeadline) > agora
          );
  
          const listaPromocoes = ativos.map(p => ({
            produto: {
              id: p.id,
              nome: p.nome,
              precoOriginal: p.precoOriginal,
              imagem: p.imagem,
              categoria: p.categoria,
              estoque: p.estoque,
            },
            precoPromo: p.precoAtual.toString(),
            promotionDeadline: p.promotionDeadline
              ? formatarParaDatetimeLocalBrasileiro(p.promotionDeadline)
              : ''
          }));
          
          const restantes = produtosMapeados
            .filter(p => !ativos.some(a => a.id === p.id))
            .map(p => ({
              id: p.id,
              nome: p.nome,
              precoOriginal: p.precoOriginal,
              imagem: p.imagem,
              categoria: p.categoria,
              estoque: p.estoque
            }));
  
          setProdutosEmPromocao(listaPromocoes);
          setBuscaProdutos(restantes);
        } else {
          setBuscaProdutos([]);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setBuscaProdutos([]);
      }
    };
  
    fetchData();
  }, []);
  
  
  useEffect(() => {
    if (termoBusca.trim() === '') {
      setResultadosBusca([]);
      return;
    }

    const resultado = buscaProdutos.filter(produto => 
      produto.nome && produto.nome.toLowerCase().includes(termoBusca.toLowerCase())
    );

    setResultadosBusca(resultado);
  }, [termoBusca, buscaProdutos]);

  const adicionarProdutoPromocao = (produto: Produto) => {
    if (produtosEmPromocao.some(p => p.produto.id === produto.id)) {
      toast.error('Este produto já está na lista de promoções.');
      return;
    }

    const novaPromocao: ProdutoPromocao = {
      produto,
      precoPromo: '',
      promotionDeadline: ''
    };

    setProdutosEmPromocao([...produtosEmPromocao, novaPromocao]);
    setTermoBusca('');
    setResultadosBusca([]);
  };

  const atualizarPromocao = (index: number, campo: string, valor: string) => {
    const novasPromocoes = [...produtosEmPromocao];
    if (campo === 'precoPromo') {
      novasPromocoes[index].precoPromo = valor;
    } else if (campo === 'promotionDeadline') {
      novasPromocoes[index].promotionDeadline = valor;
    }
    setProdutosEmPromocao(novasPromocoes);
  };

  const removerProdutoPromocao = (index: number) => {
    const novasPromocoes = [...produtosEmPromocao];
    novasPromocoes.splice(index, 1);
    setProdutosEmPromocao(novasPromocoes);
    toast.info('O produto foi removido da lista de promoções.');
  };

  const salvarPromocoes = async () => {
    const promocoesInvalidas = produtosEmPromocao.filter(promo =>
      !promo.precoPromo ||
      !promo.promotionDeadline ||
      parseFloat(promo.precoPromo) <= 0 ||
      parseFloat(promo.precoPromo) >= promo.produto.precoOriginal
    );

    if (promocoesInvalidas.length > 0) {
      toast.error('Verifique se todos os produtos têm preço promocional válido e data de término definida.');
      return;
    }

    await fetch("/api/privada/promo", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ produtos: produtosEmPromocao }),
    })

    toast.success('As promoções foram configuradas com sucesso.');
  };

  return (
    <Container>
      <ToastContainer />
      <div className="mx-auto">0
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 bg-clip-text">
            Gerenciador de Promoções
          </h2>
          <p className="text-gray-600 mt-3 text-base max-w-3xl">
            Selecione produtos e defina valores promocionais com período de validade. Após o término, o preço original será restaurado automaticamente.
          </p>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 border rounded-2xl shadow-lg p-6 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-pink-100 shadow-lg p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-pink-700 flex items-center">
                    <div className="bg-pink-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    Buscar produtos
                  </h2>
                  <span className="bg-pink-100 text-pink-800 text-sm font-medium px-3 py-1 rounded-full">
                    {buscaProdutos.length} produtos
                  </span>
                </div>

                <div className="relative mb-4">
                  <Input
                    type="text"
                    placeholder="Digite o nome do produto..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    onFocus={() => setMostrarResultados(true)}
                    className="py-5 text-base pl-12 rounded-xl border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {mostrarResultados && resultadosBusca.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="max-h-96 overflow-y-auto">
                      {resultadosBusca.map(produto => (
                        <div
                          key={produto.id}
                          className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all duration-200"
                        >
                          <div className="relative">
                            <img
                              src={produto.imagem}
                              alt={produto.nome}
                              className="w-16 h-16 object-contain rounded-xl border-2 border-pink-100 mr-4"
                            />
                            <div className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                              {produto.estoque}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 ml-3">{produto.nome}</h3>
                            <p className="text-xs text-pink-600 bg-indigo-50 px-2 py-1 rounded-full inline-block mt-1 font-medium">
                              {produto.categoria}
                            </p>
                            <p className="font-bold text-gray-800 mt-1">${produto.precoOriginal.toFixed(2)}</p>
                          </div>
                          <Button
                            onClick={() => adicionarProdutoPromocao(produto)}
                            className="bg-pink-400 text-white hover:bg-white hover:text-pink-600 transitio-200 border border-pink-400 shadow-md px-4 py-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Adicionar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {mostrarResultados && termoBusca && resultadosBusca.length === 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-8 text-center flex flex-col items-center">
                    <div className="bg-indigo-100 p-4 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Produto não encontrado</h3>
                    <p className="mt-2 text-gray-500">
                      Nenhum produto encontrado para "<span className="font-medium text-indigo-600">{termoBusca}</span>"
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <div className="bg-amber-100 p-2 rounded-lg mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                    Produtos em Promoção
                  </h2>
                  <span className="bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1 rounded-full">
                    {produtosEmPromocao.length} {produtosEmPromocao.length === 1 ? 'produto' : 'produtos'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  Defina o valor promocional e a data de término para cada produto
                </p>
              </div>

              {produtosEmPromocao.length > 0 ? (
                <>
                  <div className="space-y-5 max-h-[500px] overflow-y-auto pr-1">
                    {produtosEmPromocao.map((promocao, index) => (
                      <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex mb-4">
                          <img
                            src={promocao.produto.imagem}
                            alt={promocao.produto.nome}
                            className="w-16 h-16 object-contain rounded-xl border-2 border-pink-100 mr-4"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{promocao.produto.nome}</h3>
                            <div className="flex items-center mt-1">
                              <span className="text-gray-500 line-through mr-2 text-sm">
                                $ {promocao.produto.precoOriginal.toFixed(2)}
                              </span>
                              <span className="bg-gradient-to-r from-red-100 to-orange-100 text-red-700 text-sm font-bold px-2 py-0.5 rounded">
                                {promocao.precoPromo ? `$ ${parseFloat(promocao.precoPromo).toFixed(2)}` : 'Defina o valor'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removerProdutoPromocao(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors self-start"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Valor promocional
                            </label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                                $
                              </span>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="Digite o novo valor"
                                value={promocao.precoPromo}
                                onChange={(e) => atualizarPromocao(index, 'precoPromo', e.target.value)}
                                className="pl-10 py-4 rounded-lg border-indigo-100 focus:border-indigo-300"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Término da promoção
                            </label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </span>
                              <Input
                                type="datetime-local"
                                value={promocao.promotionDeadline}
                                onChange={(e) => atualizarPromocao(index, 'promotionDeadline', e.target.value)}
                                className="pl-10 py-4 rounded-lg border-indigo-100 focus:border-indigo-300"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-5 border-t border-gray-200">
                    <Button
                      onClick={salvarPromocoes}
                      className="w-full py-5 bg-pink-600 text-white hover:bg-pink-500 text-base font-bold shadow-lg transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Salvar Todas as Promoções
                    </Button>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl border-2 border-dashed border-pink-200 p-12 text-center flex flex-col items-center">
                  <div className="bg-pink-100 p-5 rounded-full mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-pink-700">Nenhum produto selecionado</h3>
                  <p className="mt-3 text-pink-500 max-w-md">
                    Busque produtos e adicione-os para criar promoções temporárias. Todos os produtos adicionados aparecerão aqui.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}