"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AddressContextType {
  address: any;
  setAddress: (address: any) => void;
  fetchAddress: (userID: string) => Promise<void>;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<any>(null);

  const fetchAddress = async (userID: string) => {
    try {
      const response = await fetch(`/api/privada/addresses?userID=${userID}`);
      if (!response.ok) throw new Error('Erro ao buscar endereço');
      const data = await response.json();
      setAddress(data.enderecos?.[0] || null);
    } catch (error) {
      setAddress(null);
    }
  };

  return (
    <AddressContext.Provider value={{ address, setAddress, fetchAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};
