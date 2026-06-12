import Link from "next/link";
import Image from "next/image";
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

  const links = [
    { href: "/", label: "Painel" },
    { href: "/clients", label: "Clientes" },
    { href: "/interactions/new", label: "Novo Atendimento" },
    { href: "/interactions", label: "Demandas" },
    { href: "/tasks", label: "Tarefas" },
    { href: "/search", label: "Buscar" },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col bg-pcmarrom px-4 py-6 text-white">
        <Link href="/" className="mb-8 flex items-center gap-2 px-2">
          <Image src="/logo.png" alt="Paula Corrêa Advocacia" width={40} height={40} />
          <span className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Paula Corrêa
          </span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-2 py-2 text-sm text-pcbege hover:text-pclaranja"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="px-2 text-xs text-pcbege">{user?.email}</p>
          <form action={logout}>
            <button className="mt-1 rounded-lg px-2 py-2 text-sm text-pcbege hover:text-pclaranja">
              Sair
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 bg-pcbege px-6 py-6">{children}</main>
    </div>
  );
}
