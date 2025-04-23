"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaImage } from "react-icons/fa";
import Container from "../../components/Container";
import Link from "next/link";
import { uploadImage } from "@/supabase/storage/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UploadImage from "@/app/components/upload-Image/uploadImage";
import Image from "next/image";

export default function BannerEdit({ params }: { params: Promise<{ id: string }> }) {
  const [banner, setBanner] = useState<any>(null);
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    const { id } = await params;

    const bannerRes = await fetch(`/api/privada/banner?id=${id}`);
    if (!bannerRes.ok) {
      toast.error("Banner não encontrado");
      return;
    }

    const bannerData = await bannerRes.json();
    setBanner(bannerData.banners);
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const handlePrimaryImageSelection = (file: File) => setPrimaryImage(file);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);

    const uploadedImageUrls: string[] = [];

    if (primaryImage) {
      const { imageUrl: uploadedPrimaryImageUrl, error } = await uploadImage({
        file: primaryImage,
        bucket: "elegance",
      });
      if (!error) uploadedImageUrls.push(uploadedPrimaryImageUrl);
    } else if (banner.imageUrl) {
      uploadedImageUrls.push(banner.imageUrl);
    }

    const alt = event.target.alt.value; 
    const active = event.target.status.value === "true";
    const link = event.target.link.value;

    try {
      const response = await fetch("/api/privada/banner", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: banner.id,
          imageUrl: uploadedImageUrls[0],
          alt, 
          active,
          link,
        }),
      });

      if (!response.ok) {
        toast.error("Erro ao editar banner", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.success("Banner editado com sucesso!", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Erro ao editar banner", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!banner) return <Container>Banner não encontrado</Container>;

  return (
    <Container>
      <ToastContainer />
      <Link href="/dashboard/banners">
        <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-200 flex items-center">
          <FaArrowLeft size={14} className="mr-2" /> Voltar
        </Button>
      </Link>
      <h2 className="text-4xl font-semibold mt-8 mb-6 text-gray-900">Editar Banner</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2 w-full md:w-1/6">
          <label htmlFor="primaryImage" className="block text-lg font-medium text-gray-700">
            Imagem do Banner
          </label>
          <div>
            {primaryImage || banner?.imageUrl ? (
              <div className="flex flex-col items-center">
                <Image
                  src={primaryImage ? URL.createObjectURL(primaryImage) : banner.imageUrl}
                  alt="Imagem do Banner"
                  width={400}
                  height={200}
                  priority
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPrimaryImage(null);
                    setBanner((prevBanner: any) => ({ ...prevBanner, imageUrl: '' }));
                  }}
                  className="w-full px-4 py-2 bg-red-700 text-white rounded-lg"
                >
                  Remover Imagem
                </button>
              </div>
            ) : (
              <div className="p-4 bg-gray-200 flex items-center justify-center rounded-lg">
                <FaImage className="text-gray-500" size={110} />
              </div>
            )}

            {!primaryImage && !banner?.imageUrl && (
              <UploadImage onImagesSelected={(files) => handlePrimaryImageSelection(files[0])} limit={1} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="alt" className="block text-sm font-medium text-gray-700">
              Texto Alternativo (Alt)
            </label>
            <input
              id="alt"
              name="alt"
              type="text"
              defaultValue={banner?.alt || ""}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="link" className="block text-sm font-medium text-gray-700">
              Link (opcional)
            </label>
            <input
              id="link"
              name="link"
              type="text"
              defaultValue={banner?.link || ""}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={banner?.active ? "true" : "false"}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin w-5 h-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z" />
              </svg>
            ) : (
              "Editar Banner"
            )}
          </Button>
        </div>
      </form>
    </Container>
  );
}
