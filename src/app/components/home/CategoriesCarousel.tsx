import React from "react";
import { ClientCategoriesCarousel } from "./ClientCategoriesCarousel";

async function getCategories() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/publica/category?fetchAll=true`, {
      cache: 'force-cache',
      next: { tags: ['reloadCategory'] } 
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar categorias: ${response.status}`);
    }
    
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return { categories: [] };
  }
}

export default async function CategoriesCarousel() {
  const data = await getCategories();

  const categories = data.category || [];
  return (
    <div className="w-full py-4">
      <div className="relative w-full max-w-5xl mx-auto px-4">
        <div className="relative">
          <ClientCategoriesCarousel categories={categories} delay={4000} />
        </div>
      </div>
    </div>
  );
}