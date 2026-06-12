import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CHANNEL_LABELS, STATUS_LABELS, type Interaction, type InteractionStatus } from "@/lib/types";
import { DeleteInteractionButton } from "./interaction-actions";

export default async function InteractionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("interactions")
    .select("*, clients(name)")
    .order("occurred_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  if (q) {
    query = query.or(`summary.ilike.%${q}%,response.ilike.%${q}%,requested_by.ilike.%${q}%`);
  }

  const { data } = await query;
  const interactions = (data ?? []) as Interaction[];

  const statusFilters: { value?: InteractionStatus; label: string }[] = [
    { value: undefined, label: "Todas" },
    { value: "pending", label: "Pendentes" },
    { value: "in_progress", label: "Em andamento" },
    { value: "done", label: "Concluídas" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-pcmarrom">Demandas</h1>
        <Link
          href="/interactions/new"
          className="rounded-lg bg-pclaranja px-3 py-2 text-sm font-semibold text-white hover:bg-pclaranjadark"
        >
          + Novo atendimento
        </Link>
      </div>

      <div className="flex gap-2">
        {statusFilters.map((f) => (
          <Link
            key={f.label}
            href={
              f.value
                ? `/interactions?status=${f.value}${q ? `&q=${encodeURIComponent(q)}` : ""}`
                : q
                  ? `/interactions?q=${encodeURIComponent(q)}`
                  : "/interactions"
            }
            className={`rounded-full px-3 py-1 text-sm ${
              status === f.value || (!status && !f.value)
                ? "bg-pclaranja text-white"
                : "bg-pcbege text-pcmarrom hover:bg-pcbege"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <form className="flex gap-2">
        {status && <input type="hidden" name="status" value={status} />}
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por palavra-chave no resumo, resposta ou solicitante..."
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
        <table className="min-w-full divide-y divide-pccinza/20">
          <thead className="bg-pcbege">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-pccinza">#</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-pccinza">Data</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-pccinza">Cliente</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-pccinza">Canal</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-pccinza">Resumo</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-pccinza">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pccinza/10">
            {interactions.map((i) => (
              <tr key={i.id}>
                <td className="whitespace-nowrap px-4 py-2 text-sm text-pccinza">
                  #{String(i.number).padStart(4, "0")}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-sm text-pccinza">
                  {new Date(i.occurred_at).toLocaleDateString("pt-BR")}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-sm">
                  <Link href={`/clients/${i.client_id}`} className="text-pclaranja hover:underline">
                    {i.clients?.name ?? "—"}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-sm text-pccinza">
                  {CHANNEL_LABELS[i.channel]}
                </td>
                <td className="max-w-md px-4 py-2 text-sm">
                  <Link href={`/interactions/${i.id}/edit`} className="block hover:underline">
                    {i.title && <p className="text-sm font-medium text-pcmarrom">{i.title}</p>}
                    <p className="line-clamp-3 text-sm text-pccinza">{i.summary}</p>
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-sm">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      i.status === "done"
                        ? "bg-pclaranja text-white"
                        : i.status === "in_progress"
                          ? "bg-pcmarrom text-white"
                          : "bg-pccinza text-white"
                    }`}
                  >
                    {STATUS_LABELS[i.status]}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-sm">
                  <div className="flex items-center gap-3">
                    <Link href={`/interactions/${i.id}/edit`} className="text-pclaranja hover:underline">
                      Editar
                    </Link>
                    <DeleteInteractionButton interactionId={i.id} />
                  </div>
                </td>
              </tr>
            ))}
            {interactions.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-pccinza">
                  Nenhuma demanda encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
