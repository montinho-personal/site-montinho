"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import Compartilhar from "@/components/share/Compartilhar";
import MapaCorpo, { type Vista, vistaDe } from "@/components/mapa/MapaCorpo";
import { ACADEMIA_COMPLETA, NOME_PADRAO, type Equip } from "@/lib/treino/biomecanica";
import {
  ARTIGO_DO_EXERCICIO, EQUIP_CASA, GRUPO, GRUPOS, GRUPOS_PRINCIPAIS, GRUPO_DO_MUSCULO, NIVEL_TXT,
  busca, equipTexto, exerciciosDoGrupo, filtra, nomeMusculo, type ExercicioMapa, type GrupoSlug,
} from "@/lib/treino/mapa";

const DOURADO = "#BA9E50";
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const chip = (on: boolean) => `border px-3 py-2 text-sm min-h-[44px] whitespace-nowrap transition-colors ${on ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300 hover:border-white/50"} ${foco}`;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

type Preset = "academia" | "casa" | "sem-equipamento" | "halter" | "barra" | "maquina" | "polia" | "elastico";
const PRESETS: { id: Preset; nome: string; equip: Equip[] }[] = [
  { id: "academia", nome: "Academia", equip: ACADEMIA_COMPLETA },
  { id: "casa", nome: "Casa", equip: EQUIP_CASA },
  { id: "sem-equipamento", nome: "Sem equipamento", equip: [] },
  { id: "halter", nome: "Halteres", equip: ["halter", "banco"] },
  { id: "barra", nome: "Barra", equip: ["barra", "banco"] },
  { id: "maquina", nome: "Máquina", equip: ["maquina", "smith"] },
  { id: "polia", nome: "Polia", equip: ["polia"] },
  { id: "elastico", nome: "Elástico", equip: ["elastico"] },
];

