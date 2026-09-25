"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { ATLETAS_BRASIL, CATEGORIAS, DIA_TEXTO, STATUS_TEXTO, categoria, type Dia } from "@/lib/olympia-brasil";

/**
 * Painel Brasil no Mr. Olympia 2026: filtros 100% client-side, sem URL nova
 * por filtro (o canonical é o do artigo). O HTML inicial já traz todos os
 * cards, então o conteúdo está no HTML mesmo sem JavaScript.
 */

const DIAS: { id: "todos" | Dia; t: string }[] = [
  { id: "todos", t: "Todos" },
  { id: "sexta", t: "Sexta" },
  { id: "sabado", t: "Sábado" },
];

const chip = (on: boolean) =>
  `px-3 py-1.5 text-sm border transition-colors ${on ? "bg-[#BA9E50] border-[#BA9E50] text-black font-semibold" : "border-white/20 text-gray-300 hover:border-white/50"}`;

export default function PainelBrasil() {
  const [dia, setDia] = useState<"todos" | Dia>("todos");
  const [cat, setCat] = useState("todas");
  const [soResultado, setSoResultado] = useState(false);
  const [busca, setBusca] = useState("");

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
    return ATLETAS_BRASIL.filter((x) => {
      const c = categoria(x.categoria);
      if (dia !== "todos" && c.dia !== dia) return false;
      if (cat !== "todas" && x.categoria !== cat) return false;
      if (soResultado && x.status !== "final") return false;
      if (q && !x.nome.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").includes(q)) return false;
      return true;
    });
  }, [dia, cat, soResultado, busca]);

  const filtro = (nome: string, valor: string) => trackEvent("olympia_brasil_filter", { filter: nome, value: valor });

  return (
    <div className="not-prose border border-white/15 bg-[#0d0d0d] p-4 sm:p-5">
      <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Dia">
        {DIAS.map((d) => (
          <button key={d.id} type="button" aria-pressed={dia === d.id} className={chip(dia === d.id)} onClick={() => { setDia(d.id); filtro("dia", d.id); }}>{d.t}</button>
        ))}
        <button type="button" aria-pressed={soResultado} className={chip(soResultado)} onClick={() => { setSoResultado(!soResultado); filtro("resultado", String(!soResultado)); }}>Só resultados definidos</button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <label className="sr-only" htmlFor="painel-cat">Categoria</label>
        <select id="painel-cat" value={cat} onChange={(e) => { setCat(e.target.value); filtro("categoria", e.target.value); }} className="bg-black border border-white/20 text-gray-200 text-sm px-3 py-2 sm:w-1/2">
          <option value="todas">Todas as categorias</option>
          {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <label className="sr-only" htmlFor="painel-busca">Buscar atleta</label>
        <input id="painel-busca" type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar atleta" className="bg-black border border-white/20 text-gray-200 text-sm px-3 py-2 sm:w-1/2" />
      </div>

      <p className="text-xs text-gray-500 mb-3" aria-live="polite">{lista.length} {lista.length === 1 ? "atleta" : "atletas"}</p>

      {lista.length === 0 ? (
        <p className="text-gray-400 text-sm">{soResultado ? "Nenhum resultado oficial ainda. As primeiras finais são na sexta, a partir das 22h (Brasília)." : "Nenhum atleta com esse filtro."}</p>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-3">
          {lista.map((x) => {
            const c = categoria(x.categoria);
            return (
              <li key={x.nome} className="border border-white/10 bg-black p-3.5">
                <p className="text-white font-semibold leading-tight">{x.nome}</p>
                <p className="text-[#BA9E50] text-sm">{c.nome}</p>
                <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs text-gray-400">
                  <dt>Roster</dt><dd className="text-gray-200">{x.representacao}</dd>
                  <dt>Dia</dt><dd className="text-gray-200">{DIA_TEXTO[c.dia]}</dd>
                  <dt>Status</dt><dd className="text-gray-200">{STATUS_TEXTO[x.status]}</dd>
                  <dt>Resultado</dt><dd className="text-gray-200">{x.resultado ?? "—"}</dd>
                </dl>
                {x.destaque && <p className="mt-2 text-xs text-gray-500">{x.destaque}</p>}
                {c.artigo && (
                  <Link href={`/blog/${c.artigo}`} className="mt-2 inline-block text-xs underline underline-offset-4 text-gray-300 hover:text-white" onClick={() => trackEvent("olympia_brasil_card_click", { category: c.id })}>
                    Ver resultado da {c.nome.replace(" (Mr. Olympia)", "")}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
