import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientForm } from "../../client-form";
import { updateClientRecord } from "../../actions";
import type { Client } from "@/lib/types";

export default async function EditClientPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (!client) notFound();

  const updateAction = updateClientRecord.bind(null, id);

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-lg font-semibold text-pcmarrom">Editar cliente</h1>
      <div className="rounded-lg border border-pccinza/20 bg-white p-6">
        <ClientForm action={updateAction} client={client as Client} error={error} />
      </div>
    </div>
  );
}
