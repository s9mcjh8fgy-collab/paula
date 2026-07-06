import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AuditLog } from "../../../audit-log";

export default async function TaskAuditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ redirect_to?: string }>;
}) {
  const { id } = await params;
  const { redirect_to } = await searchParams;
  const supabase = await createClient();

  const { data: task } = await supabase
    .from("tasks")
    .select("title")
    .eq("id", id)
    .single();

  if (!task) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-pcmarrom">Histórico — {task.title}</h1>
        </div>
        <Link
          href={`/tasks/${id}/edit${redirect_to ? `?redirect_to=${encodeURIComponent(redirect_to)}` : ""}`}
          className="text-sm text-pclaranja hover:underline"
        >
          ← Voltar para a tarefa
        </Link>
      </div>
      <AuditLog tableName="tasks" recordId={id} />
    </div>
  );
}
