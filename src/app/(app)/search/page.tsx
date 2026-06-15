import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CHANNEL_LABELS, STATUS_LABELS, type Interaction } from "@/lib/types";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const supabase = await createClient();

  let results: Interaction[] = [];

  if (q || status) {
    let query = supabase
      .from("interactions")
      .select("*, clients(name)")
      .order("occurred_at", { ascending: false })
      .limit(50);

    if (q) {
      const { data: matchingClients } = await supabase
        .from("clients")
        .select("id")
        .ilike("name", `%${q}%`);

      const orFilters = [`summary.ilike.%${q}%`, `response.ilike.%${q}%`];
      if (matchingClients && matchingClients.length > 0) {
        const ids = matchingClients.map((c) => c.id).join(",");
        orFilters.push(`client_id.in.(${ids})`);
      }
      query = query.or(orFilters.join(","));
    }
    if (status) {
      query = query.eq("status", status);
    }

    const { data } = await query;
    results = (data ?? []) as Interaction[];
  }

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-pcmarrom">Buscar demandas</h1>

      <form className="flex flex-col gap-3 sm:flex-row">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por palavra-chave no resumo ou resposta..."
          className="flex-1 rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
        >
          <option value="">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="in_progress">Em andamento</option>
          <option value="done">Concluído</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-pclaranja px-4 py-2 text-sm font-semibold text-white hover:bg-pclaranjadark"
        >
          Buscar
        </button>
      </form>

      {(q || status) && (
        <div className="overflow-hidden rounded-lg border border-pccinza/20 bg-white">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-pccinza">
              Nenhum resultado encontrado.
            </p>
          ) : (
            <ul className="divide-y divide-pccinza/10">
              {results.map((i) => (
                <li key={i.id} className="px-4 py-3">
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-pccinza">
                    <span>{new Date(i.occurred_at).toLocaleString("pt-BR")}</span>
                    <span>·</span>
                    <Link href={`/clients/${i.client_id}`} className="font-medium text-pclaranja hover:underline">
                      {i.clients?.name}
                    </Link>
                    <span>·</span>
                    <span>{CHANNEL_LABELS[i.channel]}</span>
                    <span className="ml-auto rounded-full bg-pcbege px-2 py-0.5 text-xs text-pccinza">
                      {STATUS_LABELS[i.status]}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-pcmarrom">{i.summary}</p>
                  {i.response && <p className="mt-1 text-sm text-pcmarrom">{i.response}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
