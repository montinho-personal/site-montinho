"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import { trackEvent } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ATALHOS, EIXOS, FAMILIAS, type Familia, type Temperatura } from "@/lib/mata-vontade/familias";
import { INGREDIENTES, type Equip, type Objetivo } from "@/lib/mata-vontade/receitas";
import { macrosDe } from "@/lib/mata-vontade/nutricao";
import { FONTES } from "@/lib/mata-vontade/fontes";
import { ouvir } from "@/components/voz/ModoVoz";
import { alergenosDe, alvoDe, interpretar, recomendar, type Resultado } from "@/lib/mata-vontade/motor";

/**
 * Montinho Mata a Vontade. Entende a vontade antes de tentar trocá-la:
 * vontade → como você quer → tempo → o que tem aí → o que priorizar →
 * três cartões. Nada de foto na primeira tela, nada de CTA antes do
 * resultado, nada de diagnóstico. Restrições e alergias não vão para o GA4.
 */
const OURO = "#BA9E50";
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;

type Item = { titulo: string; r: Resultado; f: Familia };
type Sel = { a: string; f: Familia; chips: string[] };
const MAX_VONTADES = 3;
type Etapa = "vontade" | "vago" | "como" | "tempo" | "casa" | "objetivo" | "resultado";

const TEMPOS = [{ v: 2, r: "2 minutos" }, { v: 5, r: "5 minutos" }, { v: 10, r: "10 minutos" }, { v: 15, r: "15 minutos" }, { v: 0, r: "posso cozinhar com calma" }];
const EQUIPS: { id: Equip; r: string }[] = [
  { id: "micro-ondas", r: "Micro-ondas" }, { id: "air-fryer", r: "Air fryer" }, { id: "forno", r: "Forno" },
  { id: "fogao", r: "Fogão" }, { id: "liquidificador", r: "Liquidificador/mixer" },
];
const GRUPOS_ING: { t: string; ids: string[] }[] = [
  { t: "Frutas", ids: ["banana", "banana-congelada", "morango", "frutas-vermelhas", "maca"] },
  { t: "Lácteos", ids: ["leite", "leite-po", "iogurte", "iogurte-grego", "cottage", "cream-cheese"] },
  { t: "Proteínas", ids: ["whey", "ovo"] },
  { t: "Base", ids: ["aveia", "tapioca", "pao", "farinha-trigo"] },
  { t: "Sabor", ids: ["cacau", "choc70", "choc-leite", "canela", "cafe", "baunilha", "coco", "pasta-amendoim", "amendoim"] },
  { t: "Extras", ids: ["adocante", "acucar", "mel", "chia", "fermento", "leite-condensado", "doce-de-leite", "creme-avela", "pacoca", "gelo"] },
];
const OBJETIVOS: { id: Objetivo; r: string }[] = [
  { id: "gostoso", r: "Só algo gostoso que caiba na rotina" },
  { id: "original", r: "O mais parecido possível com o original" },
  { id: "proteina", r: "Mais proteína" },
  { id: "leve", r: "Menos calorias" },
  { id: "saciedade", r: "Mais saciedade" },
  { id: "menos-acucar", r: "Menos açúcar adicionado" },
  { id: "simples", r: "Ingredientes mais simples" },
];
const RESTRICOES = [{ id: "lactose", r: "Lactose" }, { id: "gluten", r: "Glúten" }, { id: "ovo", r: "Ovo" }, { id: "amendoim", r: "Amendoim" }, { id: "castanhas", r: "Castanhas" }, { id: "vegana", r: "Vegano" }];
const VAGO_OPCOES = [{ f: "chocolate", r: "🍫 Chocolate" }, { f: "sorvete", r: "🍨 Cremoso e gelado" }, { f: "cookie", r: "🍪 Crocante" }, { f: "mousse", r: "🍓 Fruta / leve", aroma: "frutado", chip: "morango" }];
const EQUIP_TXT: Record<Equip, string> = { "micro-ondas": "micro-ondas", "air-fryer": "air fryer", forno: "forno", fogao: "fogão", liquidificador: "liquidificador", nenhum: "sem equipamento" };
const despensa = () => Object.entries(INGREDIENTES).filter(([, i]) => i.despensa).map(([id]) => id);

