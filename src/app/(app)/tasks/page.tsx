import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ToggleTaskButton, DeleteTaskButton } from "./task-actions";
import type { Task, TaskStatus } from "@/lib/types";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; status?: string; q?: string }>;
}) {
  const { error, status, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("tasks")
    .select("*, clients(name)")
    .order("status", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false });

  if (status) {
    query = query.eq("status", status);
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
            href={
              f.value
                ? `/tasks?status=${f.value}${q ? `&q=${encodeURIComponent(q)}` : ""}`
                : q
                  ? `/tasks?q=${encodeURIComponent(q)}`
                  : "/tasks"
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
        <ul className="divide-y divide-pccinza/10">
          {tasks.map((t) => (
            <li key={t.id} className="flex items-start justify-between gap-4 px-4 py-3">
              <div className={t.status === "done" ? "opacity-50" : ""}>
                <p className="text-sm font-medium text-pcmarrom">{t.title}</p>
                {t.description && <p className="line-clamp-3 text-sm text-pccinza">{t.description}</p>}
                <p className="mt-1 text-xs text-pccinza">
                  {t.clients?.name && <>{t.clients.name} · </>}
                  {t.due_date
                    ? `Prazo: ${new Date(t.due_date + "T00:00:00").toLocaleDateString("pt-BR")}`
                    : "Sem prazo"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <ToggleTaskButton taskId={t.id} status={t.status} path="/tasks" />
                <Link href={`/tasks/${t.id}/edit`} className="text-sm text-pclaranja hover:underline">
                  Editar
                </Link>
                <DeleteTaskButton taskId={t.id} path="/tasks" />
              </div>
            </li>
          ))}
          {tasks.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-pccinza">Nenhuma tarefa cadastrada.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
