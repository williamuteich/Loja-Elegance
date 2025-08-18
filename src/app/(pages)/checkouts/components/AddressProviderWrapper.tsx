"use client";

import { AddressProvider } from '@/context/addressContext';
import { ReactNode } from 'react';

export function AddressProviderWrapper({ children }: { children: ReactNode }) {
  return <AddressProvider>{children}</AddressProvider>;
}