function Chip({ ativo, onClick, children }: { ativo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={ativo}
      className={`min-h-[44px] px-4 py-2 border text-sm transition-colors ${ativo ? "text-black font-semibold" : "text-gray-200 border-white/20 hover:border-white/50"}`}
      style={ativo ? { background: OURO, borderColor: OURO } : undefined}>{children}</button>
  );
}

function Barra({ v, max = 5 }: { v: number; max?: number }) {
  return (
    <span className="inline-flex gap-[3px]" aria-hidden>
      {Array.from({ length: max }, (_, i) => <span key={i} className="w-3 h-2" style={{ background: i < v ? OURO : "rgba(255,255,255,.12)" }} />)}
    </span>
  );
}

export default function MataVontade() {
  const [etapa, setEtapa] = useState<Etapa>("vontade");
  const [texto, setTexto] = useState("");
  const [aviso, setAviso] = useState<string | null>(null);
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [sel, setSel] = useState<Sel[]>([]);
  const [temMic, setTemMic] = useState(false);
  const [ouvindo, setOuvindo] = useState(false);
  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
    // Só no cliente: o servidor não sabe se o navegador reconhece voz.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTemMic(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);
  /** Microfone: a pessoa fala a vontade do jeito que falaria com alguém. O que foi dito não vai para o GA4. */
  async function falarVontade() {
    if (ouvindo) return;
    setOuvindo(true); setAviso(null);
    const alts = await ouvir();
    setOuvindo(false);
    if (!alts?.length) { setAviso("Não consegui ouvir. Tenta de novo ou digita aí."); return; }
    const melhor = alts.find((a) => interpretar(a).tipo === "familia") ?? alts[0];
    // Fala natural pode ter mais de uma vontade: "brigadeiro e um sorvete".
    const partes = melhor.split(/,| e | ou | com /i).map((p) => interpretar(p)).filter((r) => r.tipo === "familia");
    const varias = [...new Map(partes.map((r) => [r.familia.id, r])).values()].slice(0, MAX_VONTADES);
    trackEvent("mata_vontade_voz", { entendeu: interpretar(melhor).tipo, vontades: varias.length });
    setTexto(melhor);
    if (varias.length > 1) {
      setFamilias(varias.map((r) => r.familia)); setChips([...new Set(varias.flatMap((r) => r.chips))]);
      setTemperatura(varias.find((r) => r.temperatura)?.temperatura); setAromas([...new Set(varias.flatMap((r) => r.aromas))]);
      trackEvent("mata_vontade_inicio", { tipo: "voz-varias", familia: varias.map((r) => r.familia.id).join(",") });
      ir("como");
    } else comecar(melhor);
  }
  const [hist, setHist] = useState<Etapa[]>([]);
  const topo = useRef<HTMLDivElement>(null);
  const montou = useRef(false);
  const familia = familias[0] ?? null;
  const [chips, setChips] = useState<string[]>([]);
  const [temperatura, setTemperatura] = useState<Temperatura | undefined>();
  const [aromas, setAromas] = useState<string[]>([]);
  const [tempo, setTempo] = useState<number | undefined>();
  const [equip, setEquip] = useState<Equip[]>(["micro-ondas", "fogao", "liquidificador"]);
  const [tenho, setTenho] = useState<string[]>(despensa);
  const [comprar, setComprar] = useState(true);
  const [restricoes, setRestricoes] = useState<string[]>([]);
  const [objetivo, setObjetivo] = useState<Objetivo>("gostoso");
  const [aberta, setAberta] = useState<string | null>(null);
  const [nota, setNota] = useState<Record<string, string>>({});

  const ir = (e: Etapa) => { setHist((h) => [...h, etapa]); setEtapa(e); trackEvent("mata_vontade_etapa", { etapa: e, familia: familias.map((f) => f.id).join(",") }); };
  const voltar = () => { const ant = hist[hist.length - 1]; if (!ant) return; setHist(hist.slice(0, -1)); setEtapa(ant); setAberta(null); };
  // A cada etapa, volta a tela para o topo da ferramenta (senão o resultado abre no meio do FAQ).
  useEffect(() => {
    if (!montou.current) { montou.current = true; return; }
    topo.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    const alvo = topo.current?.querySelector<HTMLElement>(etapa === "vontade" ? "#mv-vontade" : "[data-foco]");
    alvo?.focus({ preventScroll: true });
  }, [etapa]);
  const toggle = (lista: string[], set: (v: string[]) => void, id: string) => set(lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]);

  function comecar(t: string) {
    const r = t.trim() ? interpretar(t) : null;
    const escolhidas = sel.map((s) => s.f);
    if (r?.tipo === "familia" && !escolhidas.some((f) => f.id === r.familia.id)) escolhidas.unshift(r.familia);
    if (escolhidas.length) {
      const extra = [...sel.flatMap((s) => s.chips), ...(r?.tipo === "familia" ? r.chips : [])];
      trackEvent("mata_vontade_inicio", { tipo: escolhidas.length > 1 ? "varias" : "familia", familia: escolhidas.map((f) => f.id).join(",") });
      setFamilias(escolhidas); setChips([...new Set(extra)]); setTemperatura(r?.tipo === "familia" ? r.temperatura : undefined);
      setAromas(r?.tipo === "familia" ? r.aromas : []); setAviso(null);
      ir("como");
      return;
    }
    if (!r) return;
    trackEvent("mata_vontade_inicio", { tipo: r.tipo, familia: "" });
    if (r.tipo === "vago") { setAviso(null); ir("vago"); }
    else if (r.tipo === "salgado") setAviso("Salgados chegam em breve 🙂 Por enquanto eu só sei matar vontade de doce. Quer tentar um doce?");
    else setAviso("Ainda não conheço essa. Toque numa das vontades abaixo que eu sei resolver:");
  }
  function escolherFamilia(f: Familia, extra?: { chip?: string; aroma?: string }) {
    setFamilias([f]); setChips(extra?.chip ? [extra.chip] : []); setAromas(extra?.aroma ? [extra.aroma] : []); setTemperatura(undefined); setAviso(null);
    trackEvent("mata_vontade_inicio", { tipo: "atalho", familia: f.id });
    ir("como");
  }

  const pedidoDe = (f: Familia) => ({ familia: f, chips: chips.filter((c) => f.chips.some((x) => x.id === c)), temperatura, aromas, tempoMax: tempo || undefined, equip, tenho, podeComprar: comprar, objetivo, restricoes });
  const titObj = objetivo === "gostoso" ? "Outra opção" : OBJETIVOS.find((o) => o.id === objetivo)!.r;

  /** Uma vontade: melhor / mais rápido / objetivo. Várias: o melhor de cada uma, até três cartões. */
  function montar(): Item[] {
    if (familias.length === 1) {
      const f = familias[0]; const c = recomendar(pedidoDe(f), undefined, (r) => !!FONTES[r.id]);
      return ([["Melhor match", c.melhor], ["Mais rápido", c.rapido], [titObj, c.estrategia]] as [string, Resultado | undefined][])
        .filter(([, r]) => r).map(([titulo, r]) => ({ titulo, r: r!, f }));
    }
    const por = familias.map((f) => ({ f, c: recomendar(pedidoDe(f), undefined, (r) => !!FONTES[r.id]) })).filter((x) => x.c.melhor)
      .sort((a, b) => b.c.melhor!.match - a.c.melhor!.match);
    const usados = new Set<string>(); const itens: Item[] = [];
    for (const { f, c } of por) {
      const r = c.todos.find((x) => !usados.has(x.receita.id));
      if (r && itens.length < 3) { usados.add(r.receita.id); itens.push({ titulo: itens.length === 0 ? "Melhor match" : `Pra vontade de ${f.nome.toLowerCase()}`, r, f }); }
    }
    const resto = por.flatMap(({ f, c }) => c.todos.map((r) => ({ f, r }))).sort((a, b) => b.r.match - a.r.match);
    for (const x of resto) {
      if (itens.length >= 3) break;
      if (usados.has(x.r.receita.id)) continue;
      usados.add(x.r.receita.id); itens.push({ titulo: "Outra opção", ...x });
    }
    // Com link de receita completa primeiro (o sort é estável: o resto mantém a ordem).
    return itens.sort((a, b) => Number(!!FONTES[b.r.receita.id]) - Number(!!FONTES[a.r.receita.id]))
      .map((x, i) => (i === 0 ? { ...x, titulo: "Melhor match" } : x.titulo === "Melhor match" ? { ...x, titulo: `Pra vontade de ${x.f.nome.toLowerCase()}` } : x));
  }
  const itens = familias.length && etapa === "resultado" ? montar() : null;

  function verResultado() {
    ir("resultado");
    const c = montar();
    trackEvent("mata_vontade_resultado", { familia: familias.map((f) => f.id).join(","), objetivo, melhor: c[0]?.r.receita.id ?? "nenhum", match: c[0]?.r.match ?? 0, tem_restricao: restricoes.length > 0 });
  }
  function recomecar() {
    setHist([]); setSel([]);
    setEtapa("vontade"); setTexto(""); setFamilias([]); setChips([]); setTemperatura(undefined); setAromas([]); setTempo(undefined); setAberta(null); setAviso(null);
  }

  const passo = ({ como: 1, tempo: 2, casa: 3, objetivo: 4, resultado: 5 } as Record<string, number>)[etapa] ?? 0;
  const card = "border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-5 sm:p-7";
  const btn = "min-h-[48px] px-6 font-semibold text-black transition-transform hover:scale-[1.02]";

  return (
    <div ref={topo} className="text-left scroll-mt-28 [&_button:focus-visible]:outline [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-white [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-white">
      {etapa !== "vontade" && etapa !== "resultado" && (
        <div className="flex items-center gap-3 mb-5">
          <button type="button" onClick={voltar} className="text-sm text-gray-300 hover:text-white min-h-[44px] pr-1 shrink-0">← voltar</button>
          <div className="flex items-center gap-2 flex-1" role="progressbar" aria-label="Progresso" aria-valuemin={0} aria-valuemax={4} aria-valuenow={passo}>
            {[1, 2, 3, 4].map((i) => <span key={i} className="h-1 flex-1 transition-colors" style={{ background: i <= passo ? OURO : "rgba(255,255,255,.12)" }} />)}
          </div>
          <button type="button" onClick={recomecar} className="text-xs text-gray-400 hover:text-white min-h-[44px] shrink-0">recomeçar</button>
        </div>
      )}

      {etapa === "vontade" && (
        <div className={card}>
          <label htmlFor="mv-vontade" className="block text-white text-lg mb-3">O que você está com vontade de comer agora?</label>
          <form onSubmit={(e) => { e.preventDefault(); if (texto.trim() || sel.length) comecar(texto); }} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input id="mv-vontade" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder={ouvindo ? "Pode falar…" : "ex.: bolo de chocolate, brigadeiro, sorvete…"}
                className={`w-full min-h-[52px] bg-black border border-white/20 px-4 text-white text-lg placeholder:text-gray-400 focus:outline-none focus:border-white focus-visible:ring-2 focus-visible:ring-[#BA9E50] ${temMic ? "pr-14" : ""}`} autoComplete="off" />
              {temMic && (
                <button type="button" onClick={falarVontade} aria-label={ouvindo ? "Ouvindo" : "Falar a vontade"} aria-pressed={ouvindo}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full transition-colors"
                  style={{ background: ouvindo ? OURO : "transparent", color: ouvindo ? "#000" : OURO }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={ouvindo ? "animate-pulse" : ""}>
                    <rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /><path d="M12 17v4" /><path d="M8 21h8" />
                  </svg>
                </button>
              )}
            </div>
            <button type="submit" className={btn} style={{ background: OURO }}>{sel.length > 1 ? `Matar as ${sel.length} vontades` : "Matar a vontade"}</button>
          </form>
          {aviso && <p className="text-gray-200 mt-4" role="status">{aviso}</p>}
          <p className="text-gray-400 text-sm mt-5 mb-2">Ou toque em uma ou mais (até {MAX_VONTADES}):</p>
          <div className="flex flex-wrap gap-2">
            {(aviso ? FAMILIAS.map((f) => `${f.emoji} ${f.nome}`) : ATALHOS).map((a) => {
              const ativo = sel.some((s) => s.a === a);
              return (
                <Chip key={a} ativo={ativo} onClick={() => {
                  if (ativo) { setSel(sel.filter((s) => s.a !== a)); return; }
                  const f = FAMILIAS.find((x) => `${x.emoji} ${x.nome}` === a);
                  if (f) { if (sel.length < MAX_VONTADES) setSel([...sel, { a, f, chips: [] }]); return; }
                  const r = interpretar(a);
                  if (r.tipo === "familia") { if (sel.length < MAX_VONTADES && !sel.some((s) => s.f.id === r.familia.id)) setSel([...sel, { a, f: r.familia, chips: r.chips }]); }
                  else { setTexto(a); comecar(a); }
                }}>{a}</Chip>
              );
            })}
          </div>
          {sel.length > 0 && (
            <button type="button" className={`${btn} mt-5 w-full sm:w-auto`} style={{ background: OURO }} onClick={() => comecar(texto)}>
              {sel.length > 1 ? `Continuar com ${sel.length} vontades →` : `Continuar com ${sel[0].a} →`}
            </button>
          )}
        </div>
      )}

      {etapa === "vago" && (
        <div className={card}>
          <h2 tabIndex={-1} data-foco className="text-white text-lg mb-4 outline-none">Tudo bem não saber. Qual dessas chega mais perto?</h2>
          <div className="grid grid-cols-2 gap-3">
            {VAGO_OPCOES.map((o) => (
              <button key={o.f} type="button" className="min-h-[72px] border border-white/15 text-white text-base hover:border-white/50"
                onClick={() => escolherFamilia(FAMILIAS.find((f) => f.id === o.f)!, { chip: o.chip, aroma: o.aroma })}>{o.r}</button>
            ))}
          </div>
        </div>
      )}

      {etapa === "como" && familias.length > 0 && (
        <div className={card}>
          <h2 tabIndex={-1} data-foco className="text-white text-lg mb-4 outline-none">{familias.length > 1 ? "Como você quer cada uma?" : "Como você quer isso?"}</h2>
          {familias.map((f) => (
            <div key={f.id} className="mb-5 last:mb-0">
              <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: OURO }}>{f.emoji} {f.nome}</p>
              <div className="flex flex-wrap gap-2">
                {f.chips.map((c) => (
                  <Chip key={c.id} ativo={chips.includes(c.id) || (!!c.temperatura && temperatura === c.temperatura)}
                    onClick={() => { if (c.temperatura) setTemperatura(temperatura === c.temperatura ? undefined : c.temperatura); else toggle(chips, setChips, c.id); if (c.aroma) toggle(aromas, setAromas, c.aroma); }}>{c.rotulo}</Chip>
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-3 mt-6">
            <button type="button" className={btn} style={{ background: OURO }} onClick={() => ir("tempo")}>Continuar</button>
            <button type="button" className="min-h-[48px] px-4 text-gray-300 hover:text-white" onClick={() => { setChips([]); ir("tempo"); }}>tanto faz</button>
          </div>
        </div>
      )}

      {etapa === "tempo" && (
        <div className={card}>
          <h2 tabIndex={-1} data-foco className="text-white text-lg mb-4 outline-none">Quanto tempo você tem?</h2>
          <div className="flex flex-wrap gap-2">
            {TEMPOS.map((t) => <Chip key={t.v} ativo={tempo === t.v} onClick={() => { setTempo(t.v); ir("casa"); }}>{t.r}</Chip>)}
          </div>
        </div>
      )}

      {etapa === "casa" && (
        <div className={card}>
          <h2 tabIndex={-1} data-foco className="text-white text-lg mb-1 outline-none">O que tem aí?</h2>
          <p className="text-gray-400 text-sm mb-4">Já marquei o que quase todo mundo tem. Desmarque o que faltar. Whey: vale o que você tiver.</p>
          <p className="text-gray-300 text-sm mb-2">Na cozinha</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {EQUIPS.map((e) => <Chip key={e.id} ativo={equip.includes(e.id)} onClick={() => toggle(equip, setEquip as (v: string[]) => void, e.id)}>{e.r}</Chip>)}
          </div>
          {GRUPOS_ING.map((g) => (
            <div key={g.t} className="mb-4">
              <p className="text-gray-300 text-sm mb-2">{g.t}</p>
              <div className="flex flex-wrap gap-2">
                {g.ids.map((id) => <Chip key={id} ativo={tenho.includes(id)} onClick={() => toggle(tenho, setTenho, id)}>{INGREDIENTES[id].nome}</Chip>)}
              </div>
            </div>
          ))}
          <label className="flex items-center gap-3 text-gray-200 min-h-[44px] mt-2">
            <input type="checkbox" checked={comprar} onChange={(e) => setComprar(e.target.checked)} className="w-5 h-5 accent-[#BA9E50]" />
            Se faltar algo, posso comprar
          </label>
          <p className="text-gray-300 text-sm mt-4 mb-2">Alguma restrição? <span className="text-gray-400">(fica só no seu navegador)</span></p>
          <div className="flex flex-wrap gap-2">
            {RESTRICOES.map((r) => <Chip key={r.id} ativo={restricoes.includes(r.id)} onClick={() => toggle(restricoes, setRestricoes, r.id)}>{r.r}</Chip>)}
          </div>
          <button type="button" className={`${btn} mt-6`} style={{ background: OURO }} onClick={() => ir("objetivo")}>Continuar</button>
        </div>
      )}

      {etapa === "objetivo" && (
        <div className={card}>
          <h2 tabIndex={-1} data-foco className="text-white text-lg mb-4 outline-none">O que você quer melhorar nessa escolha?</h2>
          <div className="flex flex-col gap-2">
            {OBJETIVOS.map((o) => (
              <button key={o.id} type="button" onClick={() => setObjetivo(o.id)} aria-pressed={objetivo === o.id}
                className={`min-h-[48px] px-4 text-left border ${objetivo === o.id ? "text-black font-semibold" : "text-gray-200 border-white/15"}`}
                style={objetivo === o.id ? { background: OURO, borderColor: OURO } : undefined}>{o.r}</button>
            ))}
          </div>
          <button type="button" className={`${btn} mt-6 w-full sm:w-auto`} style={{ background: OURO }} onClick={verResultado}>Ver minha receita</button>
        </div>
      )}

      {etapa === "resultado" && familia && itens && (
        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <button type="button" onClick={voltar} className="text-sm text-gray-300 hover:text-white min-h-[44px]">← voltar</button>
            <button type="button" onClick={recomecar} className="text-sm text-gray-400 hover:text-white min-h-[44px] shrink-0">outra vontade</button>
          </div>
          <h2 tabIndex={-1} data-foco className="text-white text-xl mb-4 outline-none" style={h}>Vontade de {familias.map((f) => f.nome.toLowerCase()).join(familias.length > 2 ? ", " : " e ").replace(/, ([^,]*)$/, " e $1")}: achei isso para você</h2>
          {!itens.length ? (
            <div className={card}>
              <p className="text-white">Com o que você tem e o tempo que escolheu, ainda não tenho uma versão boa disso.</p>
              <p className="text-gray-300 mt-2">Tente marcar &ldquo;posso comprar&rdquo;, aumentar o tempo ou tirar uma restrição. E às vezes o melhor é o original, numa porção que cabe.</p>
              <button type="button" className={`${btn} mt-4`} style={{ background: OURO }} onClick={() => ir("casa")}>Ajustar</button>
            </div>
          ) : (
            <div className="grid gap-4">
              {itens.map(({ titulo, r, f }, i) => {
                const pc = pedidoDe(f).chips;
                return (
                  <Cartao key={r.receita.id} titulo={titulo} r={r} destaque={i === 0} aberta={aberta === r.receita.id}
                    alvo={alvoDe({ familia: f, chips: pc }).alvo} pediu={pc} familia={f}
                    onAbrir={() => { const novo = aberta === r.receita.id ? null : r.receita.id; setAberta(novo); if (novo) trackEvent("mata_vontade_receita_aberta", { receita: novo, posicao: i + 1, match: r.match }); }}
                    nota={nota[r.receita.id]} onNota={(v) => { setNota({ ...nota, [r.receita.id]: v }); trackEvent("mata_vontade_feedback", { receita: r.receita.id, familia: f.id, nota: v }); }} />
                );
              })}
            </div>
          )}

          <div className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-6 mt-8 relative">
            <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: OURO }} aria-hidden />
            <p className="text-white font-bold text-xl mb-2" style={h}>Gostou da troca?</p>
            <p className="text-gray-300 leading-relaxed mb-2">Não se compare com ninguém: cada pessoa tem a própria rotina, o próprio corpo e os próprios altos e baixos. Uma estratégia funciona melhor quando cabe na sua vida.</p>
            <p className="text-gray-300 leading-relaxed mb-5">É exatamente isso que eu busco nos meus treinos: construir algo que você consiga manter de verdade. Não é só sobre começar. É sobre conseguir continuar.</p>
            <div className="flex flex-wrap gap-4 items-center">
              <a href={getWhatsAppUrl("Olá, Montinho! Usei o Mata a Vontade e queria conversar sobre o meu treino.")} target="_blank" rel="noopener noreferrer"
                data-wa-origem="ferramenta" data-cta-id="mata-a-vontade:resultado" onClick={() => trackEvent("mata_vontade_cta", { destino: "whatsapp" })}
                className={`${btn} inline-flex items-center`} style={{ background: OURO }}>Falar com o Montinho</a>
              <Link href="/consultoria" onClick={() => trackEvent("mata_vontade_cta", { destino: "consultoria" })} className="text-gray-300 text-sm underline underline-offset-4 hover:text-white min-h-[44px] inline-flex items-center">Conhecer a consultoria</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Cartao({ titulo, r, destaque, aberta, onAbrir, alvo, pediu, familia, nota, onNota }: {
  titulo: string; r: Resultado; destaque: boolean; aberta: boolean; onAbrir: () => void;
  alvo: Partial<Record<string, number>>; pediu: string[]; familia: Familia; nota?: string; onNota: (v: string) => void;
}) {
  const rc = r.receita;
  const alerg = alergenosDe(rc);
  const eixosMostra = EIXOS.filter((e) => (alvo[e.id] ?? 0) > 0 || (rc.perfil[e.id] ?? 0) >= 3).slice(0, 5);
  const temTudo = rc.ingredientes.filter((i) => !i.opcional).length - r.faltam.length;
  const mac = macrosDe(rc);
  const ref = useRef<HTMLElement>(null);
  // Ao abrir, outro cartão acima pode fechar e empurrar a página: ancora no topo deste cartão.
  useEffect(() => {
    if (!aberta || !ref.current) return;
    const t = ref.current.getBoundingClientRect().top;
    if (t < 80 || t > window.innerHeight * 0.6) ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [aberta]);
  return (
    <article ref={ref} className="scroll-mt-24 [overflow-anchor:none] border p-5 sm:p-6 transition-colors" style={{ borderColor: destaque ? OURO : "rgba(255,255,255,.12)", background: destaque ? "rgba(186,158,80,.06)" : "transparent" }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: OURO }}>{titulo}</p>
          <h3 className="text-white text-xl font-bold mt-1" style={h}>{rc.nome}</h3>
          <p className="text-gray-400 text-sm mt-1">
            {rc.tempoMin} min{rc.esperaMin ? ` + ${rc.esperaMin >= 60 ? `${rc.esperaMin / 60} h` : `${rc.esperaMin} min`} de espera` : ""} · {EQUIP_TXT[rc.equip]} · {r.faltam.length ? `faltam ${r.faltam.length}` : `você tem ${temTudo} de ${temTudo}`}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-3xl font-black tabular-nums" style={{ color: OURO, ...h }}>{r.match}%</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-400">match</p>
        </div>
      </div>
      <p className="inline-block mt-3 text-[11px] uppercase tracking-wider px-2 py-1 border border-amber-300/40 text-amber-200">Receita em teste</p>
      <p className="text-gray-300 text-sm mt-3 leading-relaxed"><strong className="text-white">Por que essa:</strong> {r.porque}</p>
      {mac && (
        <div className="mt-4 grid grid-cols-4 gap-2 text-center" aria-label="Estimativa por porção">
          {([["kcal", mac.kcal, ""], ["proteína", mac.p, "g"], ["carbo", mac.c, "g"], ["gordura", mac.g, "g"]] as [string, number, string][]).map(([rot, v, u]) => (
            <div key={rot} className="border border-white/10 py-2">
              <p className="text-white font-semibold text-base leading-none">{v}{u}</p>
              <p className="text-[11px] text-gray-400 mt-1">{rot}</p>
            </div>
          ))}
          <p className="col-span-4 text-[11px] text-gray-400 text-left"><span className="text-gray-200">Porção: {mac.porcao}</span>{mac.porcoes > 1 ? ` · a receita rende ${mac.porcoes}` : ""} · estimativa</p>
        </div>
      )}
      <button type="button" onClick={onAbrir} className="mt-4 min-h-[44px] text-sm font-semibold underline underline-offset-4" style={{ color: OURO }} aria-expanded={aberta}>
        {aberta ? "Fechar receita" : "Ver receita"}
      </button>
      {aberta && (
        <div className="mt-4 border-t border-white/10 pt-4 space-y-5">
          <div>
            <p className="text-white text-sm font-semibold mb-2">Você pediu × essa receita</p>
            <ul className="space-y-1.5">
              {eixosMostra.map((e) => (
                <li key={e.id} className="grid grid-cols-[110px_1fr_1fr] items-center gap-2 text-xs text-gray-300">
                  <span>{e.rotulo}</span><Barra v={alvo[e.id] ?? 0} /><Barra v={rc.perfil[e.id] ?? 0} />
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-gray-400 mt-1">1ª barra: o que você pediu{pediu.length ? "" : ` (padrão de ${familia.nome.toLowerCase()})`} · 2ª: a receita</p>
          </div>
          <div>
            <p className="text-white text-sm font-semibold mb-2">Ingredientes</p>
            <ul className="space-y-1 text-sm">
              {rc.ingredientes.map((i) => (
                <li key={i.id} className={r.faltam.includes(i.id) ? "text-amber-200" : "text-gray-300"}>
                  {r.faltam.includes(i.id) ? "○" : "●"} {INGREDIENTES[i.id].nome}: {i.qtd}{i.opcional ? " (opcional)" : ""}
                  {i.troca && <span className="text-gray-400"> · troca: {i.troca}</span>}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white text-sm font-semibold mb-2">Como fazer</p>
            <ol className="list-decimal pl-5 space-y-1.5 text-sm text-gray-300">{rc.passos.map((p) => <li key={p}>{p}</li>)}</ol>
            {rc.dica && <p className="text-sm mt-3" style={{ color: OURO }}>Dica: <span className="text-gray-300">{rc.dica}</span></p>}
            {FONTES[rc.id] && (
              <a href={FONTES[rc.id].url} target="_blank" rel="noopener" className="mt-3 flex items-center gap-3 border border-white/15 p-3 hover:border-white/40 min-h-[56px]"
                onClick={() => trackEvent("mata_vontade_fonte", { receita: rc.id, portal: FONTES[rc.id].portal })}>
                <span aria-hidden className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-white text-lg" style={{ background: "#e62117" }}>▶</span>
                <span className="text-sm leading-snug">
                  <span className="block text-white font-semibold">Veja alguém fazendo uma versão parecida</span>
                  <span className="block text-gray-400">{FONTES[rc.id].portal} · YouTube</span>
                </span>
              </a>
            )}
          </div>
          {alerg.length > 0 && <p className="text-xs text-gray-400">Contém: {alerg.join(", ").replace("gluten", "glúten")}. Não garantimos ausência de traços.</p>}
          <p className="text-xs text-gray-400">Receita em teste: proporções de partida, ainda em ajuste. Calorias e macros são estimativas por porção, sem os opcionais, calculadas com a Tabela TACO e rótulos; como referência de whey, uso a tabela de um concentrado com cerca de 80% de proteína (Growth). Variam com a marca e a quantidade.</p>
          <div>
            <p className="text-white text-sm font-semibold mb-2">Fez? Matou a vontade?</p>
            <div className="flex flex-wrap gap-2">
              {[["totalmente", "😍 Totalmente"], ["quase", "🙂 Quase"], ["mais-ou-menos", "😐 Mais ou menos"], ["nao", "😕 Não"]].map(([v, t]) => (
                <Chip key={v} ativo={nota === v} onClick={() => onNota(v)}>{t}</Chip>
              ))}
            </div>
            {nota && <p role="status" className="text-gray-400 text-xs mt-2">Valeu! Isso ajuda a ajustar a receita para todo mundo.</p>}
          </div>
          <Compartilhar contexto="tool-result" titulo="Montinho Mata a Vontade" caminho="/ferramentas/mata-a-vontade" local="tool_result" ferramenta="mata-a-vontade"
            resultado={[`Eu estava com vontade de ${familia.nome.toLowerCase()}`, `Achei: ${rc.nome}`, `Match: ${r.match}%`]} gancho="Montinho Mata a Vontade:" aparencia="discreto" />
        </div>
      )}
    </article>
  );
}
