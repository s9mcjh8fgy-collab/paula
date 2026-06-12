import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateTask } from "../../actions";
import { TaskForm } from "../../task-form";
import type { Client, Task } from "@/lib/types";

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
    supabase.from("tasks").select("*").eq("id", id).single(),
    supabase.from("clients").select("id, name").eq("status", "active").order("name", { ascending: true }),
  ]);

  if (!task) notFound();

  const clients = (clientsData ?? []) as Pick<Client, "id" | "name">[];
  const updateAction = updateTask.bind(null, id);

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-lg font-semibold text-pcmarrom">Editar tarefa</h1>
      <TaskForm
        action={updateAction}
        task={task as Task}
        clients={clients}
        redirectTo={redirect_to ?? "/tasks"}
        error={error}
      />
    </div>
  );
}
