"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { moverEtapa } from "@/app/crm/actions";

export interface CartaoKanban { oppId: string; leadId: string; nome: string; stageCode: string; valor: number | null; temperatura: string; proximaAcao: string | null; proximaAcaoEm: string | null; atrasado: boolean; servico: string }
export interface ColunaKanban { code: string; nome: string }

/**
 * Kanban com arrastar-e-soltar E com <select> por cartão: as duas formas
 * chamam a mesma action, que grava o histórico de etapa. Ganho/perdido não
 * entram aqui: exigem os formulários com campos obrigatórios.
 */
export default function Kanban({ colunas, cartoes }: { colunas: ColunaKanban[]; cartoes: CartaoKanban[] }) {
  const [itens, setItens] = useState(cartoes);
  const [arrastando, setArrastando] = useState<string | null>(null);
  const [pendente, start] = useTransition();

  function mover(oppId: string, code: string) {
    setItens((xs) => xs.map((x) => (x.oppId === oppId ? { ...x, stageCode: code } : x)));
    const fd = new FormData(); fd.set("opportunity_id", oppId); fd.set("stage_code", code);
    start(() => moverEtapa(fd));
  }
  const cor = (t: string) => t === "quente" ? "bg-rose-500/20 text-rose-200" : t === "morno" ? "bg-amber-500/20 text-amber-200" : "bg-sky-500/20 text-sky-200";

  return (
    <div className={`flex gap-3 overflow-x-auto pb-4 ${pendente ? "opacity-70" : ""}`}>
      {colunas.map((c) => {
        const lista = itens.filter((i) => i.stageCode === c.code);
        const total = lista.reduce((s, i) => s + (i.valor ?? 0), 0);
        return (
          <section key={c.code} className="flex w-72 shrink-0 flex-col rounded-xl border border-white/10 bg-zinc-900/50"
            onDragOver={(e) => { e.preventDefault(); }} onDrop={() => { if (arrastando) { mover(arrastando, c.code); setArrastando(null); } }}>
            <header className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-sm"><span className="font-medium">{c.nome}</span><span className="text-xs text-zinc-500">{lista.length}{total ? ` · R$ ${total.toLocaleString("pt-BR")}` : ""}</span></header>
            <div className="flex-1 space-y-2 p-2">
              {lista.map((i) => (
                <article key={i.oppId} draggable onDragStart={() => setArrastando(i.oppId)} onDragEnd={() => setArrastando(null)} className={`rounded-lg border border-white/10 bg-zinc-900 p-2 text-sm ${arrastando === i.oppId ? "opacity-50" : ""}`}>
                  <div className="flex items-center justify-between gap-2"><Link href={`/crm/leads/${i.leadId}`} className="truncate font-medium hover:underline">{i.nome}</Link><span className={`rounded-full px-1.5 text-[10px] ${cor(i.temperatura)}`}>{i.temperatura}</span></div>
                  <div className="mt-1 text-xs text-zinc-500">{i.servico}{i.valor ? ` · R$ ${i.valor.toLocaleString("pt-BR")}/mês` : ""}</div>
                  <div className={`mt-1 text-xs ${i.atrasado ? "text-rose-300" : i.proximaAcaoEm ? "text-zinc-400" : "text-amber-300"}`}>{i.proximaAcaoEm ? `${i.proximaAcao ?? "próxima ação"} · ${new Date(i.proximaAcaoEm).toLocaleDateString("pt-BR")}` : "sem próxima ação"}</div>
                  <label className="mt-2 block text-[10px] text-zinc-500">Mover para
                    <select value={i.stageCode} onChange={(e) => mover(i.oppId, e.target.value)} className="mt-0.5 w-full rounded border border-white/10 bg-black/40 px-1 py-1 text-xs text-zinc-200">
                      {colunas.map((col) => <option key={col.code} value={col.code}>{col.nome}</option>)}
                    </select>
                  </label>
                </article>
              ))}
              {lista.length === 0 && <p className="p-2 text-center text-xs text-zinc-600">vazio</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
}
