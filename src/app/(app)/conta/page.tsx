"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function ContaPage() {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    // Reautentica com a senha atual para confirmar identidade
    const { data: { user } } = await supabase.auth.getUser();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email ?? "",
      password: current,
    });

    if (signInError) {
      setError("Senha atual incorreta.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setCurrent("");
      setPassword("");
      setConfirm("");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-sm space-y-6">
      <h1 className="text-lg font-semibold text-pcmarrom">Alterar senha</h1>

      <div className="rounded-lg border border-pccinza/20 bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}
          {success && (
            <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Senha alterada com sucesso!</div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-pcmarrom">Senha atual</label>
            <input
              type="password"
              required
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-pcmarrom">Nova senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-pcmarrom">Confirmar nova senha</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="block w-full rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-pclaranja px-4 py-2 text-sm font-semibold text-white hover:bg-pclaranjadark disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Alterar senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
