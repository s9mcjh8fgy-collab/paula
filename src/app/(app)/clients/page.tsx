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
        <h1 className="text-lg font-semibold text-pcmarrom">Clientes</h1>
        <Link
          href="/clients/new"
          className="rounded-lg bg-pclaranja px-3 py-2 text-sm font-semibold text-white hover:bg-pclaranjadark"
        >
          + Novo cliente
        </Link>
      </div>

      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome ou CNPJ/CPF..."
          className="flex-1 rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
        />
        <button
          type="submit"
          className="rounded-lg bg-pclaranja px-4 py-2 text-sm font-semibold text-white hover:bg-pclaranjadark"
        >
          Buscar
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border border-pccinza/20 bg-white">
        <ul className="divide-y divide-pccinza/10">
          {clients.map((c) => (
            <li key={c.id}>
              <Link
                href={`/clients/${c.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-pcbege"
              >
                <div>
                  <p className="text-sm font-medium text-pcmarrom">{c.name}</p>
                  {c.document && <p className="text-xs text-pccinza">{c.document}</p>}
                </div>
                {c.status === "inactive" && (
                  <span className="rounded-full bg-pcbege px-2 py-0.5 text-xs font-medium text-pccinza">
                    Inativo
                  </span>
                )}
              </Link>
            </li>
          ))}
          {clients.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-pccinza">
              {q ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado ainda."}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
