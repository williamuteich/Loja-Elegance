"use client";
import React, { useState } from "react";
import CategoryImageUpload from "./CategoryImageUpload";

export default function ModalCategoriaClient({
  config,
  params,
  initialValues
}: {
  config: any;
  params?: string;
  initialValues?: { [key: string]: any };
}) {
  const [form, setForm] = useState({
    name: initialValues?.name || "",
    description: initialValues?.description || "",
    imageUrl: initialValues?.imageUrl || ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch(config.apiEndpoint, {
        method: config.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: params }),
      });
      setLoading(false);
      if (!res.ok) {
        setError("Erro ao salvar categoria.");
        return;
      }
      setSuccess("Categoria salva com sucesso!");
    } catch (err) {
      setLoading(false);
      setError("Erro ao salvar categoria.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4 pb-0">
      <div className="grid grid-cols-4 items-center gap-4">
        <label className="text-right">Imagem</label>
        <div className="col-span-3">
          <CategoryImageUpload
            initialUrl={form.imageUrl}
            onImageUploaded={url => {
              if (url) setForm(f => ({ ...f, imageUrl: url }));
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="name" className="text-right">Nome</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Digite o nome da Categoria"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="description" className="text-right">Descrição</label>
        <input
          id="description"
          name="description"
          type="text"
          placeholder="Descrição da categoria"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className="col-span-3"
        />
      </div>
      {success && (
        <div className="text-green-700 font-bold text-center mt-2 mb-2">
          {success}
        </div>
      )}
      <button type="submit" className="bg-blue-800 w-full hover:bg-blue-700 text-white mt-4" disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </button>
      {error && <div className="text-red-700 mt-2 text-center font-bold">{error}</div>}
    </form>
  );
}
