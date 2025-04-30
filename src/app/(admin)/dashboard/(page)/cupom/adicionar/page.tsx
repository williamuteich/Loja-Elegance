"use client";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import Container from "../../components/Container";
import Link from "next/link";
import { NumericFormat } from "react-number-format";

type Categoria = {
    id: string;
    name: string;
};

export default function AdicionarCupom() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [qtdCupom, setQtdCupom] = useState(''); 

   // useEffect(() => {
   //     async function fetchData() {
   //         try {
   //             const categoriesRes = await fetch("/api/publica/category");
   //             const categoriesData = await categoriesRes.json();
   //             setCategorias(categoriesData.category);
   //         } catch (error) {
   //             alert("Erro ao carregar dados");
   //         }
   //     }
   //     fetchData();
   // }, []);

    const handleForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsLoading(true);

        const form = new FormData(event.target as HTMLFormElement);

        const data = {
            code: form.get("code"),
            type: form.get("type"),
            value: form.get("value"),
            min_purchase: form.get("min_purchase"),
            expires_at: form.get("expires_at"),
            category_ids: form.getAll("category"),
            active: form.get("active"),
        };

        const response = await fetch("/api/cupom", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            toast.error("Erro ao adicionar produto", {
                position: "top-center",
                autoClose: 3000,
            });
        } else {
            toast.success("Produto adicionado com sucesso!", {
                position: "top-center",
                autoClose: 3000,
            });
        }

        setIsLoading(false);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (e.target.value) {
            setQtdCupom('1'); 
        } else {
            setQtdCupom(''); 
        }
    };

    const handleQtdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!email) {
            setQtdCupom(e.target.value); 
        }
    };

    return (
        <Container>
            <ToastContainer />
            <Link href="/dashboard/cupom">
                <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-200 flex items-center">
                    <FaArrowLeft size={14} className="mr-2" /> Voltar
                </Button>
            </Link>
            <h2 className="text-2xl font-semibold mt-8 mb-6 text-gray-900">Adicionar Cupom</h2>
            <form onSubmit={handleForm} method="POST" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">Nome do Código</label>
                        <input
                            id="code"
                            name="code"
                            type="text"
                            placeholder="Digite o nome do Código"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de Desconto</label>
                        <select
                            id="type"
                            name="type"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="porcentagem">Porcentagem - %</option>
                            <option value="reais">Reais - R$</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="value" className="block text-sm font-medium text-gray-700">Valor do Desconto</label>
                        <NumericFormat id="value" name="value" placeholder="Digite o valor do desconto" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" thousandSeparator="." decimalSeparator="," prefix="R$ " decimalScale={2} fixedDecimalScale />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="min_purchase" className="block text-sm font-medium text-gray-700">Valor Mínimo de Compra</label>
                        <NumericFormat id="min_purchase" name="min_purchase" placeholder="Digite o valor mínimo de compra" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" thousandSeparator="." decimalSeparator="," prefix="R$ " decimalScale={2} fixedDecimalScale />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700">Data de Expiração</label>
                        <input
                            id="expires_at"
                            name="expires_at"
                            type="date"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
                        <Select
                            id="category"
                            name="category"
                            isMulti
                            options={categorias.map((categoria: Categoria) => ({
                                label: categoria.name,
                                value: categoria.id,
                            }))}
                            className="react-select-container"
                            instanceId="category-select"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="active" className="block text-sm font-medium text-gray-700">Ativo</label>
                        <select
                            id="active"
                            name="active"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="true">Ativo</option>
                            <option value="false">Inativo</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Uso Exclusivo)</label>
                        <input
                            onChange={handleEmailChange}
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            placeholder="Email para vincular o cupom"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="qtdCupom" className="block text-sm font-medium text-gray-700">Quantidade de Cupom</label>
                        <input
                            id="qtdCupom"
                            name="qtdCupom"
                            type="number"
                            value={qtdCupom}
                            onChange={handleQtdChange}
                            placeholder="Quantidade de cupons"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={email !== ''} // Desabilita o campo se o email estiver preenchido
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <Button type="submit" className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500" disabled={isLoading}>
                        {isLoading ? (
                            <svg className="animate-spin w-5 h-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10" strokeWidth="4" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z" />
                            </svg>
                        ) : (
                            "Adicionar Cupom"
                        )}
                    </Button>
                </div>
            </form>
        </Container>
    );
}
