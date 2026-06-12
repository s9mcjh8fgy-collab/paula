import { createClient } from "@/lib/supabase/server";
import { createInteraction } from "../actions";
import { InteractionForm } from "../interaction-form";
import type { Client } from "@/lib/types";

export default async function NewInteractionPage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string; error?: string }>;
}) {
  const { client_id, error } = await searchParams;
  const supabase = await createClient();

  const { data } = await supabase
    .from("clients")
    .select("id, name")
    .eq("status", "active")
    .order("name", { ascending: true });

  const clients = (data ?? []) as Pick<Client, "id" | "name">[];

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-lg font-semibold text-pcmarrom">Novo atendimento</h1>
      <InteractionForm
        action={createInteraction}
        clients={clients}
        defaultClientId={client_id}
        error={error}
      />
    </div>
  );
}
