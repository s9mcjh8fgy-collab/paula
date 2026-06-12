"use client";

import { useState } from "react";
import type { Client, Contact } from "@/lib/types";
import { formatDocument, formatPhone } from "@/lib/format";

export function ClientForm({
  action,
  client,
  error,
}: {
  action: (formData: FormData) => void;
  client?: Client;
  error?: string;
}) {
  const [contacts, setContacts] = useState<Contact[]>(
    client?.contacts && client.contacts.length > 0
      ? client.contacts
      : [{ name: "", phone: "", email: "" }]
  );

  return (
    <form action={action} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome / Razão Social *</label>
          <input
            name="name"
            required
            defaultValue={client?.name}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">CNPJ / CPF</label>
          <input
            name="document"
            inputMode="numeric"
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
            defaultValue={client?.document ?? ""}
            onChange={(e) => {
              e.target.value = formatDocument(e.target.value);
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Pasta de documentos (link)</label>
        <input
          name="folder_url"
          type="url"
          placeholder="https://drive.google.com/..."
          defaultValue={client?.folder_url ?? ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Contatos</label>
          <button
            type="button"
            onClick={() => setContacts([...contacts, { name: "", phone: "", email: "" }])}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            + adicionar contato
          </button>
        </div>
        <div className="space-y-2">
          {contacts.map((contact, idx) => (
            <div key={idx} className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <input
                name="contact_name"
                placeholder="Nome"
                defaultValue={contact.name}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                name="contact_phone"
                inputMode="numeric"
                placeholder="(00) 00000-0000"
                defaultValue={contact.phone}
                onChange={(e) => {
                  e.target.value = formatPhone(e.target.value);
                }}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                name="contact_email"
                placeholder="E-mail"
                defaultValue={contact.email}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Observações</label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={client?.notes ?? ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          defaultValue={client?.status ?? "active"}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </select>
      </div>

      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Salvar
      </button>
    </form>
  );
}
