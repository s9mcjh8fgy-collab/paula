import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm font-semibold text-gray-900">
              Assessoria Jurídica
            </Link>
            <Link href="/clients" className="text-sm text-gray-600 hover:text-gray-900">
              Clientes
            </Link>
            <Link href="/interactions/new" className="text-sm text-gray-600 hover:text-gray-900">
              Novo Atendimento
            </Link>
            <Link href="/interactions" className="text-sm text-gray-600 hover:text-gray-900">
              Demandas
            </Link>
            <Link href="/tasks" className="text-sm text-gray-600 hover:text-gray-900">
              Tarefas
            </Link>
            <Link href="/search" className="text-sm text-gray-600 hover:text-gray-900">
              Buscar
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{user?.email}</span>
            <form action={logout}>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
