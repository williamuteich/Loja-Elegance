"use client";

import AddToCartButton from "@/app/components/addTocartButton";
import { Produto, VariantProps } from "@/utils/types/produto";
import { useState, useEffect } from "react";
import { FaBox } from "react-icons/fa";

export default function EstoqueProdutos({
  isActive,
  produtos,
}: {
  isActive: boolean;
  availableStock: number;
  colors: string[];
  hex: string[];
  stock: number[];
  produtos: Produto;
}) {
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [selectedVariant, setSelectedVariant] = useState(produtos.variants[0]);

  useEffect(() => {
    setSelectedVariant(produtos.variants[0]);
  }, [produtos.variants]);

  const handleClick = (index: number) => {
    setSelectedColorIndex(index);
    setSelectedVariant(produtos.variants[index]);
  };

  return (
    <div>
      <div className="space-y-0">
        <h3 className="text-sm text-gray-700 font-bold my-2">Estoque Disponível</h3>
        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded shadow-sm">
          <FaBox size={20} className="text-pink-700" />
          <p className="text-md font-bold text-pink-700">
            {isActive && selectedVariant?.availableStock > 0
              ? `${selectedVariant.availableStock} ${selectedVariant.availableStock > 1 ? "Disponíveis" : "Disponível"}`
              : "Indisponível"}
          </p>
        </div>
      </div>

      <div>
        {selectedVariant && (
          <div className="my-2">
            <h3 className="text-md font-bold">
              Cor Selecionada: <span className="underline text-gray-600">{selectedVariant.color.name}</span>
            </h3>
          </div>
        )}
        <div className="flex gap-2 mt-2">
          {produtos.variants.map((variant: VariantProps, index: number) => (
            <button
              key={variant.id}
              className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all duration-300 mb-4`}
              style={{
                backgroundColor: variant.color.hexCode,
                borderColor: selectedColorIndex === index ? "black" : "gray",
                borderWidth: selectedColorIndex === index ? "2px" : "0.8px",
              }}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </div>

      {selectedVariant?.availableStock > 0 ? (
        <AddToCartButton
          produto={produtos}
          selectedVariant={selectedVariant}
        />
      ) : (
        <button
          className="uppercase text-white py-3 px-6 rounded mt-0 w-full bg-gray-600 cursor-not-allowed"
          disabled
        >
          Produto Indisponível
        </button>
      )}
    </div>
  );
}
