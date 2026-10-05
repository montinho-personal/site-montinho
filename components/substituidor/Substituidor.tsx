"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import Compartilhar from "@/components/share/Compartilhar";
import { EXERCICIO_POR_ID } from "@/lib/treino/exercicios";
import { MUSCULOS } from "@/lib/treino/musculos";
import { ACADEMIA_COMPLETA, EQUIPAMENTOS, NOME_PADRAO, type Equip } from "@/lib/treino/biomecanica";
import { PAGINAS_SUBSTITUIR } from "@/lib/treino/substituir-seo";
import { AVISO_CARGA, MOTIVOS, NOME_TIER, buscaSubstituivel, substitui, type Alternativa, type Motivo, type Nivel } from "@/lib/treino/substituicoes";

/**
 * "Qual exercício posso fazer no lugar?" — o motor está em
 * lib/treino/substituicoes.ts; a base é a mesma da Calculadora de Volume.
 *
 * Fluxo de 3 passos: exercício → motivo → equipamentos. O resultado aparece
 * assim que os dois primeiros existem (equipamento tem padrão sensato), para
 * a resposta sair em segundos. Nível fica em "Refinar", depois do resultado.
 *
 * ?exercicio=<id> pré-seleciona (lido no navegador; a canonical da página
 * continua limpa). Eventos levam ids e categorias, nunca o texto de dor.
 */

const CAMINHO = "/ferramentas/substituidor-de-exercicios";
const DOURADO = "#BA9E50";
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const chip = (on: boolean) => `border px-3 py-2.5 text-sm min-h-[46px] text-left leading-tight transition-colors ${on ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300 hover:border-white/50"} ${foco}`;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const nomeM = (id: string) => MUSCULOS.find((m) => m.id === id)?.nome ?? id;
const NIVEL_TXT = ["", "Fácil de aprender", "Técnica moderada", "Mais técnico"];
const ESTAB_TXT = ["", "Guiado/apoiado", "Estabilidade moderada", "Exige muito controle"];

