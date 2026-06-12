import type { Client, Interaction } from "@/lib/types";
import { LinksInput } from "./links-input";
import { SummaryField } from "./summary-field";
import { NewTasksInput } from "./new-tasks-input";

function toLocalDateTimeInput(iso: string): string {
  const date = new Date(iso);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export function InteractionForm({
  action,
  clients,
  interaction,
  defaultClientId,
  error,
}: {
  action: (formData: FormData) => void;
  clients?: Pick<Client, "id" | "name">[];
  interaction?: Interaction;
  defaultClientId?: string;
  error?: string;
}) {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const defaultDateTime = interaction
    ? toLocalDateTimeInput(interaction.occurred_at)
    : now.toISOString().slice(0, 16);

  return (
    <form action={action} className="space-y-4 rounded-lg border border-pccinza/20 bg-white p-6">
      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      {clients ? (
        <div>
          <label className="block text-sm font-medium text-pcmarrom">Cliente *</label>
          <select
            name="client_id"
            required
            defaultValue={defaultClientId ?? ""}
            className="mt-1 block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
          >
            <option value="" disabled>
              Selecione...
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <input type="hidden" name="client_id" value={interaction!.client_id} />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-pcmarrom">Data/Hora</label>
          <input
            name="occurred_at"
            type="datetime-local"
            defaultValue={defaultDateTime}
            className="mt-1 block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-pcmarrom">Canal</label>
          <select
            name="channel"
            defaultValue={interaction?.channel ?? "whatsapp"}
            className="mt-1 block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="email">E-mail</option>
            <option value="call">Ligação</option>
            <option value="meeting">Reunião</option>
            <option value="in_person">Presencial</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-pcmarrom">Solicitado por</label>
        <input
          name="requested_by"
          placeholder="Nome da pessoa do cliente"
          defaultValue={interaction?.requested_by ?? ""}
          className="mt-1 block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
        />
      </div>

      <SummaryField defaultValue={interaction?.summary ?? ""} initialImages={interaction?.images} />

      <div>
        <label className="block text-sm font-medium text-pcmarrom">Resposta / resolução dada</label>
        <textarea
          name="response"
          rows={3}
          defaultValue={interaction?.response ?? ""}
          className="mt-1 block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
        />
      </div>

      <LinksInput initialLinks={interaction?.links} />

      {!interaction && <NewTasksInput />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-pcmarrom">Status</label>
          <select
            name="status"
            defaultValue={interaction?.status ?? "pending"}
            className="mt-1 block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
          >
            <option value="pending">Pendente</option>
            <option value="in_progress">Em andamento</option>
            <option value="done">Concluído</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-pcmarrom">Tags (separadas por vírgula)</label>
          <input
            name="tags"
            placeholder="trabalhista, contrato"
            defaultValue={interaction?.tags?.join(", ") ?? ""}
            className="mt-1 block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
          />
        </div>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-pclaranja px-4 py-2 text-sm font-semibold text-white hover:bg-pclaranjadark"
      >
        Salvar
      </button>
    </form>
  );
}
