import { createClient } from "@/lib/supabase/server";
import { createTask } from "../actions";
import { TaskForm } from "../task-form";
import type { Client } from "@/lib/types";

export default async function NewTaskPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; client_id?: string }>;
}) {
  const { error, client_id } = await searchParams;
  const supabase = await createClient();

  const { data: clientsData } = await supabase
    .from("clients")
    .select("id, name")
    .eq("status", "active")
    .order("name", { ascending: true });

  const clients = (clientsData ?? []) as Pick<Client, "id" | "name">[];

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-lg font-semibold text-pcmarrom">Nova tarefa</h1>
      <TaskForm action={createTask} clients={clients} defaultClientId={client_id} redirectTo="/tasks" error={error} />
    </div>
  );
}
