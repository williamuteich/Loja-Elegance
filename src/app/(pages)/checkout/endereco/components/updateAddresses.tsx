"use client";

import { useState } from "react";
import { updateAddress } from "@/app/actions/updateAddresses";
import { Endereco } from "@/utils/types/endereco";
import { MapPin, Home, Hash, Building2, Landmark, Navigation2, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

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
    if (!address) return;

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
        window.location.href = "/checkout";
      } else {
        setFormStates((prev) =>
          prev.map((f) =>
            f.id === id
              ? { ...f, loading: false, error: response.error || "Erro ao atualizar o endereço." }
              : f
          )
        );
      }
    } catch {
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
    <div className="space-y-6">
      {globalLoading && <p className="text-center text-blue-600">Carregando...</p>}
      {formStates.map((address) => (
        <div
          key={address.id}
          className="p-6 border rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all space-y-4"
        >
          {address.error && (
            <div
              className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
                address.error.includes("sucesso")
                  ? "bg-green-50 text-green-600 border border-green-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              {address.error.includes("sucesso") ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {address.error}
            </div>
          )}

          <div className="text-gray-700">
            <p className="font-bold text-lg flex items-center gap-2">
              <Home className="w-5 h-5" /> {address.logradouro}, {address.numero}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {address.bairro}, {address.cidade} - {address.estado},{" "}
              CEP {address.cep}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="CEP" icon={<Navigation2 />} value={address.cep} onChange={(e) => handleCepChange(address.id, e.target.value)} onBlur={() => handleCepBlur(address.id)} />
            <Input label="Logradouro" icon={<Landmark />} value={address.logradouro} onChange={(e) => handleChange(address.id, "logradouro", e.target.value)} />
            <Input label="Número" icon={<Hash />} value={address.numero} onChange={(e) => handleChange(address.id, "numero", e.target.value)} />
            <Input label="Bairro" icon={<Building2 />} value={address.bairro} onChange={(e) => handleChange(address.id, "bairro", e.target.value)} />
            <Input label="Cidade" icon={<Building2 />} value={address.cidade} onChange={(e) => handleChange(address.id, "cidade", e.target.value)} />
            <Input label="Estado" icon={<Building2 />} value={address.estado} onChange={(e) => handleChange(address.id, "estado", e.target.value)} />
            <Input label="Complemento" icon={<FileText />} value={address.complemento || ""} onChange={(e) => handleChange(address.id, "complemento", e.target.value)} />
          </div>

          <button
            type="button"
            disabled={!isValid(address) || address.loading}
            onClick={() => handleSubmit(address.id)}
            className={`w-full flex justify-center items-center gap-2 mt-2 rounded-lg px-4 py-2 font-medium text-white transition ${
              isValid(address)
                ? "bg-gray-800 hover:bg-gray-900"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {address.loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Atualizando...
              </>
            ) : (
              "Atualizar Endereço"
            )}
          </button>
        </div>
      ))}
    </div>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  icon?: React.ReactNode;
};

function Input({ label, value, onChange, onBlur, icon }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <div className="flex items-center border rounded-lg px-2 bg-gray-50 focus-within:ring-2 focus-within:ring-gray-400">
        {icon && <span className="text-gray-400 mr-2">{icon}</span>}
        <input
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="w-full bg-transparent outline-none py-2"
        />
      </div>
    </div>
  );
}
