'use client';
import React from 'react';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function ResetPasswordLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {children}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Elegance. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
