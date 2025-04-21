"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UploadImage from "@/app/components/upload-Image/uploadImage";
import { uploadImage } from "@/supabase/storage/client";

export default function AdicionarBanner() {
  const [banners, setBanners] = useState<
    { imageFile?: File; alt: string; link?: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const adicionarBanner = () => {
    setBanners((prevBanners) => [
      ...prevBanners,
      { imageFile: undefined, alt: "", link: "" },
    ]);
  };

  const atualizarBanner = (
    index: number,
    campo: "imageFile" | "alt" | "link",
    valor: File | string | undefined
  ) => {
    setBanners((prevBanners) => {
      const novosBanners = [...prevBanners];
      novosBanners[index][campo] = valor as never;
      return novosBanners;
    });
  };

  const removerImagem = (index: number) => {
    atualizarBanner(index, "imageFile", undefined);
  };

  const salvarBanners = async () => {
    setIsLoading(true);
    try {
      const bannersParaSalvar = await Promise.all(
        banners.map(async (banner) => {
          if (!banner.imageFile || !banner.alt) {
            throw new Error("Imagem e alt são obrigatórios para cada banner");
          }

          const { imageUrl, error } = await uploadImage({
            file: banner.imageFile,
            bucket: "elegance",
          });

          if (error) {
            throw new Error("Erro ao fazer upload da imagem");
          }

          return {
            imageUrl,
            alt: banner.alt,
            link: banner.link || null,
          };
        })
      );

      const response = await fetch("/api/privada/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bannersParaSalvar),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar banners");
      }

      toast.success("Banners salvos com sucesso!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao salvar banners";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Adicionar Banners</h1>

      {banners.map((banner, index) => (
        <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Imagem do Banner
              </label>
              <UploadImage
                onImagesSelected={(files) =>
                  atualizarBanner(index, "imageFile", files[0])
                }
                limit={1}
              />
              {banner.imageFile && (
                <div className="mt-2 relative">
                  <img
                    src={URL.createObjectURL(banner.imageFile)}
                    alt={`Prévia do Banner ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removerImagem(index)}
                    className="absolute top-2 right-2 text-red-500"
                  >
                    Remover
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  Texto Alternativo (Alt)
                </label>
                <input
                  type="text"
                  value={banner.alt}
                  onChange={(e) =>
                    atualizarBanner(index, "alt", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Digite o texto alternativo"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  URL (opcional)
                </label>
                <input
                  type="text"
                  value={banner.link || ""}
                  onChange={(e) =>
                    atualizarBanner(index, "link", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Digite a URL"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={adicionarBanner}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Adicionar Banner
      </button>

      <div className="mt-6">
        <button
          type="button"
          onClick={salvarBanners}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
        >
          {isLoading ? "Salvando..." : "Salvar Banners"}
        </button>
      </div>
    </div>
  );
}
