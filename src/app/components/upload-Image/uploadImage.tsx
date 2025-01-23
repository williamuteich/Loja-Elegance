"use client"
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface UploadImageProps {
  onImagesSelected: (images: File[]) => void;
  limit?: number; 
}

const UploadImage: React.FC<UploadImageProps> = ({ onImagesSelected, limit = Infinity }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]); // URLs das imagens
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      if (filesArray.length > limit) {
        alert(`Você pode adicionar no máximo ${limit} imagem(s).`);
        return;
      }
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));

      setImageUrls((prev) => (limit === 1 ? newImageUrls : [...prev, ...newImageUrls]));
      onImagesSelected(filesArray);
    }
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
          <div key={index} className="relative w-24 h-24">
            <Image
              src={url}
              width={200}
              height={200}
              alt={`img-${index}`}
              className="rounded-lg object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadImage;
