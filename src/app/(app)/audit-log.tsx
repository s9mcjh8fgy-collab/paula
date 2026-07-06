import { createClient } from "@/lib/supabase/server";

const FIELD_LABELS: Record<string, string> = {
  title: "Título",
  summary: "Resumo",
  response: "Resposta / resolução",
  status: "Status",
  channel: "Canal",
  occurred_at: "Data/Hora",
  requested_by: "Solicitado por",
  tags: "Tags",
  links: "Links",
  assigned_to: "Responsável",
  due_date: "Prazo",
  description: "Descrição",
  client_id: "Cliente",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  in_progress: "Em andamento",
  done: "Concluído / Concluída",
};

const CHANNEL_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  email: "E-mail",
  call: "Ligação",
  meeting: "Reunião",
  in_person: "Presencial",
};

function formatValue(field: string, value: string | null): string {
  if (value === null || value === "") return "—";
  if (field === "status") return STATUS_LABELS[value] ?? value;
  if (field === "channel") return CHANNEL_LABELS[value] ?? value;
  if (field === "occurred_at") {
    const d = new Date(value);
    return d.toLocaleString("pt-BR");
  }
  if (field === "due_date") {
    return new Date(value + "T00:00:00").toLocaleDateString("pt-BR");
  }
  if (value.length > 120) return value.slice(0, 120) + "…";
  return value;
}

export async function AuditLog({
  tableName,
  recordId,
}: {
  tableName: string;
  recordId: string;
}) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("audit_log")
    .select("*")
    .eq("table_name", tableName)
    .eq("record_id", recordId)
    .order("changed_at", { ascending: false })
    .limit(50);

  const entries = data ?? [];

  if (entries.length === 0) {
    return (
      <div className="space-y-2 rounded-lg border border-pccinza/20 bg-white p-6">
        <h2 className="text-sm font-semibold text-pcmarrom">Histórico de alterações</h2>
        <p className="text-sm text-pccinza">Nenhuma alteração registrada ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-pccinza/20 bg-white p-6">
      <h2 className="text-sm font-semibold text-pcmarrom">Histórico de alterações</h2>
      <ul className="divide-y divide-pccinza/10">
        {entries.map((e: any) => (
          <li key={e.id} className="py-2 text-sm">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-medium text-pcmarrom">
                {FIELD_LABELS[e.field_name] ?? e.field_name}
              </span>
              <span className="whitespace-nowrap text-xs text-pccinza">
                {new Date(e.changed_at).toLocaleString("pt-BR")}
              </span>
            </div>
            <div className="mt-0.5 flex items-start gap-2 text-xs text-pccinza">
              <span className="line-through opacity-60">{formatValue(e.field_name, e.old_value)}</span>
              <span className="text-pccinza opacity-40">→</span>
              <span>{formatValue(e.field_name, e.new_value)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
