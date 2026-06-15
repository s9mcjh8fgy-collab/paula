import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CHANNEL_LABELS, STATUS_LABELS, type Interaction, type Task } from "@/lib/types";
import { ToggleTaskButton, DeleteTaskButton } from "./tasks/task-actions";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { count: pendingCount },
    { count: inProgressCount },
    { count: doneCount },
    { count: clientCount },
    { count: taskPendingCount },
    { count: taskInProgressCount },
    { count: taskDoneCount },
  ] = await Promise.all([
    supabase.from("interactions").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("interactions").select("*", { count: "exact", head: true }).eq("status", "in_progress"),
    supabase.from("interactions").select("*", { count: "exact", head: true }).eq("status", "done"),
    supabase.from("clients").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("tasks").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("tasks").select("*", { count: "exact", head: true }).eq("status", "in_progress"),
    supabase.from("tasks").select("*", { count: "exact", head: true }).eq("status", "done"),
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
    { label: "Clientes ativos", value: clientCount ?? 0, href: "/clients", color: "bg-pcbege text-pcmarrom" },
  ];

  const taskCards = [
    { label: "Tarefas pendentes", value: taskPendingCount ?? 0, href: "/tasks?status=pending", color: "bg-amber-50 text-amber-700" },
    { label: "Tarefas em andamento", value: taskInProgressCount ?? 0, href: "/tasks?status=in_progress", color: "bg-blue-50 text-blue-700" },
    { label: "Tarefas concluídas", value: taskDoneCount ?? 0, href: "/tasks?status=done", color: "bg-green-50 text-green-700" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-lg font-semibold text-pcmarrom">Painel</h1>

      <div className="space-y-4 rounded-lg border border-pccinza/20 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-pcmarrom">Demandas</h2>
        <Link
          href="/interactions/new"
          className="rounded-lg bg-pclaranja px-3 py-2 text-sm font-semibold text-white hover:bg-pclaranjadark"
        >
          + Nova demanda
        </Link>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {cards.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className={`rounded-lg border border-pccinza/20 p-4 hover:shadow-sm ${c.color}`}
            >
              <p className="text-2xl font-semibold">{c.value}</p>
              <p className="text-sm">{c.label}</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-pcmarrom">Demandas pendentes / em andamento</h3>
          <Link href="/interactions" className="text-sm text-pclaranja hover:underline">
            Ver todas as demandas
          </Link>
        </div>

        {interactions.length === 0 ? (
          <p className="text-sm text-pccinza">Nenhuma demanda pendente. 🎉</p>
        ) : (
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
                          i.status === "in_progress"
                            ? "bg-pcmarrom text-white"
                            : "bg-pccinza text-white"
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
      </div>

      <div className="space-y-4 rounded-lg border border-pccinza/20 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-pcmarrom">Tarefas</h2>
        <Link
          href="/tasks/new"
          className="rounded-lg bg-pclaranja px-3 py-2 text-sm font-semibold text-white hover:bg-pclaranjadark"
        >
          + Nova tarefa
        </Link>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {taskCards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`rounded-lg border border-pccinza/20 p-4 hover:shadow-sm ${c.color}`}
          >
            <p className="text-2xl font-semibold">{c.value}</p>
            <p className="text-sm">{c.label}</p>
          </Link>
        ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-pcmarrom">Tarefas pendentes / em andamento</h3>
          <Link href="/tasks" className="text-sm text-pclaranja hover:underline">
            Ver todas as tarefas
          </Link>
        </div>

        {tasks.length === 0 ? (
          <p className="text-sm text-pccinza">Nenhuma tarefa pendente. 🎉</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-pccinza/20 bg-white">
            <table className="min-w-full divide-y divide-pccinza/20">
              <thead className="bg-pcbege">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-pccinza">Prazo</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-pccinza">Cliente</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-pccinza">Responsável</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-pccinza">Tarefa</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-pccinza">Descrição</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-pccinza">Status</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pccinza/10">
                {tasks.map((t) => (
                  <tr key={t.id}>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-pccinza">
                      {t.due_date ? new Date(t.due_date + "T00:00:00").toLocaleDateString("pt-BR") : "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm">
                      {t.client_id ? (
                        <Link href={`/clients/${t.client_id}`} className="text-pclaranja hover:underline">
                          {t.clients?.name ?? "—"}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-pccinza">{t.assigned_to ?? "—"}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm">
                      <Link href={`/tasks/${t.id}/edit?redirect_to=${encodeURIComponent("/")}`} className="font-medium text-pcmarrom hover:underline">
                        {t.title}
                      </Link>
                    </td>
                    <td className="max-w-md px-4 py-2 text-sm">
                      {t.description ? (
                        <p className="line-clamp-3 text-sm text-pccinza">{t.description}</p>
                      ) : (
                        <span className="text-sm text-pccinza">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm">
                      <ToggleTaskButton taskId={t.id} status={t.status} path="/" />
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm">
                      <div className="flex items-center gap-3">
                        <Link href={`/tasks/${t.id}/edit?redirect_to=${encodeURIComponent("/")}`} className="text-pclaranja hover:underline">
                          Editar
                        </Link>
                        <DeleteTaskButton taskId={t.id} path="/" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
