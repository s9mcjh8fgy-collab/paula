import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateTask } from "../../actions";
import { TaskForm } from "../../task-form";
import type { Client, Task } from "@/lib/types";
import Link from "next/link";

export default async function EditTaskPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; redirect_to?: string }>;
}) {
  const { id } = await params;
  const { error, redirect_to } = await searchParams;
  const supabase = await createClient();

  const [{ data: task }, { data: clientsData }] = await Promise.all([
    supabase.from("tasks").select("*, interactions(id, number, title, summary)").eq("id", id).single(),
    supabase.from("clients").select("id, name").eq("status", "active").order("name", { ascending: true }),
  ]);

  if (!task) notFound();

  const clients = (clientsData ?? []) as Pick<Client, "id" | "name">[];
  const updateAction = updateTask.bind(null, id);
  const interaction = (task as any).interactions;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-lg font-semibold text-pcmarrom">Editar tarefa</h1>
      {interaction && (
        <div className="rounded-lg border border-pclaranja/30 bg-pcbege px-4 py-3">
          <p className="text-xs text-pccinza">Originada da demanda:</p>
          <Link
            href={`/interactions/${interaction.id}/edit`}
            className="text-sm font-medium text-pclaranja hover:underline"
          >
            #{String(interaction.number).padStart(4, "0")}{interaction.title ? ` — ${interaction.title}` : ""}
          </Link>
          {interaction.summary && (
            <p className="mt-0.5 line-clamp-2 text-xs text-pccinza">{interaction.summary}</p>
          )}
        </div>
      )}
      <TaskForm
        action={updateAction}
        task={task as Task}
        clients={clients}
        redirectTo={redirect_to ?? "/tasks"}
        error={error}
      />
      <div className="flex justify-end">
        <Link
          href={`/tasks/${id}/audit${redirect_to ? `?redirect_to=${encodeURIComponent(redirect_to)}` : ""}`}
          className="text-sm text-pccinza hover:text-pcmarrom hover:underline"
        >
          Ver histórico de alterações
        </Link>
      </div>
    </div>
  );
}
