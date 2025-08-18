"use client";

import { useState, useEffect } from "react";
import { updateAddress } from "@/app/actions/updateAddresses";
import { Endereco } from "@/utils/types/endereco";

type UpdateAddressesProps = {
  enderecos: Endereco[];
  userID: string;
};

export default function UpdateAddresses({ enderecos, userID }: UpdateAddressesProps) {
  const [formStates, setFormStates] = useState(
    enderecos.map((e) => ({
      ...e,
      loading: false,
      error: "",
      cepValido: true, 
    }))
  );
  const [globalLoading, setGlobalLoading] = useState(false);

  const handleChange = (id: string, field: keyof Endereco, value: string) => {
    setFormStates((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, [field]: value, error: "", cepValido: f.cepValido } : f
      )
    );
  };

  const handleCepChange = (id: string, value: string) => {
    let cepValue = value.replace(/\D/g, "");
    if (cepValue.length > 8) cepValue = cepValue.slice(0, 8);
    const masked = cepValue.replace(/^(\d{5})(\d{0,3})$/, (_, p1, p2) =>
      p2 ? `${p1}-${p2}` : p1
    );
    handleChange(id, "cep", masked);

    // se o CEP tiver 8 dígitos, tenta buscar
    if (cepValue.length === 8) {
      handleCepBlur(id);
    } else {
      setFormStates((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, cepValido: false, error: "CEP incompleto." } : f
        )
      );
    }
  };

  const handleCepBlur = async (id: string) => {
    const address = formStates.find((f) => f.id === id);
    if (!address) return;
    const cep = address.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (data.erro) {
        setFormStates((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, cepValido: false, error: "CEP não encontrado." } : f
          )
        );
        return;
      }

      setFormStates((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                logradouro: data.logradouro || "",
                bairro: data.bairro || "",
                cidade: data.localidade || "",
                estado: data.uf || "",
                error: "",
                cepValido: true,
              }
            : f
        )
      );
    } catch {
      setFormStates((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, cepValido: false, error: "Erro ao buscar CEP." } : f
        )
      );
    }
  };

  const isValid = (address: Endereco & { cepValido?: boolean }) => {
    return (
      address.cep.trim() &&
      address.logradouro.trim() &&
      address.numero.trim() &&
      address.bairro.trim() &&
      address.cidade.trim() &&
      address.estado.trim() &&
      address.cepValido
    );
  };


  const handleSubmit = async (id: string) => {
    const address = formStates.find((f) => f.id === id);
    if (!address) {
      console.error("Endereço não encontrado para o ID:", id);
      return;
    }

    if (!isValid(address)) {
      setFormStates((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, error: "Por favor, preencha todos os campos corretamente." }
            : f
        )
      );
      return;
    }

    if (!address.id) {
      setFormStates((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, error: "Endereço inválido. ID ausente." } : f
        )
      );
      return;
    }

    setGlobalLoading(true);
    setFormStates((prev) =>
      prev.map((f) => (f.id === id ? { ...f, loading: true, error: "" } : f))
    );

    const formData = new FormData();
    formData.append("cep", address.cep);
    formData.append("logradouro", address.logradouro);
    formData.append("numero", address.numero);
    formData.append("bairro", address.bairro);
    formData.append("cidade", address.cidade);
    formData.append("estado", address.estado);
    formData.append("complemento", address.complemento || "");

    try {
      const response = await updateAddress(userID, address.id, formData);
      if (response.success) {
        setFormStates((prev) =>
          prev.map((f) =>
            f.id === id
              ? { ...f, loading: false, error: "Endereço atualizado com sucesso!" }
              : f
          )
        );
        window.location.href = "/checkout"; // Redireciona para /checkouts após sucesso
      } else {
        setFormStates((prev) =>
          prev.map((f) =>
            f.id === id
              ? { ...f, loading: false, error: response.error || "Erro ao atualizar o endereço." }
              : f
          )
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar o endereço:", error);
      setFormStates((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, loading: false, error: "Erro ao atualizar o endereço." }
            : f
        )
      );
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {globalLoading && <p className="text-center text-blue-600">Carregando...</p>}
      {formStates.map((address, index) => (
        <div
          key={`${address.id}-${index}`}
          className="p-4 border rounded-xl bg-white shadow-sm flex flex-col gap-2"
        >
          {address.error && (
            <p
              className={`text-sm ${
                address.error.includes("sucesso") ? "text-green-600" : "text-red-600"
              } font-medium`}
            >
              {address.error}
            </p>
          )}

          <div className="flex flex-col">
            <p className="font-semibold">
              {address.logradouro}, {address.numero}
            </p>
            <p className="text-sm text-gray-500">
              {address.bairro}, {address.cidade}, {address.estado}, CEP{" "}
              {address.cep.replace(/\D/g, "")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              name="cep"
              value={address.cep}
              onChange={(e) => handleCepChange(address.id, e.target.value)}
              onBlur={() => handleCepBlur(address.id)}
              className="border px-2 py-1 rounded"
              placeholder="CEP"
              required
            />
            <input
              name="logradouro"
              value={address.logradouro}
              onChange={(e) => handleChange(address.id, "logradouro", e.target.value)}
              className="border px-2 py-1 rounded"
              placeholder="Logradouro"
              required
            />
            <input
              name="numero"
              value={address.numero}
              onChange={(e) => handleChange(address.id, "numero", e.target.value)}
              className="border px-2 py-1 rounded"
              placeholder="Número"
              required
            />
            <input
              name="bairro"
              value={address.bairro}
              onChange={(e) => handleChange(address.id, "bairro", e.target.value)}
              className="border px-2 py-1 rounded"
              placeholder="Bairro"
              required
            />
            <input
              name="cidade"
              value={address.cidade}
              onChange={(e) => handleChange(address.id, "cidade", e.target.value)}
              className="border px-2 py-1 rounded"
              placeholder="Cidade"
              required
            />
            <input
              name="estado"
              value={address.estado}
              onChange={(e) => handleChange(address.id, "estado", e.target.value)}
              className="border px-2 py-1 rounded"
              placeholder="Estado"
              required
            />
            <input
              name="complemento"
              value={address.complemento || ""}
              onChange={(e) => handleChange(address.id, "complemento", e.target.value)}
              className="border px-2 py-1 rounded"
              placeholder="Complemento (opcional)"
            />
          </div>

          <button
            type="button"
            disabled={!isValid(address) || address.loading}
            onClick={() => handleSubmit(address.id)}
            className={`mt-2 rounded-lg px-4 py-1 text-white ${
              isValid(address)
                ? "bg-gray-700 hover:bg-gray-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {address.loading ? "Atualizando..." : "Atualizar"}
          </button>
        </div>
      ))}
    </div>
  );
}
