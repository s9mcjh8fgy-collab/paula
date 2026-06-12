import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Client } from "@/lib/types";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("clients").select("*").order("name", { ascending: true });

  if (q) {
    query = query.or(`name.ilike.%${q}%,document.ilike.%${q}%`);
  }

  const { data } = await query;
  const clients = (data ?? []) as Client[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Clientes</h1>
        <Link
          href="/clients/new"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Novo cliente
        </Link>
      </div>

      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome ou CNPJ/CPF..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Buscar
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <ul className="divide-y divide-gray-100">
          {clients.map((c) => (
            <li key={c.id}>
              <Link
                href={`/clients/${c.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.name}</p>
                  {c.document && <p className="text-xs text-gray-500">{c.document}</p>}
                </div>
                {c.status === "inactive" && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    Inativo
                  </span>
                )}
              </Link>
            </li>
          ))}
          {clients.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-gray-500">
              {q ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado ainda."}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
