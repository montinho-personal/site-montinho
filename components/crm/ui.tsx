import Link from "next/link";
import type { ReactNode } from "react";

/** Peças de interface do CRM. Informação antes de decoração; tudo funciona sem JS. */
export const brl = (v: number | null | undefined, casas = 0) => v == null ? "—" : v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: casas, minimumFractionDigits: casas });
export const pct = (v: number | null | undefined, casas = 0) => v == null ? "—" : `${(v * 100).toFixed(casas)}%`;
export const num = (v: number | null | undefined, casas = 0) => v == null ? "—" : v.toLocaleString("pt-BR", { maximumFractionDigits: casas });
export const dataBr = (v: string | null | undefined) => v ? new Date(v).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }) : "—";
export const dataHoraBr = (v: string | null | undefined) => v ? new Date(v).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—";
export function relativo(v: string | null | undefined, agora = new Date()): string {
  if (!v) return "—";
  const ms = new Date(v).getTime() - agora.getTime();
  const abs = Math.abs(ms); const fut = ms > 0;
  const h = abs / 3_600_000; const d = h / 24;
  const t = h < 1 ? `${Math.round(abs / 60_000)} min` : h < 48 ? `${Math.round(h)}h` : `${Math.round(d)} dias`;
  return fut ? `em ${t}` : `há ${t}`;
}
export const dataInput = (d = new Date()) => d.toISOString().slice(0, 10);
export const dataHoraInput = (d = new Date()) => { const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return z.toISOString().slice(0, 16); };

export function Pagina({ titulo, sub, acoes, children }: { titulo: string; sub?: ReactNode; acoes?: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-5 sm:px-6 lg:pb-10">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-white sm:text-3xl">{titulo}</h1>
          {sub && <p className="mt-1 text-sm text-zinc-400">{sub}</p>}
        </div>
        {acoes && <div className="flex flex-wrap gap-2">{acoes}</div>}
      </header>
      {children}
    </div>
  );
}
export function Card({ titulo, children, className = "", acao }: { titulo?: ReactNode; children: ReactNode; className?: string; acao?: ReactNode }) {
  return (
    <section className={`rounded-xl border border-white/10 bg-zinc-900/70 p-4 ${className}`}>
      {(titulo || acao) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {titulo && <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">{titulo}</h2>}
          {acao}
        </div>
      )}
      {children}
    </section>
  );
}
export function Stat({ rotulo, valor, sub, tom = "neutro" }: { rotulo: string; valor: ReactNode; sub?: ReactNode; tom?: "neutro" | "alerta" | "bom" | "ruim" }) {
  const cor = tom === "alerta" ? "text-amber-300" : tom === "bom" ? "text-emerald-300" : tom === "ruim" ? "text-rose-300" : "text-white";
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500">{rotulo}</div>
      <div className={`mt-1 font-serif text-2xl font-semibold ${cor}`}>{valor}</div>
      {sub && <div className="mt-1 text-xs text-zinc-400">{sub}</div>}
    </div>
  );
}
export function Badge({ children, tom = "neutro" }: { children: ReactNode; tom?: "neutro" | "quente" | "morno" | "frio" | "bom" | "ruim" | "alerta" | "info" }) {
  const cores: Record<string, string> = {
    neutro: "bg-white/10 text-zinc-200", quente: "bg-rose-500/20 text-rose-200", morno: "bg-amber-500/20 text-amber-200", frio: "bg-sky-500/20 text-sky-200",
    bom: "bg-emerald-500/20 text-emerald-200", ruim: "bg-rose-500/20 text-rose-200", alerta: "bg-amber-500/20 text-amber-200", info: "bg-sky-500/20 text-sky-200",
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cores[tom]}`}>{children}</span>;
}
export function Btn({ children, tom = "primario", href, tipo = "submit", className = "", pequeno, name, value, target, formAction }: { children: ReactNode; tom?: "primario" | "secundario" | "whatsapp" | "perigo" | "ghost"; href?: string; tipo?: "submit" | "button"; className?: string; pequeno?: boolean; name?: string; value?: string; target?: string; formAction?: (fd: FormData) => void | Promise<void> }) {
  const base = `inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${pequeno ? "px-3 py-1.5 text-sm" : "px-4 py-2.5 text-sm"}`;
  const cores = {
    primario: "bg-white text-black hover:bg-zinc-200", secundario: "border border-white/20 text-white hover:bg-white/10",
    whatsapp: "bg-[#25D366] text-black hover:bg-[#1ebe5b]", perigo: "border border-rose-500/50 text-rose-200 hover:bg-rose-500/10", ghost: "text-zinc-300 hover:text-white hover:bg-white/5",
  };
  const cls = `${base} ${cores[tom]} ${className}`;
  if (href) return <Link href={href} className={cls} target={target} rel={target ? "noopener noreferrer" : undefined}>{children}</Link>;
  return <button type={tipo} className={cls} name={name} value={value} formAction={formAction}>{children}</button>;
}
export function Campo({ rotulo, children, dica }: { rotulo: string; children: ReactNode; dica?: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500">{rotulo}</span>
      {children}
      {dica && <span className="mt-1 block text-xs text-zinc-500">{dica}</span>}
    </label>
  );
}
export const inputCls = "w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2.5 text-base text-white placeholder:text-zinc-600 focus:border-white/40 focus:outline-none";
export function Input(p: React.InputHTMLAttributes<HTMLInputElement>) { return <input {...p} className={`${inputCls} ${p.className ?? ""}`} />; }
export function Select(p: React.SelectHTMLAttributes<HTMLSelectElement>) { return <select {...p} className={`${inputCls} ${p.className ?? ""}`} />; }
export function Textarea(p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea {...p} className={`${inputCls} min-h-[80px] ${p.className ?? ""}`} />; }
export function Vazio({ children }: { children: ReactNode }) { return <p className="rounded-lg border border-dashed border-white/10 p-6 text-center text-sm text-zinc-500">{children}</p>; }
export function Aviso({ children, tom = "info" }: { children: ReactNode; tom?: "info" | "alerta" }) {
  return <div className={`rounded-lg border px-3 py-2 text-sm ${tom === "alerta" ? "border-amber-500/40 bg-amber-500/10 text-amber-100" : "border-sky-500/30 bg-sky-500/10 text-sky-100"}`}>{children}</div>;
}
export function Tabela({ cabecalho, linhas, vazio = "Nada por aqui." }: { cabecalho: ReactNode[]; linhas: ReactNode[][]; vazio?: string }) {
  if (!linhas.length) return <Vazio>{vazio}</Vazio>;
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full min-w-[520px] text-sm">
        <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-zinc-500">
          <tr>{cabecalho.map((c, i) => <th key={i} className="px-3 py-2 font-medium">{c}</th>)}</tr>
        </thead>
        <tbody>
          {linhas.map((l, i) => <tr key={i} className="border-t border-white/5 hover:bg-white/[0.03]">{l.map((c, j) => <td key={j} className="px-3 py-2 align-top">{c}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}
export function Detalhes({ titulo, children, aberto }: { titulo: ReactNode; children: ReactNode; aberto?: boolean }) {
  return (
    <details open={aberto} className="group rounded-lg border border-white/10 bg-black/20">
      <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-zinc-200 hover:bg-white/5">{titulo}</summary>
      <div className="border-t border-white/10 p-3">{children}</div>
    </details>
  );
}
export function Amostra({ n, minimo = 10 }: { n: number; minimo?: number }) {
  return n < minimo ? <Badge tom="alerta">amostra pequena (n={n})</Badge> : <span className="text-xs text-zinc-500">n={n}</span>;
}
