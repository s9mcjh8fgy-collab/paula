import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateInteraction } from "../../actions";
import { InteractionForm } from "../../interaction-form";
import { InteractionTasks } from "../../interaction-tasks";
import { CopyFolderName } from "../../copy-folder-name";
import type { Interaction } from "@/lib/types";

export default async function EditInteractionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data: interaction } = await supabase
    .from("interactions")
    .select("*, clients(name)")
    .eq("id", id)
    .single();

  if (!interaction) notFound();

  const updateAction = updateInteraction.bind(null, id);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-pcmarrom">
          Demanda #{String((interaction as Interaction).number).padStart(4, "0")}
        </h1>
        <p className="text-sm text-pccinza">{(interaction as Interaction).clients?.name}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-pccinza">Pasta sugerida no SharePoint:</span>
          <CopyFolderName
            name={`#${String((interaction as Interaction).number).padStart(4, "0")}${
              (interaction as Interaction).title ? ` - ${(interaction as Interaction).title}` : ""
            }`}
          />
        </div>
      </div>
      <InteractionForm action={updateAction} interaction={interaction as Interaction} error={error} />
      <InteractionTasks interactionId={id} clientId={(interaction as Interaction).client_id} path={`/interactions/${id}/edit`} />
    </div>
  );
}
