"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import Compartilhar from "@/components/share/Compartilhar";
import { EXERCICIO_POR_ID } from "@/lib/treino/exercicios";
import { GRUPO_DO_MUSCULO } from "@/lib/treino/mapa";
import { AVISO_CARGA } from "@/lib/treino/substituicoes";
import {
  EDITORIAL, EXPLICA_RELACAO, NOME_RELACAO, OBJETIVOS, POPULARES, buscaComparavel, chavePar, compareGoalSuitability, compareStructure,
  diferencas, emComum, lado, mencionaDor, nomeMusculo, precisaEscolher, relacao, respostaRapida, temUmRM, type Lado, type Objetivo,
} from "@/lib/treino/comparador";

/**
 * Comparador de Exercícios. Motor em lib/treino/comparador.ts, sobre a mesma
 * base do Substituidor e do Mapa.
 *
 * Ordem do resultado: resposta rápida → o que é igual → o que muda → tabela
 * → objetivo (muda só o "no seu contexto") → precisa escolher um? → links.
 * ?a=<id>&b=<id> pré-preenche (lido no navegador; a canonical é a URL limpa).
 */

const CAMINHO = "/ferramentas/comparador-de-exercicios";
const DOURADO = "#BA9E50";
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const chip = (on: boolean) => `border px-3 py-2.5 text-sm min-h-[46px] text-left leading-tight transition-colors ${on ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300 hover:border-white/50"} ${foco}`;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

