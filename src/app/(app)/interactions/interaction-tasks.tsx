import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createTask } from "../tasks/actions";
import { ToggleTaskButton, DeleteTaskButton } from "../tasks/task-actions";
import type { Task } from "@/lib/types";

export async function InteractionTasks({ interactionId, path }: { interactionId: string; path: string }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("interaction_id", interactionId)
    .order("status", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false });

  const tasks = (data ?? []) as Task[];

  return (
    <div className="space-y-3 rounded-lg border border-pccinza/20 bg-white p-6">
      <h2 className="text-sm font-semibold text-pcmarrom">Tarefas desta demanda</h2>

      <ul className="divide-y divide-pccinza/10">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-start justify-between gap-4 py-2">
            <div className={t.status === "done" ? "opacity-50" : ""}>
              <p className="text-sm font-medium text-pcmarrom">{t.title}</p>
              {t.description && <p className="text-sm text-pccinza">{t.description}</p>}
              {t.due_date && (
                <p className="mt-1 text-xs text-pccinza">
                  Prazo: {new Date(t.due_date + "T00:00:00").toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <ToggleTaskButton taskId={t.id} status={t.status} path={path} />
              <Link href={`/tasks/${t.id}/edit?redirect_to=${encodeURIComponent(path)}`} className="text-sm text-pclaranja hover:underline">
                Editar
              </Link>
              <DeleteTaskButton taskId={t.id} path={path} />
            </div>
          </li>
        ))}
        {tasks.length === 0 && (
          <li className="py-2 text-sm text-pccinza">Nenhuma tarefa cadastrada para esta demanda.</li>
        )}
      </ul>

      <form action={createTask} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_140px_auto]">
        <input type="hidden" name="interaction_id" value={interactionId} />
        <input type="hidden" name="redirect_to" value={path} />
        <input
          name="title"
          required
          placeholder="Nova tarefa"
          className="block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
        />
        <input
          name="due_date"
          type="date"
          className="block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
        />
        <button
          type="submit"
          className="rounded-lg bg-pclaranja px-4 py-2 text-sm font-semibold text-white hover:bg-pclaranjadark"
        >
          + Adicionar
        </button>
      </form>
    </div>
  );
}
