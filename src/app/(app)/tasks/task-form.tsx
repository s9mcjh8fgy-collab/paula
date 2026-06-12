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
    <form action={action} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <input type="hidden" name="redirect_to" value={redirectTo} />

      <div>
        <label className="block text-sm font-medium text-gray-700">Título *</label>
        <input
          name="title"
          required
          defaultValue={task?.title ?? ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={task?.description ?? ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Prazo</label>
          <input
            name="due_date"
            type="date"
            defaultValue={task?.due_date ?? ""}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cliente (opcional)</label>
          <select
            name="client_id"
            defaultValue={task?.client_id ?? defaultClientId ?? ""}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          defaultValue={task?.status ?? "pending"}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="pending">Pendente</option>
          <option value="in_progress">Em andamento</option>
          <option value="done">Concluída</option>
        </select>
      </div>

      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Salvar
      </button>
    </form>
  );
}
