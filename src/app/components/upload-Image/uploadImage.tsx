"use client"
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface UploadImageProps {
  onImagesSelected: (images: File[]) => void;
  limit?: number;
}

const UploadImage: React.FC<UploadImageProps> = ({ onImagesSelected, limit = Infinity }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      if (filesArray.length > limit) {
        alert(`Você pode adicionar no máximo ${limit} imagem(s).`);
        return;
      }

      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
      setImageUrls((prev) => (limit === 1 ? newImageUrls : [...prev, ...newImageUrls]));
      setImages((prev) => (limit === 1 ? filesArray : [...prev, ...filesArray]));
      onImagesSelected(filesArray);

    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImageUrls = imageUrls.filter((_, i) => i !== index);
    const updatedImages = images.filter((_, i) => i !== index);

    setImageUrls(updatedImageUrls);
    setImages(updatedImages);
    onImagesSelected(updatedImages);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        hidden
        multiple={limit !== 1}
        ref={imageInputRef}
        onChange={handleImageChange}
      />
      <Button
        className="bg-blue-600 text-white py-2 w-full hover:bg-blue-500 rounded-lg"
        onClick={(e) => {
          e.preventDefault();
          imageInputRef.current?.click();
        }}
      >
        Selecionar imagens
      </Button>

      <div className="flex gap-4 overflow-x-auto mt-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative w-45 h-45">
            <Image
              src={url}
              alt={`img-${index}`}
              className="max-w-[300px] max-h-[300px] object-contain rounded-lg"
              style={{ maxWidth: 300, maxHeight: 300 }}
              width={300}
              height={300}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                handleRemoveImage(index);
              }}
              className="absolute text-xs top-0 right-0 bg-red-700 text-white px-2 py-1 rounded-full"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadImage;
