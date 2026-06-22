"use client";

import { useState } from "react";

export function CopyFolderName({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copiar nome da pasta"
      className="inline-flex items-center gap-1 rounded-lg border border-pccinza/40 px-2 py-1 text-xs text-pcmarrom hover:bg-pcbege"
    >
      <span className="font-mono">{name}</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
        <rect x="9" y="9" width="11" height="11" rx="1.5" />
        <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
      </svg>
      {copied && <span className="text-pclaranja">Copiado!</span>}
    </button>
  );
}
