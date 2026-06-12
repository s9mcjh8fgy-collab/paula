import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-pcbege px-4">
      <div className="w-full max-w-sm rounded-lg border border-pccinza/20 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold text-pcmarrom">
          Assessoria Jurídica
        </h1>
        <p className="mb-6 text-sm text-pccinza">
          Acesse com sua conta da equipe
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-pcmarrom">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-pcmarrom">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-pclaranja px-3 py-2 text-sm font-semibold text-white hover:bg-pclaranjadark"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
