"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const PRINCIPAL = [
  { href: "/crm", rotulo: "Hoje", icone: "☀" },
  { href: "/crm/leads", rotulo: "Leads", icone: "👤" },
  { href: "/crm/pipeline", rotulo: "Pipeline", icone: "▥" },
  { href: "/crm/clientes", rotulo: "Clientes", icone: "★" },
];
const MAIS = [
  { href: "/crm/follow-ups", rotulo: "Follow-ups" },
  { href: "/crm/agenda", rotulo: "Agenda" },
  { href: "/crm/handoffs", rotulo: "Chegaram pelo site" },
  { href: "/crm/indicacoes", rotulo: "Indicações" },
  { href: "/crm/analytics", rotulo: "Analytics" },
  { href: "/crm/analytics/aquisicao", rotulo: "Aquisição" },
  { href: "/crm/analytics/ltv", rotulo: "LTV & Retenção" },
  { href: "/crm/qualidade-de-dados", rotulo: "Qualidade dos dados" },
  { href: "/crm/dicionario", rotulo: "Dicionário de métricas" },
  { href: "/crm/configuracoes", rotulo: "Configurações" },
];

export default function Shell({ children, usuario, sair }: { children: ReactNode; usuario: { nome: string | null; email: string; role: string }; sair: () => Promise<void> }) {
  const pathname = usePathname();
  const ativo = (href: string) => (href === "/crm" ? pathname === "/crm" : pathname.startsWith(href));
  return (
    <div className="min-h-screen bg-zinc-950 text-white lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-white/10 bg-black/40 lg:flex lg:flex-col">
        <div className="px-5 py-5">
          <Link href="/crm" className="font-serif text-lg font-semibold">Montinho · CRM</Link>
          <div className="mt-1 truncate text-xs text-zinc-500">{usuario.nome ?? usuario.email}</div>
        </div>
        <nav className="flex-1 space-y-0.5 px-3">
          {[...PRINCIPAL, ...MAIS].map((i) => (
            <Link key={i.href} href={i.href} className={`block rounded-lg px-3 py-2 text-sm ${ativo(i.href) ? "bg-white text-black" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`}>{i.rotulo}</Link>
          ))}
        </nav>
        <form action={sair} className="p-3"><button className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-500 hover:text-white">Sair</button></form>
      </aside>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-zinc-950/90 px-4 py-3 backdrop-blur lg:hidden">
          <Link href="/crm" className="font-serif text-base font-semibold">Montinho · CRM</Link>
          <form action="/crm/leads" method="get" className="flex-1 px-3">
            <input name="q" placeholder="Buscar nome, telefone…" className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-sm" aria-label="Buscar" />
          </form>
          <details className="relative">
            <summary className="cursor-pointer list-none rounded-lg border border-white/15 px-2 py-1 text-sm">Mais</summary>
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-white/10 bg-zinc-900 p-1 shadow-xl">
              {MAIS.map((i) => <Link key={i.href} href={i.href} className="block rounded px-3 py-2 text-sm text-zinc-200 hover:bg-white/10">{i.rotulo}</Link>)}
              <form action={sair}><button className="block w-full rounded px-3 py-2 text-left text-sm text-zinc-500 hover:bg-white/10">Sair</button></form>
            </div>
          </details>
        </header>
        <div className="hidden items-center gap-3 border-b border-white/10 px-6 py-3 lg:flex">
          <form action="/crm/leads" method="get" className="w-full max-w-md">
            <input name="q" placeholder="Buscar por nome, telefone ou e-mail…" className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm" aria-label="Buscar" />
          </form>
          <Link href="/crm/leads/novo" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200">+ Novo lead</Link>
        </div>
        <main className="flex-1">{children}</main>
        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-white/10 bg-zinc-950/95 backdrop-blur lg:hidden" aria-label="Navegação principal">
          {PRINCIPAL.map((i) => (
            <Link key={i.href} href={i.href} className={`flex flex-col items-center py-2 text-[11px] ${ativo(i.href) ? "text-white" : "text-zinc-500"}`}>
              <span className="text-lg leading-none">{i.icone}</span>{i.rotulo}
            </Link>
          ))}
          <Link href="/crm/leads/novo" className="flex flex-col items-center py-2 text-[11px] text-zinc-500"><span className="text-lg leading-none">＋</span>Novo</Link>
        </nav>
      </div>
    </div>
  );
}
