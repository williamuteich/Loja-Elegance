"use client";

import { saveAddress } from "@/app/actions/newAddresses";
import { Home } from "lucide-react";
import { useState } from "react";

export default function NewAddresses({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [addressData, setAddressData] = useState({
    cep: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: "",
    numero: "",
    complemento: "",
  });

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
    if (!addressData.numero.trim()) {
      alert("Por favor, insira o número da residência.");
      return;
    }
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await saveAddress(userId, formData);
    setLoading(false);
    alert("Endereço cadastrado com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto rounded-xl border border-gray-200 bg-white p-8 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Home className="h-6 w-6 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-800">Adicionar novo endereço</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">CEP</label>
        <input
          name="cep"
          value={addressData.cep}
          onChange={handleCepChange}
          onBlur={handleCepBlur}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-700"
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
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-700"
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
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-700"
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
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-700"
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
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-700"
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
            onChange={(e) => setAddressData({ ...addressData, numero: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-700"
            placeholder="123"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Complemento</label>
          <input
            name="complemento"
            value={addressData.complemento}
            onChange={(e) => setAddressData({ ...addressData, complemento: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-700"
            placeholder="Apto, bloco…"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="submit"
          className="rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-800 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar endereço"}
        </button>
      </div>
    </form>
  );
}