function Campo({ rotulo, valor, onEscolhe, onTexto, placeholder }: { rotulo: string; valor: string | null; onEscolhe: (id: string) => void; onTexto?: (t: string) => void; placeholder: string }) {
  const id = useId();
  const [texto, setTexto] = useState(valor ? EXERCICIO_POR_ID.get(valor)?.nome ?? "" : "");
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(-1);
  const sugestoes = useMemo(() => (valor && EXERCICIO_POR_ID.get(valor)?.nome === texto ? [] : buscaComparavel(texto, 6)), [texto, valor]);
  const escolhe = (x: string) => { onEscolhe(x); setTexto(EXERCICIO_POR_ID.get(x)?.nome ?? ""); setAberto(false); };
  const onKey = (e: React.KeyboardEvent) => {
    if (!sugestoes.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setAberto(true); setAtivo((i) => (i + 1) % sugestoes.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setAtivo((i) => (i <= 0 ? sugestoes.length - 1 : i - 1)); }
    else if (e.key === "Enter" && aberto) { e.preventDefault(); escolhe(sugestoes[Math.max(0, ativo)].id); }
    else if (e.key === "Escape") setAberto(false);
  };
  return (
    <div className="min-w-0">
      <label htmlFor={`${id}-in`} className="block text-sm font-semibold text-white mb-2">{rotulo}</label>
      <div className="relative">
        <input
          id={`${id}-in`} role="combobox" aria-expanded={aberto && sugestoes.length > 0} aria-controls={`${id}-lb`} aria-autocomplete="list"
          aria-activedescendant={aberto && ativo >= 0 && sugestoes[ativo] ? `${id}-o${ativo}` : undefined}
          value={texto} autoComplete="off" placeholder={placeholder}
          onChange={(e) => { setTexto(e.target.value); setAberto(true); setAtivo(-1); onTexto?.(e.target.value); }}
          onFocus={() => setAberto(true)} onBlur={() => window.setTimeout(() => setAberto(false), 150)} onKeyDown={onKey}
          className={`w-full min-w-0 bg-black border border-white/25 focus:border-[#BA9E50] text-white text-base font-bold px-4 py-3 outline-none ${foco}`}
        />
        {aberto && sugestoes.length > 0 && (
          <ul id={`${id}-lb`} role="listbox" className="absolute z-20 left-0 right-0 mt-1 bg-[#111] border border-white/20 max-h-72 overflow-auto">
            {sugestoes.map((s, i) => (
              <li key={s.id} id={`${id}-o${i}`} role="option" aria-selected={i === ativo} onMouseDown={(e) => { e.preventDefault(); escolhe(s.id); }}
                className={`px-4 py-3 text-sm cursor-pointer min-h-[44px] ${i === ativo ? "bg-[#BA9E50]/15 text-white" : "text-gray-300"}`}>{s.nome}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const Lista = ({ itens }: { itens: string[] }) => <ul className="list-disc pl-5 space-y-1 text-sm text-gray-200">{itens.map((t) => <li key={t}>{t}</li>)}</ul>;

export default function Comparador({ inicialA, inicialB, placement = "ferramenta" }: { inicialA?: string; inicialB?: string; placement?: string }) {
  const [a, setA] = useState<string | null>(inicialA ?? null);
  const [b, setB] = useState<string | null>(inicialB ?? null);
  const [obj, setObj] = useState<Objetivo | null>(null);
  const [dor, setDor] = useState(false);
  const [trocando, setTrocando] = useState<"a" | "b" | null>(null);
  const resRef = useRef<HTMLDivElement>(null);
  const comparados = useRef(new Set<string>());
  const [nComparados, setNComparados] = useState(0);

  useEffect(() => {
    trackOncePerSession("exercise_compare_view", { placement });
    if (inicialA || inicialB) return;
    try {
      const q = new URLSearchParams(window.location.search);
      const qa = q.get("a"), qb = q.get("b");
      /* eslint-disable react-hooks/set-state-in-effect -- leitura única da URL, que não existe no servidor */
      if (qa && EXERCICIO_POR_ID.get(qa)) setA(qa);
      if (qb && EXERCICIO_POR_ID.get(qb)) setB(qb);
      /* eslint-enable react-hooks/set-state-in-effect */
    } catch { /* sem URL */ }
  }, [inicialA, inicialB, placement]);

  const la = a ? lado(a) : null, lb = b ? lado(b) : null;
  const igual = !!a && a === b;
  const pronto = la && lb && !igual;

  useEffect(() => {
    if (!pronto) return;
    const k = chavePar(la.id, lb.id);
    if (comparados.current.has(k)) return;
    comparados.current.add(k);
    setNComparados(comparados.current.size);
    trackEvent("exercise_compare_complete", { par: k, placement, n: comparados.current.size });
  });

  const escolhe = (qual: "a" | "b") => (id: string) => {
    (qual === "a" ? setA : setB)(id); setTrocando(null);
    trackEvent(qual === "a" ? "exercise_compare_select_a" : "exercise_compare_select_b", { exercicio: id, placement });
  };
  const onTexto = (t: string) => { setDor(mencionaDor(t)); if (t.trim().length >= 3 && !buscaComparavel(t, 1).length) trackEvent("exercise_compare_search", { resultado: "nao_encontrado", termo: t.trim().toLowerCase().slice(0, 40) }); };
  const usaPar = (x: string, y: string) => { setA(x); setB(y); setObj(null); window.setTimeout(() => resRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }), 60); };

  return (
    <div className="border border-white/15 bg-[#0d0d0d] p-4 sm:p-6" data-testid="comparador">
      <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <Campo key={`a-${a}`} rotulo="Exercício 1" valor={a} onEscolhe={escolhe("a")} onTexto={onTexto} placeholder="Ex.: agachamento livre" />
        <div className="flex sm:flex-col items-center justify-center gap-2 pb-1">
          <span className="text-xs font-semibold tracking-[0.2em]" style={{ color: DOURADO }}>VS</span>
          {a && b && <button type="button" onClick={() => { setA(b); setB(a); }} className={`text-xs text-gray-400 border border-white/15 px-2 py-1 min-h-[32px] ${foco}`} aria-label="Inverter a ordem dos exercícios">⇄ inverter</button>}
        </div>
        <Campo key={`b-${b}`} rotulo="Exercício 2" valor={b} onEscolhe={escolhe("b")} onTexto={onTexto} placeholder="Ex.: leg press" />
      </div>

      {dor && <p className="mt-4 text-sm text-gray-200 border border-white/15 p-3" role="status">A causa de uma dor ou lesão não pode ser determinada por esta ferramenta, e ela não diz qual exercício é mais adequado para isso. Procure uma avaliação com médico ou fisioterapeuta.</p>}
      {igual && <p className="mt-4 text-sm text-gray-300" role="alert">Escolha dois exercícios diferentes.</p>}

      {!pronto && !igual && (
        <div className="mt-6">
          <h2 className="text-white font-semibold mb-3">Comparações populares</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {POPULARES.map(([x, y]) => <button key={x + y} type="button" onClick={() => usaPar(x, y)} className={chip(false)}>{EXERCICIO_POR_ID.get(x)?.nome} × {EXERCICIO_POR_ID.get(y)?.nome}</button>)}
          </div>
        </div>
      )}

      <div ref={resRef} className="scroll-mt-24">
        {pronto && <Resultado a={la} b={lb} obj={obj} setObj={setObj} placement={placement} trocar={setTrocando} trocando={trocando} n={nComparados} />}
      </div>
    </div>
  );
}

function Resultado({ a, b, obj, setObj, trocar, trocando, n }: { a: Lado; b: Lado; obj: Objetivo | null; setObj: (o: Objetivo) => void; placement: string; trocar: (q: "a" | "b" | null) => void; trocando: "a" | "b" | null; n: number }) {
  const rel = relacao(a, b);
  const ed = EDITORIAL[chavePar(a.id, b.id)];
  const comum = emComum(a, b);
  const linhas = compareStructure(a, b);
  const titulo = `${a.nome} ou ${b.nome}?`;

  return (
    <div className="mt-8 space-y-7" aria-live="polite">
      <div className="sticky top-16 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-[#0d0d0d]/95 border-b border-white/10 text-sm text-white font-semibold truncate">{a.nome} <span style={{ color: DOURADO }}>↔</span> {b.nome}</div>

      <section>
        <p className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: DOURADO }}>Resposta rápida</p>
        <h2 className="text-2xl font-bold text-white mt-1" style={h}>{titulo}</h2>
        <p className="text-gray-200 mt-3 leading-relaxed">{respostaRapida(a, b)}</p>
        <p className="text-gray-400 mt-2 text-sm">O melhor depende do que você precisa naquele momento.</p>
        <p className="mt-3 text-sm"><span className="inline-block border border-[#BA9E50]/50 px-2 py-1 text-white">{NOME_RELACAO[rel]}</span> <span className="text-gray-400">{EXPLICA_RELACAO[rel]}</span></p>
      </section>

      {comum.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-white mb-2" style={h}>O que os dois têm em comum?</h3>
          <Lista itens={comum} />
        </section>
      )}

      <section>
        <h3 className="text-lg font-bold text-white mb-3" style={h}>Principais diferenças</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[[a, b], [b, a]].map(([l, o]) => (
            <div key={l.id} className="border border-white/15 p-4">
              <p className="text-white font-semibold mb-2">{l.nome}</p>
              <Lista itens={diferencas(l, o).length ? diferencas(l, o) : ["sem diferença marcante nos critérios da base"]} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-white mb-3" style={h}>Comparação lado a lado</h3>
        {/* Desktop: tabela semântica. Celular: cards empilhados por critério. */}
        <table className="hidden md:table w-full text-sm border border-white/15">
          <thead><tr className="text-left text-white bg-white/5"><th scope="col" className="p-2 w-1/5">Critério</th><th scope="col" className="p-2">{a.nome}</th><th scope="col" className="p-2">{b.nome}</th></tr></thead>
          <tbody className="text-gray-300">
            {linhas.map((r) => <tr key={r.criterio} className="border-t border-white/10"><th scope="row" className="p-2 text-left font-normal text-gray-500 align-top">{r.criterio}</th><td className="p-2 align-top">{r.a}</td><td className="p-2 align-top">{r.b}</td></tr>)}
          </tbody>
        </table>
        <dl className="md:hidden space-y-3">
          {linhas.map((r) => (
            <div key={r.criterio} className="border border-white/10 p-3">
              <dt className="text-xs font-semibold tracking-[0.12em] uppercase text-gray-500">{r.criterio}{r.igual ? " · igual" : ""}</dt>
              {r.igual ? <dd className="text-sm text-gray-200 mt-1">{r.a}</dd> : (
                <>
                  <dd className="text-sm mt-1"><span className="text-white font-semibold">{a.nome}:</span> <span className="text-gray-200">{r.a}</span></dd>
                  <dd className="text-sm mt-1"><span className="text-white font-semibold">{b.nome}:</span> <span className="text-gray-200">{r.b}</span></dd>
                </>
              )}
            </div>
          ))}
        </dl>
        <p className="text-xs text-gray-500 mt-2">Sem notas nem percentuais: músculo é principal ou secundário, e estabilidade e técnica são escalas simples (baixa, moderada, alta). Menor estabilidade não significa exercício pior: em alguns contextos, o apoio permite concentrar mais esforço no músculo-alvo. A amplitude e onde o exercício fica mais pesado mudam com a máquina, a técnica e a pessoa.</p>
        <p className="text-sm text-gray-300 mt-2">Ver exercícios por músculo: {[...new Set([...a.primarios, ...b.primarios])].map((m) => <Link key={m} href={`/exercicios/${GRUPO_DO_MUSCULO[m]}`} className={`${ln} mr-3`}>{nomeMusculo(m)}</Link>)}</p>
      </section>

      {ed?.notas?.length ? (
        <section>
          <h3 className="text-lg font-bold text-white mb-2" style={h}>Vale saber sobre esse par</h3>
          <Lista itens={ed.notas} />
        </section>
      ) : null}

      <section>
        <h3 className="text-lg font-bold text-white mb-1" style={h}>O que você quer priorizar?</h3>
        <p className="text-sm text-gray-400 mb-3">Muda só a conclusão abaixo, não os dados da comparação.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {OBJETIVOS.map((o) => <button key={o.id} type="button" aria-pressed={obj === o.id} onClick={() => { setObj(o.id); trackEvent("exercise_compare_goal", { objetivo: o.id, par: chavePar(a.id, b.id) }); }} className={chip(obj === o.id)}>{o.nome}</button>)}
        </div>
        {obj && (
          <div className="mt-4 border border-[#BA9E50]/40 p-4">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: DOURADO }}>No seu contexto</p>
            <div className="space-y-2 text-sm text-gray-200 leading-relaxed">{compareGoalSuitability(a, b, obj).map((t) => <p key={t}>{t}</p>)}</div>
          </div>
        )}
      </section>

      <section>
        <h3 className="text-lg font-bold text-white mb-2" style={h}>Precisa escolher apenas um?</h3>
        <p className="text-sm text-gray-200">{precisaEscolher(a, b)}</p>
      </section>

      <p className="text-sm text-gray-300 border border-white/15 p-4"><span className="text-white font-semibold">Sobre a carga:</span> {AVISO_CARGA}</p>

      <section className="grid sm:grid-cols-2 gap-3">
        {([[a, "a"], [b, "b"]] as const).map(([l, q]) => (
          <div key={l.id} className="border border-white/15 p-4 text-sm space-y-2">
            <p className="text-white font-semibold">{l.nome}</p>
            <p className="text-gray-400">Não consegue fazer este exercício?</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <Link href={`/ferramentas/substituidor-de-exercicios?exercicio=${l.id}`} onClick={() => trackEvent("exercise_compare_substitute", { exercicio: l.id })} className={`min-h-[40px] inline-flex items-center ${ln}`}>Ver substitutos</Link>
              <button type="button" onClick={() => trocar(trocando === q ? null : q)} className={`min-h-[40px] text-left ${ln}`}>Trocar {l.nome.toLowerCase()}</button>
            </div>
            {trocando === q && <p className="text-xs text-gray-500">Digite o novo exercício no campo {q === "a" ? "1" : "2"}, lá em cima.</p>}
          </div>
        ))}
      </section>

      <section className="text-sm text-gray-300 space-y-1">
        <p className="text-white font-semibold">Vai usar esse exercício no treino?</p>
        <p><Link href="/ferramentas/calculadora-descanso-entre-series" className={ln}>Calcular descanso entre séries →</Link></p>
        <p><Link href="/ferramentas/calculadora-volume-treino" className={ln}>Ver como ele entra no volume semanal →</Link></p>
        {(temUmRM(a) || temUmRM(b)) && <p><Link href="/ferramentas/calculadora-1rm" className={ln}>Calcular 1RM →</Link></p>}
        {ed?.artigo && <p><Link href={`/blog/${ed.artigo}`} className={ln}>Leia o artigo completo sobre esse par →</Link></p>}
      </section>

      <div onClickCapture={() => trackEvent("exercise_compare_share", { par: chavePar(a.id, b.id) })}>
        <Compartilhar
          contexto="tool-result" titulo={titulo} caminho={`${CAMINHO}?a=${a.id}&b=${b.id}`} local="tool_result" ferramenta="comparador_exercicios"
          resultado={[`${titulo} Veja as diferenças de músculos, estabilidade e aplicação`]} gancho="Achei isto:" aparencia="solido"
        />
      </div>

      <div className="border border-[#BA9E50]/30 p-4">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: DOURADO }}>{FECHAMENTO_COMPARACAO.titulo}</p>
        {FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white text-sm leading-relaxed mb-3">{t}</p>)}
      </div>

      <div className="border border-white/15 p-4">
        {n >= 3 ? (
          <>
            <p className="text-white font-semibold">Está em dúvida entre vários exercícios para montar seu treino?</p>
            <p className="text-gray-300 text-sm mt-1">Posso estruturar isso de acordo com seu objetivo e com o que tem na sua academia.</p>
          </>
        ) : (
          <>
            <p className="text-white font-semibold">O exercício não precisa ganhar a comparação. Ele precisa fazer sentido dentro do treino.</p>
            <p className="text-gray-300 text-sm mt-1">Volume, ordem, progressão, descanso e a sua rotina também importam. E quando a carga parar de subir ou um exercício não encaixar, alguém precisa perceber e ajustar.</p>
          </>
        )}
        <a href={getWhatsAppUrl(`Oi Montinho! Usei o comparador de exercícios do site (${a.nome} × ${b.nome}) e queria organizar meu treino.`)} target="_blank" rel="noopener noreferrer"
          onClick={() => trackEvent("exercise_compare_whatsapp", { par: chavePar(a.id, b.id) })}
          className={`mt-3 inline-flex items-center justify-center border border-white/25 text-white px-5 py-3 text-sm min-h-[48px] hover:border-white/60 ${foco}`}>
          Quero organizar meu treino →
        </a>
      </div>
    </div>
  );
}
