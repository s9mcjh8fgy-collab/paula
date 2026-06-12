import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CHANNEL_LABELS, STATUS_LABELS, type Client, type Interaction, type Task } from "@/lib/types";
import { ToggleTaskButton, DeleteTaskButton } from "../../tasks/task-actions";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (!client) notFound();

  const [{ data: interactionsData }, { data: tasksData }] = await Promise.all([
    supabase.from("interactions").select("*").eq("client_id", id).order("occurred_at", { ascending: false }),
    supabase
      .from("tasks")
      .select("*")
      .eq("client_id", id)
      .order("status", { ascending: true })
      .order("due_date", { ascending: true, nullsFirst: false }),
  ]);

  const interactions = (interactionsData ?? []) as Interaction[];
  const tasks = (tasksData ?? []) as Task[];
  const c = client as Client;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{c.name}</h1>
          {c.document && <p className="text-sm text-gray-500">{c.document}</p>}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/clients/${c.id}/edit`}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Editar
          </Link>
          <Link
            href={`/interactions/new?client_id=${c.id}`}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + Novo atendimento
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">Contatos</h2>
          {c.contacts.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum contato cadastrado.</p>
          ) : (
            <ul className="space-y-1 text-sm text-gray-700">
              {c.contacts.map((contact, idx) => (
                <li key={idx}>
                  <span className="font-medium">{contact.name}</span>
                  {contact.phone && ` · ${contact.phone}`}
                  {contact.email && ` · ${contact.email}`}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">Documentos</h2>
          {c.folder_url ? (
            <a
              href={c.folder_url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Abrir pasta de documentos
            </a>
          ) : (
            <p className="text-sm text-gray-500">Nenhuma pasta vinculada.</p>
          )}
          {c.notes && (
            <>
              <h2 className="mb-1 mt-3 text-sm font-semibold text-gray-900">Observações</h2>
              <p className="whitespace-pre-wrap text-sm text-gray-700">{c.notes}</p>
            </>
          )}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Tarefas</h2>
          <Link
            href={`/tasks/new?client_id=${c.id}`}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            + nova tarefa
          </Link>
        </div>
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma tarefa para este cliente.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-100">
              {tasks.map((t) => (
                <li key={t.id} className="flex items-start justify-between gap-4 px-4 py-3">
                  <div className={t.status === "done" ? "opacity-50" : ""}>
                    <p className="text-sm font-medium text-gray-900">{t.title}</p>
                    {t.description && <p className="text-sm text-gray-600">{t.description}</p>}
                    {t.due_date && (
                      <p className="mt-1 text-xs text-gray-500">
                        Prazo: {new Date(t.due_date + "T00:00:00").toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <ToggleTaskButton taskId={t.id} status={t.status} path={`/clients/${c.id}`} />
                    <Link
                      href={`/tasks/${t.id}/edit?redirect_to=${encodeURIComponent(`/clients/${c.id}`)}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <DeleteTaskButton taskId={t.id} path={`/clients/${c.id}`} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-gray-900">Histórico de atendimentos</h2>
        {interactions.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum atendimento registrado ainda.</p>
        ) : (
          <ul className="space-y-3">
            {interactions.map((i) => (
              <li key={i.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span className="font-mono">#{String(i.number).padStart(4, "0")}</span>
                  <span>·</span>
                  <span>{new Date(i.occurred_at).toLocaleString("pt-BR")}</span>
                  <span>·</span>
                  <span>{CHANNEL_LABELS[i.channel]}</span>
                  {i.requested_by && (
                    <>
                      <span>·</span>
                      <span>{i.requested_by}</span>
                    </>
                  )}
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${
                      i.status === "done"
                        ? "bg-green-100 text-green-800"
                        : i.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {STATUS_LABELS[i.status]}
                  </span>
                  <Link href={`/interactions/${i.id}/edit`} className="text-blue-600 hover:underline">
                    Editar
                  </Link>
                </div>
                <p className="text-sm font-medium text-gray-900">{i.summary}</p>
                {i.response && (
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{i.response}</p>
                )}
                {i.links.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {i.links.map((link) => (
                      <li key={link}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                {i.images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {i.images.map((url) => (
                      <a key={url} href={url} target="_blank" rel="noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt=""
                          className="h-16 w-16 rounded-md border border-gray-200 object-cover"
                        />
                      </a>
                    ))}
                  </div>
                )}
                {i.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {i.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
