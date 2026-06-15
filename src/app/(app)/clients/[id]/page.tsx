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
          <h1 className="text-lg font-semibold text-pcmarrom">{c.name}</h1>
          {c.document && <p className="text-sm text-pccinza">{c.document}</p>}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/clients/${c.id}/edit`}
            className="rounded-lg border border-pccinza/40 px-3 py-2 text-sm font-medium text-pcmarrom hover:bg-pcbege"
          >
            Editar
          </Link>
          <Link
            href={`/interactions/new?client_id=${c.id}`}
            className="rounded-lg bg-pclaranja px-3 py-2 text-sm font-semibold text-white hover:bg-pclaranjadark"
          >
            + Novo atendimento
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-pccinza/20 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-pcmarrom">Contatos</h2>
          {c.contacts.length === 0 ? (
            <p className="text-sm text-pccinza">Nenhum contato cadastrado.</p>
          ) : (
            <ul className="space-y-1 text-sm text-pcmarrom">
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

        <div className="rounded-lg border border-pccinza/20 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-pcmarrom">Documentos</h2>
          {c.folder_url ? (
            <a
              href={c.folder_url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-pclaranja hover:underline"
            >
              Abrir pasta de documentos
            </a>
          ) : (
            <p className="text-sm text-pccinza">Nenhuma pasta vinculada.</p>
          )}
          {c.notes && (
            <>
              <h2 className="mb-1 mt-3 text-sm font-semibold text-pcmarrom">Observações</h2>
              <p className="whitespace-pre-wrap text-sm text-pcmarrom">{c.notes}</p>
            </>
          )}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-pcmarrom">Tarefas</h2>
          <Link
            href={`/tasks/new?client_id=${c.id}`}
            className="text-xs font-medium text-pclaranja hover:underline"
          >
            + nova tarefa
          </Link>
        </div>
        {tasks.length === 0 ? (
          <p className="text-sm text-pccinza">Nenhuma tarefa para este cliente.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-pccinza/20 bg-white">
            <ul className="divide-y divide-pccinza/10">
              {tasks.map((t) => (
                <li key={t.id} className="flex items-start justify-between gap-4 px-4 py-3">
                  <div className={t.status === "done" ? "opacity-50" : ""}>
                    <p className="text-sm font-medium text-pcmarrom">{t.title}</p>
                    {t.description && <p className="line-clamp-3 text-sm text-pccinza">{t.description}</p>}
                    {(t.due_date || t.assigned_to) && (
                      <p className="mt-1 text-xs text-pccinza">
                        {t.due_date && `Prazo: ${new Date(t.due_date + "T00:00:00").toLocaleDateString("pt-BR")}`}
                        {t.due_date && t.assigned_to && " · "}
                        {t.assigned_to && `Responsável: ${t.assigned_to}`}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <ToggleTaskButton taskId={t.id} status={t.status} path={`/clients/${c.id}`} />
                    <Link
                      href={`/tasks/${t.id}/edit?redirect_to=${encodeURIComponent(`/clients/${c.id}`)}`}
                      className="text-sm text-pclaranja hover:underline"
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
        <h2 className="mb-2 text-sm font-semibold text-pcmarrom">Histórico de atendimentos</h2>
        {interactions.length === 0 ? (
          <p className="text-sm text-pccinza">Nenhum atendimento registrado ainda.</p>
        ) : (
          <ul className="space-y-3">
            {interactions.map((i) => (
              <li key={i.id} className="rounded-lg border border-pccinza/20 bg-white p-4">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-pccinza">
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
                        ? "bg-pclaranja text-white"
                        : i.status === "in_progress"
                          ? "bg-pcmarrom text-white"
                          : "bg-pccinza text-white"
                    }`}
                  >
                    {STATUS_LABELS[i.status]}
                  </span>
                  <Link href={`/interactions/${i.id}/edit`} className="text-pclaranja hover:underline">
                    Editar
                  </Link>
                </div>
                <Link href={`/interactions/${i.id}/edit`} className="block hover:underline">
                  {i.title && <p className="text-sm font-medium text-pcmarrom">{i.title}</p>}
                  <p className="line-clamp-3 text-sm text-pccinza">{i.summary}</p>
                </Link>
                {i.links.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {i.links.map((link) => (
                      <li key={link}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-pclaranja hover:underline"
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
                          className="h-16 w-16 rounded-lg border border-pccinza/20 object-cover"
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
                        className="rounded-full bg-pcbege px-2 py-0.5 text-xs text-pccinza"
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