function Card({ a, sel, onSel, onAbrir }: { a: Alternativa; sel: boolean; onSel: () => void; onAbrir: () => void }) {
  return (
    <li className="border border-white/15 bg-black p-4">
      <p className="text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ color: DOURADO }}>{NOME_TIER[a.tier]}</p>
      <h4 className="text-lg font-bold text-white mt-1" style={h}>{a.ex.nome}</h4>
      <ul className="flex flex-wrap gap-1.5 mt-2" aria-label="Características">
        {a.tags.map((t) => <li key={t} className="text-[11px] border border-white/20 text-gray-300 px-2 py-0.5">{t}</li>)}
      </ul>
      <div className="grid sm:grid-cols-2 gap-3 mt-3 text-sm">
        <div><p className="text-white font-semibold">✓ O que preserva</p><ul className="text-gray-300 mt-1 space-y-0.5">{a.preserva.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div><p className="text-white font-semibold">↔ O que muda</p><ul className="text-gray-300 mt-1 space-y-0.5">{a.muda.length ? a.muda.map((x) => <li key={x}>{x}</li>) : <li>Pouca coisa: é uma variação próxima.</li>}</ul></div>
      </div>
      {a.quando && <p className="text-sm text-gray-400 mt-3"><span className="text-white">Quando escolher:</span> {a.quando}</p>}
      <details className="mt-3" onToggle={(e) => { if ((e.target as HTMLDetailsElement).open) onAbrir(); }}>
        <summary className="text-sm cursor-pointer min-h-[32px]" style={{ color: DOURADO }}>Por que essa opção?</summary>
        <p className="text-sm text-gray-300 mt-1">{a.porque}</p>
        <p className="text-xs text-gray-500 mt-1">{NIVEL_TXT[a.ex.tecnica]} · {ESTAB_TXT[a.ex.estabilidade]} · {a.ex.unilateral ? "um lado por vez" : "bilateral"}</p>
      </details>
      <label className="mt-3 flex items-center gap-2 text-xs text-gray-400 cursor-pointer min-h-[32px]">
        <input type="checkbox" checked={sel} onChange={onSel} className="accent-[#BA9E50] w-4 h-4" /> Comparar
      </label>
    </li>
  );
}

export default function Substituidor({ inicialId, inicialMotivo, inicialEquip, placement = "ferramenta" }: { inicialId?: string; inicialMotivo?: Motivo; inicialEquip?: Equip[]; placement?: string }) {
  const listId = useId();
  const [texto, setTexto] = useState(inicialId ? EXERCICIO_POR_ID.get(inicialId)?.nome ?? "" : "");
  const [exId, setExId] = useState<string | null>(inicialId ?? null);
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(-1);
  const [motivo, setMotivo] = useState<Motivo | null>(inicialMotivo ?? null);
  const [equip, setEquip] = useState<Equip[]>(inicialEquip ?? ACADEMIA_COMPLETA);
  const [nivel, setNivel] = useState<Nivel | null>(null);
  const [comparar, setComparar] = useState<string[]>([]);
  const ultimaBuscaVazia = useRef("");

  useEffect(() => {
    trackOncePerSession("exercise_substitution_view", { placement });
    if (inicialId) return;
    try {
      const q = new URLSearchParams(window.location.search).get("exercicio");
      const e = q ? EXERCICIO_POR_ID.get(q) : null;
      if (e) { setExId(e.id); setTexto(e.nome); }
    } catch { /* sem URL */ }
  }, [inicialId, placement]);

  const sugestoes = useMemo(() => (exId && EXERCICIO_POR_ID.get(exId)?.nome === texto ? [] : buscaSubstituivel(texto, 6)), [texto, exId]);
  const naoAchou = texto.trim().length >= 3 && sugestoes.length === 0 && !exId;
  useEffect(() => {
    if (!naoAchou || ultimaBuscaVazia.current === texto) return;
    const id = window.setTimeout(() => { ultimaBuscaVazia.current = texto; trackEvent("exercise_search", { resultado: "nao_encontrado", termo: texto.trim().toLowerCase().slice(0, 40) }); }, 1200);
    return () => window.clearTimeout(id);
  }, [naoAchou, texto]);

  const escolhe = (id: string) => {
    const e = EXERCICIO_POR_ID.get(id); if (!e) return;
    setExId(id); setTexto(e.nome); setAberto(false); setComparar([]);
    trackEvent("exercise_selected", { exercicio: id, placement });
  };
  const escolheMotivo = (m: Motivo) => {
    setMotivo(m); setComparar([]);
    if (m === "casa" && equip.includes("maquina")) setEquip(["halter", "elastico"]);
    trackEvent("substitution_reason_selected", { motivo: m });
  };
  const alterna = (q: Equip) => { setEquip((xs) => (xs.includes(q) ? xs.filter((x) => x !== q) : [...xs, q])); trackEvent("equipment_selected", { equipamento: q }); };

  const res = useMemo(() => (exId && motivo ? substitui({ exercicioId: exId, motivo, equipamentos: equip, nivel: nivel ?? undefined }) : null), [exId, motivo, equip, nivel]);
  const chave = res ? `${exId}-${motivo}-${equip.join(",")}-${nivel}` : "";
  const ultima = useRef("");
  useEffect(() => {
    if (!res || ultima.current === chave) return;
    ultima.current = chave;
    trackEvent("substitution_result", { exercicio: exId ?? "", motivo: motivo ?? "", n_proximas: res.proximas.length, n_mesmo_musculo: res.mesmoMusculo.length, placement });
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const todos = res ? [...res.proximas, ...res.mesmoMusculo] : [];
  const comp = comparar.map((id) => todos.find((a) => a.ex.id === id)).filter(Boolean) as Alternativa[];
  const toggleComp = (id: string) => setComparar((xs) => { const n = xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id].slice(-2); if (n.length === 2) trackEvent("alternative_compare", { a: n[0], b: n[1] }); return n; });

  const onKey = (e: React.KeyboardEvent) => {
    if (!sugestoes.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setAberto(true); setAtivo((i) => (i + 1) % sugestoes.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setAtivo((i) => (i <= 0 ? sugestoes.length - 1 : i - 1)); }
    else if (e.key === "Enter" && aberto) { e.preventDefault(); escolhe(sugestoes[Math.max(0, ativo)].id); }
    else if (e.key === "Escape") setAberto(false);
  };

  const orig = res?.original;
  const ctaCasa = motivo === "sem-aparelho" || motivo === "casa";

  return (
    <div className="border border-white/15 bg-[#0d0d0d] p-5 sm:p-6" data-testid="substituidor">
      <div className="space-y-6">
        <div>
          <label htmlFor={`${listId}-in`} className="block text-sm font-semibold text-white mb-2">1. Qual exercício você quer substituir?</label>
          <div className="relative">
            <input
              id={`${listId}-in`} role="combobox" aria-expanded={aberto && sugestoes.length > 0} aria-controls={`${listId}-lb`} aria-autocomplete="list"
              aria-activedescendant={aberto && ativo >= 0 && sugestoes[ativo] ? `${listId}-o${ativo}` : undefined}
              value={texto} autoComplete="off" placeholder="Ex.: cadeira extensora, leg press, puxador…"
              onChange={(e) => { setTexto(e.target.value); setExId(null); setAberto(true); setAtivo(-1); }}
              onFocus={() => setAberto(true)} onBlur={() => window.setTimeout(() => setAberto(false), 150)} onKeyDown={onKey}
              className={`w-full min-w-0 bg-black border border-white/25 focus:border-[#BA9E50] text-white text-lg font-bold px-4 py-3 outline-none ${foco}`}
            />
            {aberto && sugestoes.length > 0 && (
              <ul id={`${listId}-lb`} role="listbox" className="absolute z-20 left-0 right-0 mt-1 bg-[#111] border border-white/20 max-h-72 overflow-auto">
                {sugestoes.map((s, i) => (
                  <li key={s.id} id={`${listId}-o${i}`} role="option" aria-selected={i === ativo} onMouseDown={(e) => { e.preventDefault(); escolhe(s.id); }}
                    className={`px-4 py-3 text-sm cursor-pointer min-h-[44px] ${i === ativo ? "bg-[#BA9E50]/15 text-white" : "text-gray-300"}`}>
                    {s.nome}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {naoAchou && <p className="text-sm text-gray-400 mt-2" role="status">Não encontrei esse exercício. Tente outro nome (ex.: &quot;extensora&quot;, &quot;puxador&quot;) ou escolha o mais parecido. Buscas sem resultado entram na nossa lista para aumentar a base.</p>}
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-white mb-2">2. Por que você quer substituir?</legend>
          <div className="grid grid-cols-2 gap-2">
            {MOTIVOS.map((m) => <button key={m.id} type="button" aria-pressed={motivo === m.id} onClick={() => escolheMotivo(m.id)} className={chip(motivo === m.id)}>{m.nome}</button>)}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-white mb-2">3. Que equipamentos você tem?</legend>
          <div className="flex flex-wrap gap-2 mb-2">
            <button type="button" aria-pressed={equip.length === ACADEMIA_COMPLETA.length} onClick={() => setEquip(ACADEMIA_COMPLETA)} className={chip(equip.length === ACADEMIA_COMPLETA.length)}>Academia completa</button>
            <button type="button" aria-pressed={equip.length === 0} onClick={() => setEquip([])} className={chip(equip.length === 0)}>Só peso corporal</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {EQUIPAMENTOS.map((q) => <button key={q.id} type="button" aria-pressed={equip.includes(q.id)} onClick={() => alterna(q.id)} className={chip(equip.includes(q.id))}>{equip.includes(q.id) ? "✓ " : ""}{q.nome}</button>)}
          </div>
        </fieldset>
      </div>

      {!res && exId && !motivo && <p className="text-sm text-gray-500 mt-5">Escolha o motivo para ver as alternativas.</p>}

      {res && orig && (
        <div aria-live="polite" className="mt-7 border-t border-white/10 pt-6 space-y-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: DOURADO }}>Alternativas para</p>
            <h3 className="text-2xl font-bold text-white mt-1" style={h}>{orig.nome}</h3>
            <p className="text-sm text-gray-400 mt-1">O que tentamos preservar: <span className="text-gray-200">{orig.primarios.map(nomeM).join(" e ")}</span> · <span className="text-gray-200">{NOME_PADRAO[orig.padrao]}</span></p>
          </div>

          {res.avisos.map((x) => <p key={x} role="note" className="border-l-2 border-[#BA9E50] pl-4 text-sm text-gray-200">{x}</p>)}

          <section>
            <h3 className="text-white font-semibold mb-3">Mais parecidos</h3>
            {res.proximas.length ? (
              <ul className="space-y-3">{res.proximas.map((a) => <Card key={a.ex.id} a={a} sel={comparar.includes(a.ex.id)} onSel={() => toggleComp(a.ex.id)} onAbrir={() => trackEvent("alternative_open", { exercicio: exId ?? "", alternativa: a.ex.id })} />)}</ul>
            ) : <p className="text-sm text-gray-400">Com esses equipamentos não encontrei uma alternativa com o mesmo movimento. Marque mais equipamentos ou veja abaixo outras formas de treinar o mesmo músculo.</p>}
          </section>

          {res.mesmoMusculo.length > 0 && (
            <section>
              <h3 className="text-white font-semibold">Outras formas de treinar o mesmo músculo</h3>
              <p className="text-sm text-gray-400 mb-3">Trabalham o mesmo músculo, mas com outra função. Complementam o treino; não reproduzem o original.</p>
              <ul className="space-y-3">{res.mesmoMusculo.map((a) => <Card key={a.ex.id} a={a} sel={comparar.includes(a.ex.id)} onSel={() => toggleComp(a.ex.id)} onAbrir={() => trackEvent("alternative_open", { exercicio: exId ?? "", alternativa: a.ex.id })} />)}</ul>
            </section>
          )}

          {comp.length === 2 && (
            <section aria-label="Comparação">
              <h3 className="text-white font-semibold mb-2">Comparando</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-white/15">
                  <thead><tr className="text-left text-white bg-white/5"><th className="p-2" scope="col"></th>{comp.map((c) => <th key={c.ex.id} className="p-2" scope="col">{c.ex.nome}</th>)}</tr></thead>
                  <tbody className="text-gray-300">
                    {([["Movimento", (c: Alternativa) => NOME_PADRAO[c.ex.padrao]], ["Músculos", (c: Alternativa) => c.ex.primarios.map(nomeM).join(", ")], ["Estabilidade", (c: Alternativa) => ESTAB_TXT[c.ex.estabilidade]], ["Técnica", (c: Alternativa) => NIVEL_TXT[c.ex.tecnica]], ["Lados", (c: Alternativa) => (c.ex.unilateral ? "Um por vez" : "Os dois")], ["Proximidade", (c: Alternativa) => NOME_TIER[c.tier]]] as const).map(([rot, f]) => (
                      <tr key={rot} className="border-t border-white/10"><th scope="row" className="p-2 text-left font-normal text-gray-500">{rot}</th>{comp.map((c) => <td key={c.ex.id} className="p-2">{f(c)}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <p className="text-sm text-gray-300 border border-white/15 p-4"><span className="text-white font-semibold">Sobre a carga:</span> {AVISO_CARGA}</p>

          <details className="border border-white/15 p-4">
            <summary className="text-white font-semibold cursor-pointer min-h-[32px]">Refinar alternativas</summary>
            <p className="text-sm text-gray-400 mt-2 mb-2">Nível de experiência</p>
            <div className="grid grid-cols-3 gap-2">
              {([["iniciante", "Iniciante"], ["intermediario", "Intermediário"], ["avancado", "Avançado"]] as const).map(([id, n]) => <button key={id} type="button" aria-pressed={nivel === id} onClick={() => setNivel(nivel === id ? null : id)} className={chip(nivel === id) + " text-center"}>{n}</button>)}
            </div>
          </details>

          <div onClickCapture={() => trackEvent("substitution_share", { exercicio: exId ?? "" })}>
            <Compartilhar
              contexto="tool-result" titulo="Qual exercício posso fazer no lugar?" caminho={(() => { const pg = PAGINAS_SUBSTITUIR.find((x) => x.exercicioId === exId && x.isIndexable); return pg ? `/substituir/${pg.slug}` : CAMINHO; })()} local="tool_result" ferramenta="substituidor_exercicios"
              resultado={[`Não tem ${orig.nome.toLowerCase()}? Algumas alternativas para o mesmo objetivo: ${res.proximas.slice(0, 3).map((a) => a.ex.nome).join(", ")}`]}
              gancho="Achei isto:" aparencia="solido"
            />
          </div>

          <div className="border border-white/15 p-4">
            {ctaCasa ? (
              <>
                <p className="text-white font-semibold">Seu treino tem vários exercícios que você não consegue fazer onde treina?</p>
                <p className="text-gray-300 text-sm mt-1">Posso adaptar o treino inteiro para o que você realmente tem disponível.</p>
              </>
            ) : (
              <>
                <p className="text-white font-semibold">Trocar um exercício é fácil. Fazer todas as peças do treino conversarem é outra história.</p>
                <p className="text-gray-300 text-sm mt-1">Se você quer um treino estruturado considerando sua academia, rotina, limitações e objetivo, posso montar isso com você.</p>
              </>
            )}
            <a href={getWhatsAppUrl("Oi Montinho! Usei o substituidor de exercícios do site e queria um treino adaptado para o que eu tenho disponível.")} target="_blank" rel="noopener noreferrer"
              onClick={() => trackEvent("substitution_whatsapp_cta", { motivo: motivo ?? "" })}
              className={`mt-3 inline-flex items-center justify-center border border-white/25 text-white px-5 py-3 text-sm min-h-[48px] hover:border-white/60 ${foco}`}>
              Quero um treino adaptado para mim →
            </a>
          </div>
          <p className="text-xs text-gray-500">Quer ver se o volume semanal continua equilibrado depois da troca? Use a <Link href="/ferramentas/calculadora-volume-treino" className={ln} onClick={() => trackEvent("substitution_article_click", { destino: "volume" })}>calculadora de volume</Link>: ela usa a mesma base de exercícios.</p>
        </div>
      )}
    </div>
  );
}
