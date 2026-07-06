import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AuditLog } from "../../../audit-log";
import type { Interaction } from "@/lib/types";

export default async function InteractionAuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: interaction } = await supabase
    .from("interactions")
    .select("number, clients(name)")
    .eq("id", id)
    .single();

  if (!interaction) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-pcmarrom">
            Histórico — Demanda #{String((interaction as any).number).padStart(4, "0")}
          </h1>
          <p className="text-sm text-pccinza">{(interaction as any).clients?.name}</p>
        </div>
        <Link
          href={`/interactions/${id}/edit`}
          className="text-sm text-pclaranja hover:underline"
        >
          ← Voltar para a demanda
        </Link>
      </div>
      <AuditLog tableName="interactions" recordId={id} />
    </div>
  );
}
