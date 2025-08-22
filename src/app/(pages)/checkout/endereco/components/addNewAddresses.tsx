"use client";

import { saveAddress } from "@/app/actions/newAddresses";
import { Home, User, Mail, Phone, FileText } from "lucide-react";
import { useState, useEffect } from "react";

interface UserData {
  name: string | null;
  email: string | null;
  cpf: string | null;
  telefone: string | null;
}

export default function NewAddresses({ userId, userData }: { userId: string; userData: UserData }) {
  // ...existing code...
  // Impede letras ao colar no campo número
  const handleNumeroPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, "");
    e.preventDefault();
    setAddressData({ ...addressData, numero: paste });
  };
  // ...existing code...
  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setAddressData({ ...addressData, numero: value });
  };
  const [loading, setLoading] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: userData.name || "",
    email: userData.email || "",
    cpf: userData.cpf || "",
    telefone: userData.telefone || "",
  });
  const [addressData, setAddressData] = useState({
    cep: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: "",
    numero: "",
    complemento: "",
  });

  // Validação de CPF: 11 dígitos e formato correto
  const isCpfValido = (() => {
    const cpf = userFormData.cpf.replace(/\D/g, "");
    return cpf.length === 11 && /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(userFormData.cpf);
  })();

  // Verificar se dados pessoais estão completos e CPF válido
  const isDadosCompletos = userFormData.name && userFormData.email && userFormData.telefone && isCpfValido;

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

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === "cpf") {
      formattedValue = formatCPF(value);
    } else if (name === "telefone") {
      formattedValue = formatTelefone(value);
    }

    setUserFormData(prev => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    // aplica máscara
    const masked = value.replace(/^(\d{5})(\d{0,3})$/, (_, p1, p2) => (p2 ? `${p1}-${p2}` : p1));
    setAddressData({ ...addressData, cep: masked });
  };

  const handleCepBlur = async () => {
    const cep = addressData.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;

    setLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (data.erro) throw new Error("CEP não encontrado");

      setAddressData({
        ...addressData,
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
      });
    } catch {
      alert("CEP inválido. Por favor, verifique o número digitado.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Verificar se dados pessoais estão completos
    if (!isDadosCompletos) {
      alert("Por favor, complete todos os dados pessoais antes de salvar o endereço.");
      return;
    }
    
    if (!addressData.numero.trim()) {
      alert("Por favor, insira o número da residência.");
      return;
    }
    
    setLoading(true);
    // Salvar dados pessoais e endereço juntos
    const formData = new FormData();
    Object.entries(addressData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    Object.entries(userFormData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    await saveAddress(userId, formData);
    setLoading(false);
    alert("Dados pessoais e endereço salvos com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto rounded-xl border border-gray-200 bg-white p-8 space-y-6">
      {/* Seção Dados Pessoais */}
      <div className="border-b border-gray-200 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <User className="w-4 h-4 inline mr-1" />
              Nome Completo *
            </label>
            <input
              type="text"
              name="name"
              value={userFormData.name}
              onChange={handleUserChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <Mail className="w-4 h-4 inline mr-1" />
              E-mail *
            </label>
            <input
              type="email"
              name="email"
              value={userFormData.email}
              onChange={handleUserChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <FileText className="w-4 h-4 inline mr-1" />
              CPF *
            </label>
            <input
              type="text"
              name="cpf"
              value={userFormData.cpf}
              onChange={handleUserChange}
              className={`mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 ${isCpfValido || userFormData.cpf.length === 0 ? "focus:ring-pink-500" : "focus:ring-red-500 border-red-400"}`}
              placeholder="000.000.000-00"
              maxLength={14}
              required
            />
            {!isCpfValido && userFormData.cpf.length > 0 && (
              <span className="text-xs text-red-600">CPF inválido. Exemplo: 869.842.920-34</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <Phone className="w-4 h-4 inline mr-1" />
              Telefone *
            </label>
            <input
              type="text"
              name="telefone"
              value={userFormData.telefone}
              onChange={handleUserChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="(11) 99999-9999"
              maxLength={15}
              required
            />
          </div>
        </div>
      </div>

      {/* Seção Endereço */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Home className="h-6 w-6 text-pink-600" />
          <h2 className="text-lg font-semibold text-pink-700">Endereço de Entrega</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">CEP</label>
          <input
            name="cep"
            value={addressData.cep}
            onChange={handleCepChange}
            onBlur={handleCepBlur}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="00000-000"
            required
            disabled={loading}
          />
          {loading && <p className="mt-1 text-sm text-gray-500">Buscando endereço...</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Logradouro</label>
          <input
            name="logradouro"
            value={addressData.logradouro}
            onChange={(e) => setAddressData({ ...addressData, logradouro: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Rua, Avenida, etc."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bairro</label>
          <input
            name="bairro"
            value={addressData.bairro}
            onChange={(e) => setAddressData({ ...addressData, bairro: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Nome do bairro"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cidade</label>
            <input
              name="cidade"
              value={addressData.cidade}
              onChange={(e) => setAddressData({ ...addressData, cidade: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Cidade"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <input
              name="estado"
              value={addressData.estado}
              onChange={(e) => setAddressData({ ...addressData, estado: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="UF"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Número</label>
            <input
              name="numero"
              value={addressData.numero}
              onChange={handleNumeroChange}
              onPaste={handleNumeroPaste}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="123"
              required
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Complemento</label>
            <input
              name="complemento"
              value={addressData.complemento}
              onChange={(e) => setAddressData({ ...addressData, complemento: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Apto, bloco…"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="submit"
            className={`rounded-lg px-6 py-2 flex items-center gap-2 font-semibold transition ${isDadosCompletos && !loading ? "bg-pink-600 text-white hover:bg-pink-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            disabled={loading || !isDadosCompletos}
          >
            {loading ? "Salvando..." : "Salvar Dados e Endereço"}
          </button>
        </div>
      </div>
    </form>
  );
}
