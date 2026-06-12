"use client";

import { useState } from "react";

export function LinksInput({ initialLinks = [] }: { initialLinks?: string[] }) {
  const [links, setLinks] = useState<string[]>(initialLinks.length > 0 ? initialLinks : [""]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Links (e-mail do Outlook, pasta, documento, etc.)
        </label>
        <button
          type="button"
          onClick={() => setLinks((prev) => [...prev, ""])}
          className="text-xs font-medium text-blue-600 hover:underline"
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
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {links.length > 1 && (
              <button
                type="button"
                onClick={() => setLinks((prev) => prev.filter((_, i) => i !== idx))}
                className="rounded-md border border-gray-300 px-2 text-sm text-gray-500 hover:bg-gray-50"
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
