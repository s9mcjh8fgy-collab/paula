import type { Client, Task } from "@/lib/types";

export function TaskForm({
  action,
  task,
  clients,
  defaultClientId,
  redirectTo,
  error,
}: {
  action: (formData: FormData) => void;
  task?: Task;
  clients: Pick<Client, "id" | "name">[];
  defaultClientId?: string;
  redirectTo: string;
  error?: string;
}) {
  return (
    <form action={action} className="space-y-4 rounded-lg border border-pccinza/20 bg-white p-6">
      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <input type="hidden" name="redirect_to" value={redirectTo} />

      <div>
        <label className="block text-sm font-medium text-pcmarrom">Título *</label>
        <input
          name="title"
          required
          defaultValue={task?.title ?? ""}
          className="mt-1 block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-pcmarrom">Descrição</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={task?.description ?? ""}
          className="mt-1 block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-pcmarrom">Prazo</label>
          <input
            name="due_date"
            type="date"
            defaultValue={task?.due_date ?? ""}
            className="mt-1 block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-pcmarrom">Cliente (opcional)</label>
          <select
            name="client_id"
            defaultValue={task?.client_id ?? defaultClientId ?? ""}
            className="mt-1 block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
          >
            <option value="">—</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-pcmarrom">Status</label>
        <select
          name="status"
          defaultValue={task?.status ?? "pending"}
          className="mt-1 block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
        >
          <option value="pending">Pendente</option>
          <option value="in_progress">Em andamento</option>
          <option value="done">Concluída</option>
        </select>
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