function Card({ e, placement }: { e: ExercicioMapa; placement: string }) {
  const [aberto, setAberto] = useState(false);
  const artigo = ARTIGO_DO_EXERCICIO[e.id];
  return (
    <li className="border border-white/15 bg-black p-4">
      <h4 className="text-base font-bold text-white" style={h}>{e.nome}</h4>
      <p className="text-sm text-gray-300 mt-1"><span className="text-gray-500">Principal:</span> {e.primarios.map(nomeMusculo).join(", ")}</p>
      {e.secundarios?.length ? <p className="text-sm text-gray-400"><span className="text-gray-500">Secundários:</span> {e.secundarios.map(nomeMusculo).join(" · ")}</p> : null}
      <p className="text-xs text-gray-500 mt-1">{equipTexto(e)} · {NIVEL_TXT[e.tecnica]}{e.unilateral ? " · um lado por vez" : ""}</p>
      {aberto && (
        <div className="mt-3 text-sm text-gray-300 space-y-1">
          <p>Movimento: {NOME_PADRAO[e.padrao]} · {e.categoria === "composto" ? "composto (várias articulações)" : "isolado (uma articulação)"}</p>
          <p>Ver também: {[...e.primarios, ...(e.secundarios ?? [])].map((m) => <Link key={m} href={`/exercicios/${GRUPO_DO_MUSCULO[m]}`} className={`${ln} mr-2`}>{nomeMusculo(m)}</Link>)}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm">
        <button type="button" aria-expanded={aberto} onClick={() => { setAberto(!aberto); if (!aberto) trackEvent("exercise_open", { exercicio: e.id, placement }); }} className={`min-h-[40px] ${foco}`} style={{ color: DOURADO }}>{aberto ? "Menos detalhes" : "Ver detalhes"}</button>
        {artigo && <Link href={`/blog/${artigo}`} onClick={() => trackEvent("exercise_article_click", { exercicio: e.id, placement })} className={`min-h-[40px] inline-flex items-center ${ln}`}>Como fazer</Link>}
        <Link href={`/ferramentas/substituidor-de-exercicios?exercicio=${e.id}`} onClick={() => trackEvent("exercise_substitute_click", { exercicio: e.id, placement })} className={`min-h-[40px] inline-flex items-center ${ln}`}>Ver alternativas</Link>
      </div>
    </li>
  );
}

export default function ExploradorExercicios({ inicial = null, placement = "hub" }: { inicial?: GrupoSlug | null; placement?: string }) {
  const id = useId();
  const [vista, setVista] = useState<Vista>(inicial && ["trapezio", "dorsais", "lombar", "triceps", "gluteos", "posterior-de-coxa", "deltoide-posterior", "costas", "parte-superior-das-costas"].includes(inicial) ? "costas" : "frente");
  const [grupo, setGrupo] = useState<GrupoSlug | null>(inicial);
  const [preset, setPreset] = useState<Preset>("academia");
  const [nivel, setNivel] = useState<1 | 2 | 3 | undefined>();
  const [tipo, setTipo] = useState<"composto" | "isolado" | "unilateral" | "bilateral" | undefined>();
  const [ordem, setOrdem] = useState<"comuns" | "simples" | "alfabetica">("comuns");
  const [secundarios, setSecundarios] = useState(false);
  const [q, setQ] = useState("");
  const [exBusca, setExBusca] = useState<string | null>(null);
  const resRef = useRef<HTMLDivElement>(null);
  const ultimaVazia = useRef("");

  useEffect(() => {
    trackOncePerSession("muscle_map_view", { placement });
    try {
      const p = new URLSearchParams(window.location.search).get("equipamento");
      if (p && PRESETS.some((x) => x.id === p)) setPreset(p as Preset);
    } catch { /* sem URL */ }
  }, [placement]);

  const contagem = useMemo(() => Object.fromEntries(GRUPOS.map((g) => [g.slug, exerciciosDoGrupo(g.slug).length])) as Record<GrupoSlug, number>, []);
  const equip = PRESETS.find((p) => p.id === preset)!.equip;
  const lista = useMemo(() => (grupo ? filtra(exerciciosDoGrupo(grupo, secundarios), { equipamentos: equip, nivel, tipo, ordem }) : []), [grupo, secundarios, equip, nivel, tipo, ordem]);

  const r = useMemo(() => busca(q), [q]);
  useEffect(() => {
    const t = q.trim();
    if (t.length < 3 || r.grupos.length || r.exercicios.length || ultimaVazia.current === t) return;
    const tm = window.setTimeout(() => { ultimaVazia.current = t; trackEvent("exercise_search", { resultado: "nao_encontrado", termo: t.toLowerCase().slice(0, 40), origem: "mapa" }); }, 1200);
    return () => window.clearTimeout(tm);
  }, [q, r]);

  const seleciona = (g: GrupoSlug, origem: string) => {
    setGrupo(g); setExBusca(null);
    trackEvent("muscle_select", { musculo: g, origem, placement });
    window.setTimeout(() => resRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }), 60);
  };
  const ex = exBusca ? r.exercicios.find((e) => e.id === exBusca) ?? null : null;
  const g = grupo ? GRUPO[grupo] : null;
  const subgrupos = g ? (g.filhos ?? (g.pai ? GRUPO[g.pai].filhos ?? [] : [])) : [];
  const ctaCasa = preset === "casa" || preset === "sem-equipamento";

  return (
    <div className="border border-white/15 bg-[#0d0d0d] p-4 sm:p-6" data-testid="mapa-muscular">
      <div className="grid md:grid-cols-[minmax(0,320px)_1fr] gap-6 items-start">
        <div>
          <div className="grid grid-cols-2 gap-2 mb-3" role="group" aria-label="Vista do corpo">
            {(["frente", "costas"] as Vista[]).map((v) => <button key={v} type="button" aria-pressed={vista === v} onClick={() => { setVista(v); trackEvent("body_view_change", { vista: v }); }} className={chip(vista === v) + " text-center"}>{v === "frente" ? "Frente" : "Costas"}</button>)}
          </div>
          <MapaCorpo vista={vista} selecionado={ex ? null : grupo} destaque={ex ? { principal: ex.primarios, secundario: ex.secundarios ?? [] } : undefined} onSelect={(s) => seleciona(s, "mapa")} contagem={contagem} />
          <p className="text-xs text-gray-500 text-center mt-2">Toque numa região. Ou escolha na lista.</p>
        </div>

        <div className="min-w-0 space-y-4">
          <label htmlFor={`${id}-q`} className="block text-sm font-semibold text-white">Buscar exercício ou músculo</label>
          <input id={`${id}-q`} value={q} onChange={(e) => { setQ(e.target.value); setExBusca(null); }} placeholder="Ex.: supino, posterior de ombro, glúteo…" autoComplete="off"
            className={`w-full min-w-0 bg-black border border-white/25 focus:border-[#BA9E50] text-white text-base px-4 py-3 outline-none ${foco}`} />
          {q.trim().length >= 2 && (
            <div className="space-y-2" aria-live="polite">
              {r.nota && <p className="text-sm text-gray-400">{r.nota}</p>}
              {r.grupos.length > 0 && <div className="flex flex-wrap gap-2">{r.grupos.map((x) => <button key={x.slug} type="button" onClick={() => { seleciona(x.slug, "busca"); setQ(""); }} className={chip(false)}>Exercícios para {x.para} →</button>)}</div>}
              {r.exercicios.length > 0 && <div className="flex flex-wrap gap-2">{r.exercicios.map((e) => <button key={e.id} type="button" aria-pressed={exBusca === e.id} onClick={() => { setExBusca(e.id); setVista(vistaDe(e.primarios)); trackEvent("exercise_open", { exercicio: e.id, placement, origem: "busca" }); }} className={chip(exBusca === e.id)}>{e.nome}</button>)}</div>}
              {!r.grupos.length && !r.exercicios.length && <p className="text-sm text-gray-400">Nada encontrado. Tente o nome do músculo (peito, glúteo) ou do exercício (supino, remada).</p>}
            </div>
          )}

          {ex && (
            <div className="border border-[#BA9E50]/40 p-4" aria-live="polite">
              <p className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: DOURADO }}>O que esse exercício trabalha</p>
              <h3 className="text-xl font-bold text-white mt-1" style={h}>{ex.nome}</h3>
              <p className="text-sm text-gray-200 mt-2"><strong className="text-white">Principal:</strong> {ex.primarios.map(nomeMusculo).join(", ")}</p>
              {ex.secundarios?.length ? <p className="text-sm text-gray-300"><strong className="text-white">Secundários:</strong> {ex.secundarios.map(nomeMusculo).join(", ")}</p> : null}
              {/* No celular o mapa principal fica acima da busca, fora da tela: repete aqui, as duas vistas lado a lado. */}
              <div className="md:hidden grid grid-cols-2 gap-2 mt-3" inert>
                {(["frente", "costas"] as Vista[]).map((v) => (
                  <div key={v}>
                    <MapaCorpo vista={v} compacto destaque={{ principal: ex.primarios, secundario: ex.secundarios ?? [] }} titulo={`Músculos de ${ex.nome}`} />
                    <p className="text-[11px] text-gray-500 text-center">{v === "frente" ? "Frente" : "Costas"}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">No mapa: dourado = principal, dourado claro = secundário. Sem percentuais: a participação de cada músculo muda com técnica, carga e pessoa.</p>
              <div className="flex flex-wrap gap-x-4 mt-2 text-sm">
                {ex.primarios.map((m) => <button key={m} type="button" onClick={() => seleciona(GRUPO_DO_MUSCULO[m], "exercicio")} className={`min-h-[40px] ${foco}`} style={{ color: DOURADO }}>Outros para {nomeMusculo(m).toLowerCase()} →</button>)}
                <Link href={`/ferramentas/substituidor-de-exercicios?exercicio=${ex.id}`} onClick={() => trackEvent("exercise_substitute_click", { exercicio: ex.id, placement })} className={`min-h-[40px] inline-flex items-center ${ln}`}>Ver alternativas</Link>
              </div>
            </div>
          )}

          <nav aria-label="Grupos musculares">
            <p className="text-sm font-semibold text-white mb-2">Ou escolha o músculo</p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GRUPOS_PRINCIPAIS.map((s) => (
                <li key={s}>
                  <a href={`/exercicios/${s}`} onClick={(e) => { e.preventDefault(); seleciona(s, "lista"); }} aria-current={grupo === s ? "true" : undefined}
                    className={`${chip(grupo === s || GRUPO[grupo ?? "peito"]?.pai === s && !!grupo)} flex items-center justify-between w-full`}>
                    <span>{GRUPO[s].nome}</span><span className="text-xs text-gray-500">{contagem[s]}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {g && (
        <div ref={resRef} className="mt-8 border-t border-white/10 pt-6 scroll-mt-24">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-2xl font-bold text-white" style={h}>Exercícios para {g.para}</h3>
            {placement === "hub" && <Link href={`/exercicios/${g.slug}`} className={`text-sm ${ln}`}>Abrir a página de {g.nome.toLowerCase()} →</Link>}
          </div>
          {subgrupos.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 mt-3" role="group" aria-label="Refinar região">
              {g.pai && <button type="button" onClick={() => seleciona(g.pai!, "refino")} className={chip(false)}>Todo {GRUPO[g.pai].nome.toLowerCase() === "ombros" ? "o ombro" : "as costas"}</button>}
              {subgrupos.map((s) => <button key={s} type="button" aria-pressed={grupo === s} onClick={() => seleciona(s, "refino")} className={chip(grupo === s)}>{GRUPO[s].nome}</button>)}
            </div>
          )}
          {g.slug === "lombar" && <p className="text-sm text-gray-400 mt-2">A lombar (eretores da espinha) trabalha sustentando o tronco nos exercícios de dobradiça de quadril abaixo; o principal neles costuma ser posterior de coxa e glúteos.</p>}

          <div className="flex gap-2 overflow-x-auto pb-1 mt-4" role="group" aria-label="Onde você treina">
            {PRESETS.map((p) => <button key={p.id} type="button" aria-pressed={preset === p.id} onClick={() => { setPreset(p.id); trackEvent("exercise_filter", { filtro: "equipamento", valor: p.id, musculo: g.slug }); }} className={chip(preset === p.id)}>{p.nome}</button>)}
          </div>
          <details className="mt-3 border border-white/10 p-3">
            <summary className="text-sm text-gray-300 cursor-pointer min-h-[32px]">Filtrar e ordenar</summary>
            <div className="grid sm:grid-cols-3 gap-3 mt-3 text-sm">
              <label className="block">Complexidade técnica
                <select value={nivel ?? ""} onChange={(e) => { const v = e.target.value ? (Number(e.target.value) as 1 | 2 | 3) : undefined; setNivel(v); trackEvent("exercise_filter", { filtro: "nivel", valor: String(v ?? "todos") }); }} className="mt-1 w-full bg-black border border-white/25 text-white p-2 min-h-[44px]">
                  <option value="">Todas</option><option value="1">Simples (iniciante)</option><option value="2">Até moderada</option><option value="3">Todas, inclusive técnicas</option>
                </select>
              </label>
              <label className="block">Tipo
                <select value={tipo ?? ""} onChange={(e) => { setTipo((e.target.value || undefined) as typeof tipo); trackEvent("exercise_filter", { filtro: "tipo", valor: e.target.value || "todos" }); }} className="mt-1 w-full bg-black border border-white/25 text-white p-2 min-h-[44px]">
                  <option value="">Todos</option><option value="composto">Compostos</option><option value="isolado">Isoladores</option><option value="unilateral">Unilaterais</option><option value="bilateral">Bilaterais</option>
                </select>
              </label>
              <label className="block">Ordem
                <select value={ordem} onChange={(e) => setOrdem(e.target.value as typeof ordem)} className="mt-1 w-full bg-black border border-white/25 text-white p-2 min-h-[44px]">
                  <option value="comuns">Mais comuns</option><option value="simples">Mais simples primeiro</option><option value="alfabetica">Alfabética</option>
                </select>
              </label>
              {!g.porPadrao && <label className="sm:col-span-3 flex items-center gap-2 min-h-[40px]"><input type="checkbox" checked={secundarios} onChange={(e) => setSecundarios(e.target.checked)} className="accent-[#BA9E50] w-4 h-4" /> Incluir exercícios em que {g.nome.toLowerCase()} é secundário</label>}
            </div>
          </details>

          <p className="text-sm text-gray-400 mt-4" aria-live="polite"><strong className="text-white">{lista.length}</strong> exercício{lista.length === 1 ? "" : "s"} encontrado{lista.length === 1 ? "" : "s"}</p>
          {lista.length ? (
            <ul className="grid sm:grid-cols-2 gap-3 mt-3">{lista.map((e) => <Card key={e.id} e={e} placement={placement} />)}</ul>
          ) : <p className="text-sm text-gray-400 mt-2">Nenhum exercício com esse equipamento. Troque o filtro acima, ou use o <Link href="/ferramentas/substituidor-de-exercicios" className={ln}>Substituidor</Link> para adaptar um exercício.</p>}

          <div className="mt-6 border border-white/15 p-4">
            {ctaCasa ? (
              <><p className="text-white font-semibold">Treina em casa e não sabe como organizar os exercícios?</p><p className="text-gray-300 text-sm mt-1">Posso montar uma estratégia para os equipamentos que você realmente tem.</p></>
            ) : (
              <><p className="text-white font-semibold">Já sabe quais exercícios existem. Agora falta saber quais fazem sentido juntos no seu treino.</p><p className="text-gray-300 text-sm mt-1">Volume, ordem, progressão, intensidade e adaptação à sua rotina precisam funcionar juntos.</p></>
            )}
            <a href={getWhatsAppUrl("Oi Montinho! Vi o mapa muscular no site e quero um treino estruturado para mim.")} target="_blank" rel="noopener noreferrer"
              onClick={() => trackEvent("exercise_whatsapp_click", { musculo: g.slug, preset })}
              className={`mt-3 inline-flex items-center justify-center border border-white/25 text-white px-5 py-3 text-sm min-h-[48px] hover:border-white/60 ${foco}`}>Quero um treino estruturado para mim →</a>
          </div>
          <div className="mt-4">
            <Compartilhar contexto="tool" titulo={`Exercícios para ${g.para}`} caminho={`/exercicios/${g.slug}`} local="tool_result" ferramenta="mapa_muscular" gancho={`Olha essa lista de exercícios para ${g.para} do Montinho:`} aparencia="discreto" />
          </div>
        </div>
      )}
    </div>
  );
}
