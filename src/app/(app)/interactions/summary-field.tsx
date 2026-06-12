"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

async function uploadFile(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `interactions/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("attachments").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("attachments").getPublicUrl(path);
  return data.publicUrl;
}

export function SummaryField({
  defaultValue = "",
  initialImages = [],
}: {
  defaultValue?: string;
  initialImages?: string[];
}) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: File[]) {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      const uploaded = await Promise.all(imageFiles.map(uploadFile));
      setImages((prev) => [...prev, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao enviar imagem");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-pcmarrom">Resumo da demanda *</label>
      <textarea
        name="summary"
        required
        rows={3}
        defaultValue={defaultValue}
        placeholder="Descreva a demanda. Você pode colar (Ctrl+V) ou arrastar uma imagem aqui."
        onPaste={(e) => {
          const files = Array.from(e.clipboardData.files);
          if (files.length > 0) handleFiles(files);
        }}
        onDrop={(e) => {
          const files = Array.from(e.dataTransfer.files);
          if (files.length > 0) {
            e.preventDefault();
            handleFiles(files);
          }
        }}
        className="mt-1 block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
      />
      <p className="mt-1 text-xs text-pccinza">
        Dica: cole (Ctrl+V) ou arraste uma imagem direto aqui para anexar.
      </p>

      <div className="mt-2">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files) handleFiles(Array.from(e.target.files));
            e.target.value = "";
          }}
          className="block w-full text-sm text-pcmarrom"
        />
        {uploading && <p className="mt-1 text-xs text-pccinza">Enviando imagem...</p>}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

        {images.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {images.map((url) => (
              <div key={url} className="relative">
                <a href={url} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="h-24 w-24 rounded-lg border border-pccinza/20 object-cover"
                  />
                </a>
                <input type="hidden" name="images" value={url} />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((i) => i !== url))}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                  aria-label="Remover imagem"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
