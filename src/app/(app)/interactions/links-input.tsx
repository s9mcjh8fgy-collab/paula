"use client";

import { useState } from "react";

export function LinksInput({ initialLinks = [] }: { initialLinks?: string[] }) {
  const [links, setLinks] = useState<string[]>(initialLinks.length > 0 ? initialLinks : [""]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-pcmarrom">
          Links (e-mail do Outlook, pasta, documento, etc.)
        </label>
        <button
          type="button"
          onClick={() => setLinks((prev) => [...prev, ""])}
          className="text-xs font-medium text-pclaranja hover:underline"
        >
          + adicionar link
        </button>
      </div>
      <div className="space-y-2">
        {links.map((link, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              name="links"
              type="url"
              placeholder="https://..."
              defaultValue={link}
              className="flex-1 rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
            />
            {links.length > 1 && (
              <button
                type="button"
                onClick={() => setLinks((prev) => prev.filter((_, i) => i !== idx))}
                className="rounded-lg border border-pccinza/40 px-2 text-sm text-pccinza hover:bg-pcbege"
                aria-label="Remover link"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
