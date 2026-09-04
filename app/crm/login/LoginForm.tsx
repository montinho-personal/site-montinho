"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/crm/supabase/client";

/**
 * Login por e-mail e senha, com link mágico como alternativa. Só e-mail da
 * allowlist consegue criar acesso: o banco recusa o signup dos demais.
 */
export default function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [modo, setModo] = useState<"senha" | "link" | "criar">("senha");
  const [msg, setMsg] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setOcupado(true); setMsg(null);
    const sb = supabaseBrowser();
    const redirectTo = `${location.origin}/crm/auth/callback?next=${encodeURIComponent(next)}`;
    try {
      if (modo === "senha") {
        const { error } = await sb.auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
        location.href = next;
      } else if (modo === "criar") {
        const { error } = await sb.auth.signUp({ email, password: senha, options: { emailRedirectTo: redirectTo } });
        if (error) throw error;
        setMsg("Acesso criado. Se pedir confirmação, veja seu e-mail e clique no link.");
      } else {
        const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo, shouldCreateUser: false } });
        if (error) throw error;
        setMsg("Link enviado. Abra o e-mail neste mesmo aparelho.");
      }
    } catch (err) {
      const m = (err as Error).message ?? "Erro";
      setMsg(/não autorizado/i.test(m) ? "Este e-mail não está autorizado a acessar o CRM." : m);
    } finally { setOcupado(false); }
  }

  const cls = "w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2.5 text-base text-white focus:border-white/40 focus:outline-none";
  return (
    <form onSubmit={enviar} className="mt-6 space-y-3">
      <input type="email" required autoComplete="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className={cls} />
      {modo !== "link" && <input type="password" required minLength={8} autoComplete={modo === "criar" ? "new-password" : "current-password"} placeholder={modo === "criar" ? "Crie uma senha (8+ caracteres)" : "Senha"} value={senha} onChange={(e) => setSenha(e.target.value)} className={cls} />}
      <button disabled={ocupado} className="w-full rounded-lg bg-white px-4 py-2.5 font-medium text-black hover:bg-zinc-200 disabled:opacity-50">
        {ocupado ? "…" : modo === "senha" ? "Entrar" : modo === "criar" ? "Criar acesso" : "Enviar link mágico"}
      </button>
      {msg && <p className="text-sm text-zinc-300">{msg}</p>}
      <div className="flex flex-wrap gap-3 pt-2 text-xs text-zinc-500">
        {modo !== "senha" && <button type="button" onClick={() => setModo("senha")} className="underline">Entrar com senha</button>}
        {modo !== "link" && <button type="button" onClick={() => setModo("link")} className="underline">Receber link por e-mail</button>}
        {modo !== "criar" && <button type="button" onClick={() => setModo("criar")} className="underline">Primeiro acesso: criar senha</button>}
      </div>
    </form>
  );
}
