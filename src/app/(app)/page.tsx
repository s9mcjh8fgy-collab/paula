import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CHANNEL_LABELS, STATUS_LABELS, type Interaction, type Task } from "@/lib/types";
import { ToggleTaskButton, DeleteTaskButton } from "./tasks/task-actions";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ count: pendingCount }, { count: inProgressCount }, { count: doneCount }, { count: clientCount }] =
    await Promise.all([
      supabase.from("interactions").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("interactions").select("*", { count: "exact", head: true }).eq("status", "in_progress"),
      supabase.from("interactions").select("*", { count: "exact", head: true }).eq("status", "done"),
      supabase.from("clients").select("*", { count: "exact", head: true }).eq("status", "active"),
    ]);

  const { data: pending } = await supabase
    .from("interactions")
    .select("*, clients(name)")
    .neq("status", "done")
    .order("occurred_at", { ascending: false })
    .limit(20);

  const interactions = (pending ?? []) as Interaction[];

  const { data: pendingTasks } = await supabase
    .from("tasks")
    .select("*, clients(name)")
    .neq("status", "done")
    .order("due_date", { ascending: true, nullsFirst: false })
    .limit(20);

  const tasks = (pendingTasks ?? []) as Task[];

  const cards = [
    { label: "Pendentes", value: pendingCount ?? 0, href: "/interactions?status=pending", color: "bg-amber-50 text-amber-700" },
    { label: "Em andamento", value: inProgressCount ?? 0, href: "/interactions?status=in_progress", color: "bg-blue-50 text-blue-700" },
    { label: "Concluídas", value: doneCount ?? 0, href: "/interactions?status=done", color: "bg-green-50 text-green-700" },
    { label: "Clientes ativos", value: clientCount ?? 0, href: "/clients", color: "bg-gray-50 text-gray-700" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Painel</h1>
        <Link
          href="/interactions/new"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Novo atendimento
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`rounded-lg border border-gray-200 p-4 hover:shadow-sm ${c.color}`}
          >
            <p className="text-2xl font-semibold">{c.value}</p>
            <p className="text-sm">{c.label}</p>
          </Link>
        ))}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Atendimentos pendentes / em andamento</h2>
          <Link href="/interactions" className="text-sm text-blue-600 hover:underline">
            Ver todas as demandas
          </Link>
        </div>

        {interactions.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum atendimento pendente. 🎉</p>
        ) : (
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
                    <td className="px-4 py-2 text-sm text-gray-700">{i.summary}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          i.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {STATUS_LABELS[i.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Tarefas pendentes / em andamento</h2>
          <Link href="/tasks" className="text-sm text-blue-600 hover:underline">
            Ver todas as tarefas
          </Link>
        </div>

        {tasks.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma tarefa pendente. 🎉</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-100">
              {tasks.map((t) => (
                <li key={t.id} className="flex items-start justify-between gap-4 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.title}</p>
                    {t.description && <p className="text-sm text-gray-600">{t.description}</p>}
                    <p className="mt-1 text-xs text-gray-500">
                      {t.clients?.name && <>{t.clients.name} · </>}
                      {t.due_date
                        ? `Prazo: ${new Date(t.due_date + "T00:00:00").toLocaleDateString("pt-BR")}`
                        : "Sem prazo"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <ToggleTaskButton taskId={t.id} status={t.status} path="/" />
                    <Link href={`/tasks/${t.id}/edit?redirect_to=${encodeURIComponent("/")}`} className="text-sm text-blue-600 hover:underline">
                      Editar
                    </Link>
                    <DeleteTaskButton taskId={t.id} path="/" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
