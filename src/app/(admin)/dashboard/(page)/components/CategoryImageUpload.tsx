"use client";
import React, { useState } from "react";

export default function CategoryImageUpload({ onImageUploaded, initialUrl }: {
  onImageUploaded: (url: string) => void;
  initialUrl?: string;
}) {
  const [previewUrl, setPreviewUrl] = useState(initialUrl || "");
  const [loading, setLoading] = useState(false);

  async function uploadCategoryImage(file: File) {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/privada/category/upload", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (!res.ok) return;
    const data = await res.json();
    setPreviewUrl(data.imageUrl);
    onImageUploaded(data.imageUrl);
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) {
            setPreviewUrl(URL.createObjectURL(file));
            uploadCategoryImage(file);
          }
        }}
        disabled={loading}
      />
      {previewUrl && (
        <img src={previewUrl} alt="Preview" style={{ width: 100, marginTop: 8 }} />
      )}
      {loading && <span>Enviando imagem...</span>}
    </div>
  );
}
