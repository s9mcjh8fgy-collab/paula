import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ToggleTaskButton, DeleteTaskButton } from "./task-actions";
import { ASSIGNEES, type Task, type TaskStatus } from "@/lib/types";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; status?: string; q?: string; assigned_to?: string }>;
}) {
  const { error, status, q, assigned_to } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("tasks")
    .select("*, clients(name)")
    .order("status", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false });

  if (status) {
    query = query.eq("status", status);
  }

  if (assigned_to) {
    query = query.eq("assigned_to", assigned_to);
  }

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const { data: tasksData } = await query;

  const tasks = (tasksData ?? []) as Task[];

  const statusFilters: { value?: TaskStatus; label: string }[] = [
    { value: undefined, label: "Todas" },
    { value: "pending", label: "Pendentes" },
    { value: "in_progress", label: "Em andamento" },
    { value: "done", label: "Concluídas" },
  ];

  function buildHref(overrides: { status?: string; assigned_to?: string }) {
    const params = new URLSearchParams();
    const nextStatus = "status" in overrides ? overrides.status : status;
    const nextAssignedTo = "assigned_to" in overrides ? overrides.assigned_to : assigned_to;
    if (nextStatus) params.set("status", nextStatus);
    if (nextAssignedTo) params.set("assigned_to", nextAssignedTo);
    if (q) params.set("q", q);
    const qs = params.toString();
    return qs ? `/tasks?${qs}` : "/tasks";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-pcmarrom">Tarefas</h1>
        <Link
          href="/tasks/new"
          className="rounded-lg bg-pclaranja px-3 py-2 text-sm font-semibold text-white hover:bg-pclaranjadark"
        >
          + Nova tarefa
        </Link>
      </div>

      <div className="flex gap-2">
        {statusFilters.map((f) => (
          <Link
            key={f.label}
            href={buildHref({ status: f.value ?? "" })}
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

      <div className="flex gap-2">
        <Link
          href={buildHref({ assigned_to: "" })}
          className={`rounded-full px-3 py-1 text-sm ${
            !assigned_to ? "bg-pclaranjadark text-white" : "bg-pcbege text-pcmarrom hover:bg-pcbege"
          }`}
        >
          Todos os responsáveis
        </Link>
        {ASSIGNEES.map((a) => (
          <Link
            key={a}
            href={buildHref({ assigned_to: a })}
            className={`rounded-full px-3 py-1 text-sm ${
              assigned_to === a ? "bg-pclaranjadark text-white" : "bg-pcbege text-pcmarrom hover:bg-pcbege"
            }`}
          >
            {a}
          </Link>
        ))}
      </div>

      <form className="flex gap-2">
        {status && <input type="hidden" name="status" value={status} />}
        {assigned_to && <input type="hidden" name="assigned_to" value={assigned_to} />}
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por título ou descrição..."
          className="flex-1 rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
        />
        <button
          type="submit"
          className="rounded-lg bg-pclaranja px-4 py-2 text-sm font-semibold text-white hover:bg-pclaranjadark"
        >
          Buscar
        </button>
      </form>

      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

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
              <tr key={t.id} className={t.status === "done" ? "opacity-50" : ""}>
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
                  <Link href={`/tasks/${t.id}/edit`} className="font-medium text-pcmarrom hover:underline">
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
                  <div className="flex items-center gap-3">
                    <ToggleTaskButton taskId={t.id} status={t.status} path="/tasks" />
                    <Link href={`/tasks/${t.id}/edit`} className="text-pclaranja hover:underline">
                      Editar
                    </Link>
                    <DeleteTaskButton taskId={t.id} path="/tasks" />
                  </div>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-pccinza">
                  Nenhuma tarefa cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
