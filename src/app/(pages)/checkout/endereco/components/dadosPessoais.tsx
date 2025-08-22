"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, FileText, Save, Edit3 } from "lucide-react";

interface DadosPessoaisProps {
  userData: {
    name: string | null;
    email: string | null;
    cpf: string | null;
    telefone: string | null;
  };
  userID: string;
}

export default function DadosPessoais({ userData, userID }: DadosPessoaisProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name || "",
    email: userData.email || "",
    cpf: userData.cpf || "",
    telefone: userData.telefone || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Verificar se dados obrigatórios estão preenchidos
  const isDadosCompletos = formData.name && formData.email && formData.cpf && formData.telefone;

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  // Função para formatar telefone
  const formatTelefone = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= 10) {
      return numericValue
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      return numericValue
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === "cpf") {
      formattedValue = formatCPF(value);
    } else if (name === "telefone") {
      formattedValue = formatTelefone(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isDadosCompletos) {
      setMessage({
        type: "error",
        text: "Todos os campos são obrigatórios para continuar com a compra."
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/publica/updateUserData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID,
          ...formData,
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Dados pessoais atualizados com sucesso!"
        });
        setIsEditing(false);
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.message || "Erro ao atualizar dados pessoais"
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      setMessage({
        type: "error",
        text: "Erro interno do servidor"
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-editar se dados estão incompletos
  useEffect(() => {
    if (!isDadosCompletos) {
      setIsEditing(true);
    }
  }, [isDadosCompletos]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-pink-700 flex items-center gap-2">
            <User className="w-5 h-5" />
            Dados Pessoais
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {!isDadosCompletos ? (
              <span className="text-red-600 font-medium">
                ⚠️ Complete seus dados para continuar com a compra
              </span>
            ) : (
              "Informações necessárias para emissão da nota fiscal"
            )}
          </p>
        </div>
        
        {isDadosCompletos && !isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 border-pink-300 text-pink-700 hover:bg-pink-50"
          >
            <Edit3 className="w-4 h-4" />
            Editar
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Nome Completo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                E-mail *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                CPF *
              </label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Telefone *
              </label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="(11) 99999-9999"
                maxLength={15}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading || !isDadosCompletos}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white"
            >
              <Save className="w-4 h-4" />
              {loading ? "Salvando..." : "Salvar Dados"}
            </Button>
            
            {isDadosCompletos && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="border-pink-300 text-pink-700 hover:bg-pink-50"
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4" />
              Nome
            </div>
            <p className="text-gray-900">{formData.name}</p>
          </div>

          <div className="p-3 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4" />
              E-mail
            </div>
            <p className="text-gray-900">{formData.email}</p>
          </div>

          <div className="p-3 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <FileText className="w-4 h-4" />
              CPF
            </div>
            <p className="text-gray-900">{formData.cpf}</p>
          </div>

          <div className="p-3 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Phone className="w-4 h-4" />
              Telefone
            </div>
            <p className="text-gray-900">{formData.telefone}</p>
          </div>
        </div>
      )}

      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          message.type === "success" 
            ? "bg-green-50 text-green-800 border border-green-200" 
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
