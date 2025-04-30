"use client";

import { useState, useEffect } from "react";
import { EnderecoProps, UserProps } from "@/utils/types/user";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser } from 'react-icons/fa';
import Flag from "react-world-flags";

const COUNTRIES = [
  { code: "BR", name: "Brasil", dial: "+55" },
  { code: "UY", name: "Uruguai", dial: "+598" },
  { code: "AR", name: "Argentina", dial: "+54" },
];

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
  const [countryCode, setCountryCode] = useState("BR");
  const [phone, setPhone] = useState("");

  const [originalUserData] = useState(data);
  const [originalAddressData] = useState(endereco);

  const [userInfo, setUserInfo] = useState({
    name: data.name,
    email: data.email,
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

  useEffect(() => {
    if (data?.telefone) {
      const tel = data.telefone.replace(/\s/g, '');
      const foundCountry = COUNTRIES.find((country) =>
        tel.startsWith(country.dial.replace(/\s/g, ''))
      );

      if (foundCountry) {
        const phoneNumber = tel.slice(foundCountry.dial.length);
        setPhone(phoneNumber);
        setCountryCode(foundCountry.code);
      } else {
        setPhone(tel);
        setCountryCode("BR");
      }
    }
  }, [data.telefone]);

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
    setPhone(originalUserData.telefone ? 
      originalUserData.telefone.replace(/^\+\d+/, '') : '');
    setCountryCode("BR");
    setEditInfo(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const dial = COUNTRIES.find((c) => c.code === countryCode)!.dial.replace(/\s/g, '');
    const cleanPhone = phone.replace(/\D/g, '');
    const fullTelefone = `${dial}${cleanPhone}`;

    const response = await fetch(`/api/privada/addresses`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID,
        name: userInfo.name,
        email: userInfo.email,
        telefone: fullTelefone,
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
      toast.error("Error al guardar la información del usuario");
      setIsLoading(false);
      return;
    }

    toast.success("Información guardada con éxito");
    setIsLoading(false);
    setEditInfo(false);
  };

  if (!data || !endereco) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div className="space-y-12 w-full mt-6 lg:mt-0">
      <div>
        <ToastContainer />
        
        <h2 className="text-2xl font-semibold mb-6 text-pink-700 flex gap-3 items-center">
          <FaUser size={28} />
          Información del Usuario
        </h2>

        <div className="bg-white p-6 border rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-pink-700 mb-6">Datos Personales</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="name"
                value={userInfo.name || ""}
                disabled={!editInfo}
                onChange={handleUserChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={userInfo.email || ""}
                disabled={!editInfo}
                onChange={handleUserChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Celular</label>
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    disabled={!editInfo}
                    className={`pr-8 pl-10 py-3 border rounded-md ${
                      editInfo ? "cursor-pointer bg-white" : "cursor-not-allowed bg-gray-100"
                    }`}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.dial})
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute left-2 top-3">
                    <Flag code={countryCode} className="w-6 h-4 rounded-sm border" />
                  </div>
                </div>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    value={phone}
                    disabled={!editInfo}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className={`w-full p-3 border rounded-md focus:outline-none ${
                      editInfo 
                        ? "border-pink-400 focus:ring-2 focus:ring-pink-500 bg-white"
                        : "border-gray-300 bg-gray-100 cursor-not-allowed"
                    }`}
                    placeholder="Exemplo: 11987654321"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="bg-white p-6 border rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-pink-700 mb-6">Dirección</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <input
                type="text"
                name="logradouro"
                value={addressInfo.logradouro || ""}
                disabled={!editInfo}
                onChange={handleAddressChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Barrio</label>
              <input
                type="text"
                name="bairro"
                value={addressInfo.bairro || ""}
                disabled={!editInfo}
                onChange={handleAddressChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ciudad</label>
              <input
                type="text"
                name="cidade"
                value={addressInfo.cidade || ""}
                disabled={!editInfo}
                onChange={handleAddressChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Código Postal (CEP)</label>
              <input
                type="text"
                name="cep"
                value={addressInfo.cep || ""}
                disabled={!editInfo}
                onChange={handleAddressChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        {!editInfo && (
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-600"
            onClick={() => setEditInfo(!editInfo)}
          >
            Editar
          </button>
        )}
        {editInfo && (
          <>
            <button
              className="bg-green-500 text-white px-6 py-2 rounded-md font-medium hover:bg-green-600"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Cargando..." : "Guardar"}
            </button>
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-md font-medium hover:bg-red-600"
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