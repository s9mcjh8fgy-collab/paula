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

  const { data: last } = await supabase
    .from("interactions")
    .select("number")
    .order("number", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextNumber = (last?.number ?? 0) + 1;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-lg font-semibold text-pcmarrom">Nova demanda</h1>
        <span className="text-sm text-pccinza">
          Demanda nº <span className="font-mono font-semibold text-pcmarrom">#{String(nextNumber).padStart(4, "0")}</span>
        </span>
      </div>
      <InteractionForm
        action={createInteraction}
        clients={clients}
        defaultClientId={client_id}
        error={error}
      />
    </div>
  );
}
