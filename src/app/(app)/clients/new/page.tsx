import { ClientForm } from "../client-form";
import { createClientRecord } from "../actions";

export default async function NewClientPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-lg font-semibold text-pcmarrom">Novo cliente</h1>
      <div className="rounded-lg border border-pccinza/20 bg-white p-6">
        <ClientForm action={createClientRecord} error={error} />
      </div>
    </div>
  );
}
