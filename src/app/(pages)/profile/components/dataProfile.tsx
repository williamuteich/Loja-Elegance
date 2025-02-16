"use client";

import { useState } from "react";
import { EnderecoProps, UserProps } from "@/utils/types/user";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DataProfile({
  data,
  endereco,
  userID,
}: {
  data: UserProps;
  endereco: EnderecoProps;
  userID: string;
}) {

  const [editInfo, setEditInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [originalUserData] = useState(data);
  const [originalAddressData] = useState(endereco);

  const [userInfo, setUserInfo] = useState({
    name: data.name,
    email: data.email,
    telefone: data.telefone,
  });

  const [addressInfo, setAddressInfo] = useState({
    logradouro: endereco.logradouro,
    bairro: endereco.bairro,
    cidade: endereco.cidade,
    cep: endereco.cep,
    estado: endereco.estado,
    numero: endereco.numero || "",
    complemento: endereco.complemento || "",
    pais: endereco.pais || "",
  });

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setUserInfo({
      name: originalUserData.name,
      email: originalUserData.email,
      telefone: originalUserData.telefone,
    });
    setAddressInfo({
      logradouro: originalAddressData.logradouro,
      bairro: originalAddressData.bairro,
      cidade: originalAddressData.cidade,
      cep: originalAddressData.cep,
      estado: originalAddressData.estado,
      numero: originalAddressData.numero || "",
      complemento: originalAddressData.complemento || "",
      pais: originalAddressData.pais || "",
    });
    setEditInfo(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const response = await fetch(`/api/addresses?userID=${userID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID,
        name: userInfo.name,
        email: userInfo.email,
        telefone: userInfo.telefone,
        cep: addressInfo.cep,
        logradouro: addressInfo.logradouro,
        numero: addressInfo.numero,
        complemento: addressInfo.complemento,
        bairro: addressInfo.bairro,
        cidade: addressInfo.cidade,
        estado: addressInfo.estado,
        pais: addressInfo.pais,
      }),
    });

    if (!response.ok) {
      toast.error("Erro ao salvar informações do usuário");
      setIsLoading(false);
      return;
    }

    toast.success("Informações salvas com sucesso");
    setIsLoading(false);
  };

  if (!data || !endereco) {
    return <div>Carregando dados...</div>;
  }

  return (
    <div className="space-y-12">
      <div>
        <ToastContainer />
        <h2 className="text-2xl font-semibold mb-4">Informações do Usuário</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              name="name"
              value={userInfo.name || ""}
              disabled={!editInfo}
              onChange={handleUserChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={userInfo.email || ""}
              disabled={!editInfo}
              onChange={handleUserChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Celular</label>
            <input
              type="text"
              name="telefone"
              value={userInfo.telefone || ""}
              disabled={!editInfo}
              onChange={handleUserChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Meu Endereço</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Endereço</label>
            <input
              type="text"
              name="logradouro"
              value={addressInfo.logradouro || ""}
              disabled={!editInfo}
              onChange={handleAddressChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bairro</label>
            <input
              type="text"
              name="bairro"
              value={addressInfo.bairro || ""}
              disabled={!editInfo}
              onChange={handleAddressChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cidade</label>
            <input
              type="text"
              name="cidade"
              value={addressInfo.cidade || ""}
              disabled={!editInfo}
              onChange={handleAddressChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CEP</label>
            <input
              type="text"
              name="cep"
              value={addressInfo.cep || ""}
              disabled={!editInfo}
              onChange={handleAddressChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <input
              type="text"
              name="estado"
              value={addressInfo.estado || ""}
              disabled={!editInfo}
              onChange={handleAddressChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Número</label>
            <input
              type="text"
              name="numero"
              value={addressInfo.numero || ""}
              disabled={!editInfo}
              onChange={handleAddressChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Complemento</label>
            <input
              type="text"
              name="complemento"
              value={addressInfo.complemento || ""}
              disabled={!editInfo}
              onChange={handleAddressChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">País</label>
            <input
              type="text"
              name="pais"
              value={addressInfo.pais || ""}
              disabled={!editInfo}
              onChange={handleAddressChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        {!editInfo && (
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-md font-medium"
            onClick={() => setEditInfo(!editInfo)}
          >
            Editar
          </button>
        )}
        {editInfo && (
          <>
            <button
              className="bg-green-500 text-white px-6 py-2 rounded-md font-medium ml-4"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Carregando..." : "Salvar"}
            </button>
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-md font-medium ml-4"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
