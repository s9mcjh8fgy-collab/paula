import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ToggleTaskButton, DeleteTaskButton } from "./task-actions";
import type { Task, TaskStatus } from "@/lib/types";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; status?: string }>;
}) {
  const { error, status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("tasks")
    .select("*, clients(name)")
    .order("status", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false });

  if (status) {
    query = query.eq("status", status);
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
        <h1 className="text-lg font-semibold text-gray-900">Tarefas</h1>
        <Link
          href="/tasks/new"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Nova tarefa
        </Link>
      </div>

      <div className="flex gap-2">
        {statusFilters.map((f) => (
          <Link
            key={f.label}
            href={f.value ? `/tasks?status=${f.value}` : "/tasks"}
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

      {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <ul className="divide-y divide-gray-100">
          {tasks.map((t) => (
            <li key={t.id} className="flex items-start justify-between gap-4 px-4 py-3">
              <div className={t.status === "done" ? "opacity-50" : ""}>
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
                <ToggleTaskButton taskId={t.id} status={t.status} path="/tasks" />
                <Link href={`/tasks/${t.id}/edit`} className="text-sm text-blue-600 hover:underline">
                  Editar
                </Link>
                <DeleteTaskButton taskId={t.id} path="/tasks" />
              </div>
            </li>
          ))}
          {tasks.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-gray-500">Nenhuma tarefa cadastrada.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
