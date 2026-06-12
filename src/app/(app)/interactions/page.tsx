import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CHANNEL_LABELS, STATUS_LABELS, type Interaction, type InteractionStatus } from "@/lib/types";

export default async function InteractionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("interactions")
    .select("*, clients(name)")
    .order("occurred_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
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
        <h1 className="text-lg font-semibold text-gray-900">Demandas</h1>
        <Link
          href="/interactions/new"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Novo atendimento
        </Link>
      </div>

      <div className="flex gap-2">
        {statusFilters.map((f) => (
          <Link
            key={f.label}
            href={f.value ? `/interactions?status=${f.value}` : "/interactions"}
            className={`rounded-full px-3 py-1 text-sm ${
              status === f.value || (!status && !f.value)
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">#</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Data</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Cliente</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Canal</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Resumo</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {interactions.map((i) => (
              <tr key={i.id}>
                <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">
                  #{String(i.number).padStart(4, "0")}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">
                  {new Date(i.occurred_at).toLocaleDateString("pt-BR")}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-sm">
                  <Link href={`/clients/${i.client_id}`} className="text-blue-600 hover:underline">
                    {i.clients?.name ?? "—"}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">
                  {CHANNEL_LABELS[i.channel]}
                </td>
                <td className="max-w-md px-4 py-2 text-sm text-gray-700">{i.summary}</td>
                <td className="whitespace-nowrap px-4 py-2 text-sm">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      i.status === "done"
                        ? "bg-green-100 text-green-800"
                        : i.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {STATUS_LABELS[i.status]}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-sm">
                  <Link href={`/interactions/${i.id}/edit`} className="text-blue-600 hover:underline">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {interactions.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">
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
