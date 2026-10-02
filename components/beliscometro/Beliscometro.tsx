"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ALIMENTOS, CATEGORIAS, POR_ID, buscar, type Alimento } from "@/lib/beliscometro/alimentos";
import {
  CONTA, DICAS_SEM_CORTAR, FAZENDO, FREQUENCIAS, MOMENTO, MOMENTOS, PERFIS, arred, calcular, simular,
  type FrequenciaId, type Item, type Mudanca, type Respostas,
} from "@/lib/beliscometro/motor";
import { compartilharImagem, desenharCard, type Formato } from "@/lib/beliscometro/card";
import Balanca from "./Balanca";

/**
 * Beliscômetro — "Descubra quanto você come sem perceber."
 *
 * Uma pergunta por tela, cards em vez de campos, resultado antes de qualquer
 * venda. Respostas ficam no navegador; o GA4 recebe só ids (momento,
 * alimento, etapa) — nunca quantidade nem calorias da pessoa.
 */
const OURO = "#BA9E50";
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const fmt = (n: number) => arred(n).toLocaleString("pt-BR");

type Etapa = "momentos" | "alimentos" | "quantidade" | "frequencia" | "fazendo" | "conta" | "montando" | "resultado";
const PASSOS: Etapa[] = ["momentos", "alimentos", "quantidade", "frequencia", "fazendo", "conta"];

function Opcao({ ativo, onClick, children, grande }: { ativo: boolean; onClick: () => void; children: React.ReactNode; grande?: boolean }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={ativo}
      className={`text-left border transition-all active:scale-[0.98] ${grande ? "min-h-[56px] px-4 py-3 text-base" : "min-h-[48px] px-4 py-2.5 text-sm"} ${ativo ? "text-black font-semibold" : "text-gray-100 border-white/15 hover:border-white/40 bg-white/[0.02]"}`}
      style={ativo ? { background: OURO, borderColor: OURO } : undefined}>{children}</button>
  );
}

/** Número que sobe suavemente até o valor (respeita prefers-reduced-motion). */
function Contador({ valor, className }: { valor: number; className?: string }) {
  const [v, setV] = useState(valor);
  const de = useRef(valor);
  useEffect(() => {
    const reduz = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const ini = de.current, fim = valor, t0 = performance.now(), dur = reduz ? 0 : 700;
    let raf = 0;
    const passo = (t: number) => {
      const k = dur ? Math.min(1, (t - t0) / dur) : 1;
      setV(ini + (fim - ini) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(passo); else de.current = fim;
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [valor]);
  return <span className={className}>{fmt(v)}</span>;
}

export default function Beliscometro({ preset }: { preset?: { momentos?: string[] } }) {
  const [etapa, setEtapa] = useState<Etapa | "inicio">("inicio");
  const [hist, setHist] = useState<Etapa[]>([]);
  const [momentos, setMomentos] = useState<string[]>(preset?.momentos ?? []);
  const [itens, setItens] = useState<Item[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [freqGeral, setFreqGeral] = useState<FrequenciaId | null>(null);
  const [freqIndividual, setFreqIndividual] = useState(false);
  const [fazendo, setFazendo] = useState<Respostas["fazendo"]>();
  const [conta, setConta] = useState<Respostas["conta"]>();
  const [busca, setBusca] = useState("");
  const [cat, setCat] = useState(CATEGORIAS[0].id);
  const [mudanca, setMudanca] = useState<Mudanca | null>(null);
  const [semCortar, setSemCortar] = useState(false);
  const [capitulo2, setCapitulo2] = useState(false);
  const [pulso, setPulso] = useState<string | null>(null);
  const topo = useRef<HTMLDivElement>(null);
  const montou = useRef(false);

  const respostas: Respostas = { momentos, itens, fazendo, conta };
  const res = useMemo(() => calcular(respostas), [momentos, itens, fazendo, conta]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!montou.current) { montou.current = true; return; }
    topo.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    topo.current?.querySelector<HTMLElement>("[data-foco]")?.focus({ preventScroll: true });
  }, [etapa, qIdx]);

  const ir = (e: Etapa) => {
    if (etapa !== "inicio") setHist((x) => [...x, etapa as Etapa]);
    setEtapa(e);
    if (PASSOS.includes(e)) trackEvent("beliscometro_step_complete", { etapa: PASSOS.indexOf(e) });
  };
  const voltar = () => {
    if (etapa === "quantidade" && qIdx > 0) { setQIdx(qIdx - 1); return; }
    const ant = hist[hist.length - 1];
    if (!ant) { setEtapa("inicio"); return; }
    setHist(hist.slice(0, -1)); setEtapa(ant);
    if (ant === "quantidade") setQIdx(Math.max(0, itens.length - 1));
  };
  function comecar() { trackEvent("beliscometro_start", {}); setEtapa("momentos"); }
  function recomecar() {
    trackEvent("beliscometro_restart", {});
    setEtapa("momentos"); setHist([]); setMomentos([]); setItens([]); setQIdx(0); setFreqGeral(null); setFreqIndividual(false);
    setFazendo(undefined); setConta(undefined); setMudanca(null); setSemCortar(false); setCapitulo2(false);
  }

  const toggleMomento = (id: string) => setMomentos((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));
  function toggleAlimento(a: Alimento) {
    setItens((xs) => {
      if (xs.some((x) => x.alimentoId === a.id)) return xs.filter((x) => x.alimentoId !== a.id);
      trackEvent("beliscometro_food_selected", { alimento: a.id, categoria: a.categoria });
      setPulso(a.id); setTimeout(() => setPulso(null), 600);
      return [...xs, { alimentoId: a.id, medidaId: a.padrao, frequencia: freqGeral ?? "1" }];
    });
  }
  const setItem = (id: string, p: Partial<Item>) => setItens((xs) => xs.map((x) => (x.alimentoId === id ? { ...x, ...p } : x)));

  function verResultado() {
    ir("montando");
    setTimeout(() => {
      setEtapa("resultado");
      const r = calcular({ momentos, itens, fazendo, conta });
      trackEvent("beliscometro_result", { itens: itens.length, momentos: momentos.length, perfil: r.perfil, top: r.podio[0]?.alimento.id ?? "" });
    }, 1500);
  }

  const passo = PASSOS.indexOf(etapa as Etapa);
  const card = "border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-5 sm:p-7";
  const btn = "min-h-[52px] px-6 font-semibold text-black transition-transform active:scale-[0.98] disabled:opacity-40";
  const titulo = (t: string, sub?: string) => (
    <div className="mb-5">
      <h2 tabIndex={-1} data-foco className="text-white text-xl sm:text-2xl font-bold outline-none" style={h}>{t}</h2>
      {sub && <p className="text-gray-400 text-sm mt-1">{sub}</p>}
    </div>
  );

  const qItem = itens[qIdx];
  const qAlim = qItem ? POR_ID[qItem.alimentoId] : null;
  const achados = busca.trim() ? buscar(busca) : ALIMENTOS.filter((a) => a.categoria === cat);

  return (
    <div ref={topo} className="scroll-mt-24 text-left [&_button:focus-visible]:outline [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-white">
      {passo >= 0 && (
        <div className="flex items-center gap-3 mb-4">
          <button type="button" onClick={voltar} className="text-sm text-gray-300 hover:text-white min-h-[44px] shrink-0">← voltar</button>
          <div className="flex-1 h-1 bg-white/10" role="progressbar" aria-valuemin={1} aria-valuemax={PASSOS.length} aria-valuenow={passo + 1} aria-label="Progresso">
            <div className="h-1 transition-all duration-300" style={{ width: `${((passo + 1) / PASSOS.length) * 100}%`, background: OURO }} />
          </div>
          <span className="text-xs text-gray-400 shrink-0 tabular-nums">{passo + 1} de {PASSOS.length}</span>
        </div>
      )}

      {etapa === "inicio" && (
        <div className={card}>
          <p className="text-gray-200 text-lg leading-relaxed" style={h}>
            Um chocolate aqui.<br />Uma batata dali.<br />Um punhado de amendoim enquanto trabalha.
          </p>
          <p className="text-gray-400 mt-3">Separadamente, quase nada parece importante. Mas quanto isso representa no seu dia?</p>
          <div className="mt-5 border-l-2 pl-4 py-1" style={{ borderColor: OURO }}>
            <p className="text-white text-sm font-semibold">Pense num dia comum seu — ontem, por exemplo.</p>
            <p className="text-gray-400 text-sm mt-1">Marque só o que você costuma beliscar de verdade, não tudo que já beliscou na vida. O que é de vez em quando entra como “algumas vezes por semana” ou “só no fim de semana”, e a conta vira média por dia.</p>
          </div>
          <button type="button" onClick={comecar} className={`${btn} mt-6 w-full sm:w-auto tracking-wide`} style={{ background: OURO }}>DESCOBRIR MEUS BELISCOS</button>
          <p className="text-gray-500 text-xs mt-3">Leva menos de 2 minutos · sem cadastro · suas respostas ficam no seu celular</p>
        </div>
      )}

      {etapa === "momentos" && (
        <div className={card}>
          {titulo("Em quais momentos você mais costuma beliscar?", "Num dia comum. Marque quantos quiser.")}
          <div className="grid grid-cols-2 gap-2">
            {MOMENTOS.map((m) => (
              <Opcao key={m.id} ativo={momentos.includes(m.id)} onClick={() => toggleMomento(m.id)}>
                <span aria-hidden className="mr-1.5">{m.emoji}</span>{m.rotulo}
              </Opcao>
            ))}
          </div>
          <button type="button" disabled={!momentos.length} className={`${btn} mt-6 w-full`} style={{ background: OURO }}
            onClick={() => { trackEvent("beliscometro_context_selected", { momentos: momentos.join(",") }); ir("alimentos"); }}>Continuar</button>
        </div>
      )}

      {etapa === "alimentos" && (
        <div className={card}>
          {titulo("O que costuma aparecer nesses momentos?", "Só o que acontece com frequência. Quer testar um belisco específico? Marque só ele.")}
          <label className="sr-only" htmlFor="bm-busca">Procure um alimento</label>
          <input id="bm-busca" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="🔎 Procure um alimento…" autoComplete="off"
            className="w-full min-h-[48px] bg-black border border-white/20 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-white mb-3" />
          {!busca.trim() && (
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 mb-2" role="tablist" aria-label="Categorias">
              {CATEGORIAS.map((c) => (
                <button key={c.id} role="tab" aria-selected={cat === c.id} type="button" onClick={() => setCat(c.id)}
                  className={`shrink-0 min-h-[40px] px-3 text-sm rounded-full border ${cat === c.id ? "text-black font-semibold" : "text-gray-300 border-white/15"}`}
                  style={cat === c.id ? { background: OURO, borderColor: OURO } : undefined}>
                  <span aria-hidden>{c.emoji}</span> {c.id === "disfarcados" ? "Não parecem beliscos" : c.nome}
                </button>
              ))}
            </div>
          )}
          {cat === "disfarcados" && !busca.trim() && <p className="text-sm mb-3" style={{ color: OURO }}>Os que a gente quase nunca conta.</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {achados.map((a) => {
              const ativo = itens.some((x) => x.alimentoId === a.id);
              return (
                <button key={a.id} type="button" aria-pressed={ativo} onClick={() => toggleAlimento(a)}
                  className={`relative min-h-[92px] p-3 border text-left transition-all active:scale-[0.97] ${ativo ? "border-transparent" : "border-white/10 hover:border-white/30"}`}
                  style={{ background: ativo ? `${a.cor}55` : `${a.cor}1f`, boxShadow: ativo ? `inset 0 0 0 2px ${OURO}` : undefined }}>
                  <span aria-hidden className={`block text-3xl transition-transform ${pulso === a.id ? "scale-125" : ""}`}>{a.emoji}</span>
                  <span className="block text-white text-sm mt-1 leading-tight">{a.nome}</span>
                  {ativo && <span className="absolute top-2 right-2 w-5 h-5 rounded-full text-black text-xs font-bold flex items-center justify-center" style={{ background: OURO }} aria-hidden>✓</span>}
                </button>
              );
            })}
            {!achados.length && <p className="text-gray-400 text-sm col-span-full">Não achei esse. Tente um parecido nas categorias.</p>}
          </div>
          <div className="sticky bottom-3 mt-5">
            <button type="button" disabled={!itens.length} className={`${btn} w-full shadow-lg`} style={{ background: OURO }} onClick={() => { setQIdx(0); ir("quantidade"); }}>
              {itens.length ? `Continuar com ${itens.length} ${itens.length === 1 ? "belisco" : "beliscos"}` : "Escolha pelo menos um"}
            </button>
          </div>
        </div>
      )}

      {etapa === "quantidade" && qItem && qAlim && (
        <div className={card}>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">Belisco {qIdx + 1} de {itens.length}</p>
          <div className="flex items-center gap-4 mb-4 p-4 -mx-1" style={{ background: `${qAlim.cor}33`, borderLeft: `4px solid ${OURO}` }}>
            <span aria-hidden className="text-5xl leading-none">{qAlim.emoji}</span>
            <h2 tabIndex={-1} data-foco className="text-white text-2xl sm:text-3xl font-bold leading-tight outline-none" style={h}>{qAlim.nome}</h2>
          </div>
          <p className="text-white text-lg">Quanto, normalmente?</p>
          <p className="text-gray-400 text-sm mt-1 mb-5">Do jeito que você lembraria. É uma estimativa.</p>
          <div className="grid gap-2">
            {qAlim.medidas.map((m) => (
              <Opcao grande key={m.id} ativo={qItem.medidaId === m.id} onClick={() => setItem(qAlim.id, { medidaId: m.id })}>
                <span className="flex justify-between gap-3"><span>{m.rotulo}</span>
                  <span className={qItem.medidaId === m.id ? "text-black/70" : "text-gray-500"}>+{fmt((m.gramas * qAlim.kcal100) / 100)} kcal</span></span>
              </Opcao>
            ))}
            <div className={`border px-4 py-3 ${qItem.medidaId === "livre" ? "border-[#BA9E50]" : "border-white/15"}`}>
              <label className="flex items-center gap-3 text-sm text-gray-200">
                Sei informar:
                <input type="number" inputMode="numeric" min={1} max={3000} value={qItem.medidaId === "livre" ? qItem.gramasLivres ?? "" : ""}
                  onChange={(e) => setItem(qAlim.id, { medidaId: "livre", gramasLivres: Math.min(3000, Math.max(0, Number(e.target.value) || 0)) })}
                  className="w-24 min-h-[40px] bg-black border border-white/20 px-2 text-white" aria-label={`Quantidade de ${qAlim.nome} em ${qAlim.categoria === "bebidas" ? "ml" : "gramas"}`} />
                {qAlim.categoria === "bebidas" ? "ml" : "g"}
              </label>
            </div>
          </div>
          <button type="button" className={`${btn} mt-6 w-full`} style={{ background: OURO }}
            onClick={() => (qIdx < itens.length - 1 ? setQIdx(qIdx + 1) : ir("frequencia"))}>{qIdx < itens.length - 1 ? "Próximo" : "Continuar"}</button>
        </div>
      )}

      {etapa === "frequencia" && (
        <div className={card}>
          {titulo("Quantas vezes isso normalmente acontece?", "Na média. Se cada um é diferente, ajuste item por item.")}
          <div className="grid gap-2">
            {FREQUENCIAS.map((f) => (
              <Opcao grande key={f.id} ativo={freqGeral === f.id && !freqIndividual}
                onClick={() => { setFreqGeral(f.id); setFreqIndividual(false); setItens((xs) => xs.map((x) => ({ ...x, frequencia: f.id }))); }}>{f.rotulo}</Opcao>
            ))}
          </div>
          <button type="button" onClick={() => { setFreqIndividual(!freqIndividual); if (!freqGeral) setFreqGeral("1"); }} className="mt-4 min-h-[44px] text-sm underline underline-offset-4" style={{ color: OURO }}>
            {freqIndividual ? "usar a mesma para todos" : "cada um é diferente"}
          </button>
          {freqIndividual && (
            <div className="mt-3 space-y-3">
              {itens.map((it) => {
                const a = POR_ID[it.alimentoId];
                return (
                  <label key={it.alimentoId} className="flex items-center justify-between gap-3 text-sm text-gray-200">
                    <span><span aria-hidden>{a.emoji}</span> {a.nome}</span>
                    <select value={it.frequencia} onChange={(e) => setItem(a.id, { frequencia: e.target.value as FrequenciaId })}
                      className="min-h-[44px] bg-black border border-white/20 text-white px-2 max-w-[60%]">
                      {FREQUENCIAS.map((f) => <option key={f.id} value={f.id}>{f.rotulo}</option>)}
                    </select>
                  </label>
                );
              })}
            </div>
          )}
          <button type="button" disabled={!freqGeral} className={`${btn} mt-6 w-full`} style={{ background: OURO }} onClick={() => ir("fazendo")}>Continuar</button>
        </div>
      )}

      {etapa === "fazendo" && (
        <div className={card}>
          {titulo("Quando você belisca, normalmente está fazendo outra coisa?")}
          <div className="grid gap-2">
            {FAZENDO.map((f) => <Opcao grande key={f.id} ativo={fazendo === f.id} onClick={() => { setFazendo(f.id); setTimeout(() => ir("conta"), 180); }}>{f.rotulo}</Opcao>)}
          </div>
        </div>
      )}

      {etapa === "conta" && (
        <div className={card}>
          {titulo("Você normalmente considera esses alimentos quando pensa no que comeu durante o dia?")}
          <div className="grid gap-2">
            {CONTA.map((c) => <Opcao grande key={c.id} ativo={conta === c.id} onClick={() => { setConta(c.id); setTimeout(verResultado, 180); }}>{c.rotulo}</Opcao>)}
          </div>
        </div>
      )}

      {etapa === "montando" && (
        <div className={`${card} text-center py-14`} role="status">
          <p className="text-white text-lg" style={h}>Montando o seu prato que nunca existiu…</p>
          <div className="mt-6 flex justify-center gap-2 text-4xl" aria-hidden>
            {res.linhas.slice(0, 8).map((l, i) => (
              <span key={l.alimento.id} className="inline-block animate-[bmCai_.5s_ease-out_both]" style={{ animationDelay: `${i * 120}ms` }}>{l.alimento.emoji}</span>
            ))}
          </div>
          <style>{`@keyframes bmCai{from{opacity:0;transform:translateY(-24px) scale(.6)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.animate-\\[bmCai_\\.5s_ease-out_both\\]{animation:none}}`}</style>
        </div>
      )}

      {etapa === "resultado" && <Resultado respostas={respostas} res={res} mudanca={mudanca} setMudanca={setMudanca}
        semCortar={semCortar} setSemCortar={setSemCortar} recomecar={recomecar} capitulo2={capitulo2} abrirCap2={() => setCapitulo2(true)} btn={btn} titulo={titulo} />}
    </div>
  );
}

function Prato({ linhas }: { linhas: ReturnType<typeof calcular>["linhas"] }) {
  const n = linhas.length;
  return (
    <div className="relative mx-auto w-[min(86vw,340px)] aspect-square" role="img"
      aria-label={`Prato com ${linhas.map((l) => l.alimento.nome).join(", ")}`}>
      <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 50% 45%, #fafafa 0 55%, #e7e5e4 56% 62%, #d6d3d1 63% 66%, transparent 67%)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} />
      <div className="absolute inset-[8%] rounded-full" style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06)" }} />
      {linhas.map((l, i) => {
        const ang = (i / Math.max(1, n)) * Math.PI * 2 - Math.PI / 2;
        const raio = n === 1 ? 0 : n <= 4 ? 22 : 26;
        const x = 50 + raio * Math.cos(ang), y = 48 + raio * Math.sin(ang);
        const tam = Math.max(34, Math.min(64, 26 + Math.sqrt(l.kcalDia) * 1.6));
        return (
          <span key={l.alimento.id} aria-hidden className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center animate-[bmEntra_.5s_ease-out_both]"
            style={{ left: `${x}%`, top: `${y}%`, width: tam * 1.25, height: tam * 1.25, background: `${l.alimento.cor}33`, fontSize: tam, animationDelay: `${300 + i * 140}ms` }}>
            {l.alimento.emoji}
          </span>
        );
      })}
      <style>{`@keyframes bmEntra{from{opacity:0;transform:translate(-50%,-140%) scale(.5)}to{opacity:1;transform:translate(-50%,-50%)}}@media (prefers-reduced-motion:reduce){[class*="bmEntra"]{animation:none}}`}</style>
    </div>
  );
}

function Resultado({ respostas, res, mudanca, setMudanca, semCortar, setSemCortar, recomecar, capitulo2, abrirCap2, btn, titulo }: {
  respostas: Respostas; res: ReturnType<typeof calcular>; mudanca: Mudanca | null; setMudanca: (m: Mudanca | null) => void;
  semCortar: boolean; setSemCortar: (v: boolean) => void; recomecar: () => void; capitulo2: boolean; abrirCap2: () => void;
  btn: string; titulo: (t: string, s?: string) => React.ReactNode;
}) {
  const perfil = PERFIS[res.perfil];
  const sim = mudanca ? simular(respostas, mudanca) : null;
  const linhaDoTempo = useMemo(() => {
    const ms = respostas.momentos.map((m) => MOMENTO[m]).filter((m) => m && m.id !== "outro").sort((a, b) => a.hora.localeCompare(b.hora));
    const base = ms.length ? ms : [MOMENTO["sem-horario"]];
    return res.linhas.map((l, i) => ({ l, m: base[i % base.length] })).sort((a, b) => a.m.hora.localeCompare(b.m.hora));
  }, [respostas.momentos, res.linhas]);
  const [gerando, setGerando] = useState(false);

  async function compartilhar(formato: Formato) {
    setGerando(true);
    try {
      const top = res.podio[0];
      const blob = await desenharCard(formato, "Meu Beliscômetro", [
        { tipo: "emojis", texto: res.linhas.slice(0, 6).map((l) => l.alimento.emoji).join(" ") },
        { tipo: "rotulo", texto: "Meu maior belisco" }, { tipo: "valor", texto: top?.alimento.nome ?? "—", emoji: top?.alimento.emoji },
        ...(res.momentoCampeao ? [{ tipo: "rotulo" as const, texto: "Momento crítico" }, { tipo: "valor" as const, texto: res.momentoCampeao.rotulo, emoji: res.momentoCampeao.emoji }] : []),
        { tipo: "rotulo", texto: "Meu perfil" }, { tipo: "valor", texto: perfil.nome, emoji: perfil.emoji },
        { tipo: "rotulo", texto: "Beliscos estimados" }, { tipo: "grande", texto: `≈ ${fmt(res.kcalDia)} kcal/dia` },
        { tipo: "frase", texto: "“Você esquece. O corpo soma.”" },
      ], "montinhopersonal.com.br/ferramentas/beliscometro");
      const via = await compartilharImagem(blob, `beliscometro-${formato}.png`, "Fiz o Beliscômetro do Montinho: https://www.montinhopersonal.com.br/ferramentas/beliscometro?utm_source=share&utm_medium=card&utm_campaign=beliscometro");
      trackEvent("beliscometro_share", { formato, via });
    } finally { setGerando(false); }
  }

  const sec = "mt-10";
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-[0.2em]" style={{ color: OURO }}>Seu Beliscômetro</span>
        <button type="button" onClick={recomecar} className="text-sm text-gray-400 hover:text-white min-h-[44px]">refazer</button>
      </div>

      {/* Clímax */}
      <section className="text-center">
        <h2 tabIndex={-1} data-foco className="text-white text-3xl sm:text-4xl font-bold leading-tight outline-none" style={h}>O PRATO QUE VOCÊ NUNCA MONTOU.</h2>
        <p className="text-gray-300 mt-2 mb-8">Mas que pode estar aparecendo aos poucos durante o seu dia — num dia comum, pelo que você marcou.</p>
        <Prato linhas={res.linhas} />
        <p className="text-white text-xl mt-8 leading-snug" style={h}>Esses alimentos nunca estiveram juntos no seu prato.<br /><span style={{ color: OURO }}>Mas estiveram juntos no seu dia.</span></p>
      </section>

      <section className={`${sec} grid grid-cols-2 gap-3`} aria-label="Total estimado">
        <div className="border border-white/15 p-4 text-center" style={{ background: "rgba(186,158,80,.08)" }}>
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">Por dia</p>
          <p className="text-4xl font-bold mt-1" style={{ ...h, color: OURO }}>≈ <Contador valor={res.kcalDia} /></p>
          <p className="text-gray-400 text-sm">kcal</p>
        </div>
        <div className="border border-white/15 p-4 text-center">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">Por semana</p>
          <p className="text-4xl font-bold text-white mt-1" style={h}>≈ <Contador valor={res.kcalSemana} /></p>
          <p className="text-gray-400 text-sm">kcal</p>
        </div>
        <p className="col-span-2 text-gray-300 text-sm leading-relaxed">Isso não significa que você precise eliminar esses alimentos. O objetivo é enxergar o que antes passava despercebido.</p>
      </section>

      <section className={sec}>
        {titulo("Seu dia estimado", "Um dia possível, montado com os momentos que você marcou.")}
        <ol className="relative border-l border-white/15 ml-2">
          {linhaDoTempo.map(({ l, m }) => (
            <li key={l.alimento.id} className="pl-5 pb-4 relative">
              <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full" style={{ background: OURO }} aria-hidden />
              <p className="text-xs text-gray-500 tabular-nums">{m.hora} · {m.rotulo.toLowerCase()}</p>
              <p className="text-white flex justify-between gap-3"><span><span aria-hidden>{l.alimento.emoji}</span> {l.alimento.nome} <span className="text-gray-500 text-sm">({l.rotuloMedida}{l.porDia !== 1 ? `, ${FREQUENCIAS.find((f) => f.id === l.item.frequencia)!.rotulo.toLowerCase()}` : ""})</span></span>
                <span className="text-gray-300 tabular-nums shrink-0">≈ {fmt(l.kcalDia)} kcal</span></p>
            </li>
          ))}
        </ol>
        <p className="text-gray-300 border-t border-white/10 pt-3 flex justify-between"><strong className="text-white">Beliscos estimados</strong><strong className="tabular-nums" style={{ color: OURO }}>≈ {fmt(res.kcalDia)} kcal/dia</strong></p>
        <p className="text-white mt-4" style={h}>Separadamente, talvez nenhum deles parecesse importante. Juntos, contam outra história.</p>
      </section>

      {res.podio.length > 1 && (
        <section className={sec}>
          {titulo("O que mais pesa no seu Beliscômetro")}
          <div className="grid gap-2">
            {res.podio.map((l, i) => (
              <div key={l.alimento.id} className="flex items-center gap-3 border border-white/10 p-3" style={{ background: `${l.alimento.cor}22` }}>
                <span className="text-2xl" aria-label={`${i + 1}º lugar`}>{["🥇", "🥈", "🥉"][i]}</span>
                <span className="text-2xl" aria-hidden>{l.alimento.emoji}</span>
                <span className="text-white flex-1">{l.alimento.nome}</span>
                <span className="text-gray-200 tabular-nums">≈ {fmt(l.kcalDia)} kcal/dia</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={`${sec} border p-5`} style={{ borderColor: OURO, background: "rgba(186,158,80,.06)" }}>
        <p className="text-xs uppercase tracking-[0.2em] mb-1" style={{ color: OURO }}>Seu perfil de belisco</p>
        <p className="text-white text-2xl font-bold" style={h}><span aria-hidden>{perfil.emoji}</span> {perfil.nome}</p>
        <p className="text-gray-300 mt-2 leading-relaxed">{perfil.texto}</p>
        <div className="mt-4 space-y-2 text-gray-200 leading-relaxed">{res.insight.map((t) => <p key={t}>{t}</p>)}</div>
      </section>

      <section className={sec}>
        {titulo("Seu Belisco Wrapped")}
        <div className="grid grid-cols-2 gap-2">
          {[
            ["Seu belisco nº 1", res.podio[0] ? `${res.podio[0].alimento.emoji} ${res.podio[0].alimento.nome}` : "—"],
            ["Horário campeão", res.momentoCampeao ? `${res.momentoCampeao.emoji} ${res.momentoCampeao.rotulo}` : "—"],
            ["O que você menos percebia", res.menosPercebido ? `${res.menosPercebido.alimento.emoji} ${res.menosPercebido.alimento.nome}` : "—"],
            ["Episódios por dia", `≈ ${Math.max(1, Math.round(res.episodiosDia))}`],
          ].map(([k, v]) => (
            <div key={k} className="border border-white/10 p-3 bg-white/[0.03]">
              <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400">{k}</p>
              <p className="text-white mt-1 leading-tight">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={sec}>
        {titulo("E se você mudasse apenas UMA coisa?", "Escolha um item e veja a diferença. É simulação, não ordem.")}
        <div className="space-y-3">
          {res.podio.map((l) => (
            <div key={l.alimento.id}>
              <p className="text-gray-200 text-sm mb-1.5"><span aria-hidden>{l.alimento.emoji}</span> {l.alimento.nome}</p>
              <div className="flex flex-wrap gap-2">
                {([["porcao-menor", "Porção menor"], ["menos-vezes", "Menos vezes"]] as const).map(([tipo, r]) => {
                  const ativo = mudanca?.alimentoId === l.alimento.id && mudanca.tipo === tipo;
                  return <Opcao key={tipo} ativo={ativo} onClick={() => { const m = ativo ? null : { alimentoId: l.alimento.id, tipo }; setMudanca(m); if (m) trackEvent("beliscometro_simulation", { alimento: m.alimentoId, tipo }); }}>{r}</Opcao>;
                })}
              </div>
            </div>
          ))}
        </div>
        {sim && (
          <div className="mt-4 border border-white/15 p-4 grid grid-cols-3 gap-2 text-center" aria-live="polite">
            <div><p className="text-xs text-gray-400">Antes</p><p className="text-white text-xl font-bold tabular-nums">{fmt(sim.antes)}</p></div>
            <div><p className="text-xs text-gray-400">Depois</p><p className="text-xl font-bold tabular-nums" style={{ color: OURO }}><Contador valor={sim.depois} /></p></div>
            <div><p className="text-xs text-gray-400">Diferença</p><p className="text-white text-xl font-bold tabular-nums">−{fmt(sim.antes - sim.depois)}</p></div>
            <p className="col-span-3 text-gray-400 text-xs">kcal/dia estimadas · {sim.descricao} · mantendo todo o resto igual</p>
          </div>
        )}
        <button type="button" onClick={() => setSemCortar(!semCortar)} aria-expanded={semCortar} className="mt-5 w-full min-h-[52px] border font-semibold tracking-wide" style={{ borderColor: OURO, color: OURO }}>
          QUERO REDUZIR SEM CORTAR NADA
        </button>
        {semCortar && (
          <div className="grid sm:grid-cols-2 gap-2 mt-3">
            {DICAS_SEM_CORTAR.map((d) => (
              <div key={d.titulo} className="border border-white/10 p-4 bg-white/[0.03]">
                <p className="text-white font-semibold"><span aria-hidden>{d.emoji}</span> {d.titulo}</p>
                <p className="text-gray-300 text-sm mt-1">{d.texto}</p>
              </div>
            ))}
            <p className="sm:col-span-2 text-gray-500 text-xs">Ideias gerais de comportamento, não um plano alimentar individual.</p>
          </div>
        )}
      </section>

      <section className={sec}>
        <div className="border border-white/15 p-5 bg-gradient-to-br from-[#1a160c] to-black">
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: OURO }}>Meu Beliscômetro</p>
          <p className="text-3xl mt-2" aria-hidden>{res.linhas.slice(0, 6).map((l) => l.alimento.emoji).join(" ")}</p>
          <p className="text-gray-300 mt-3 text-sm">Meu maior belisco: <strong className="text-white">{res.podio[0]?.alimento.nome}</strong></p>
          {res.momentoCampeao && <p className="text-gray-300 text-sm">Momento crítico: <strong className="text-white">{res.momentoCampeao.emoji} {res.momentoCampeao.rotulo}</strong></p>}
          <p className="text-3xl font-bold mt-2" style={{ ...h, color: OURO }}>≈ {fmt(res.kcalDia)} kcal/dia</p>
          <p className="text-white italic mt-2" style={h}>“Você esquece. O corpo soma.”</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <button type="button" disabled={gerando} onClick={() => compartilhar("story")} className={`${btn} flex-1`} style={{ background: OURO }}>COMPARTILHAR RESULTADO</button>
          <button type="button" disabled={gerando} onClick={() => compartilhar("quadrado")} className="min-h-[52px] px-4 border border-white/20 text-white text-sm">versão quadrada</button>
        </div>
      </section>

      {/* Capítulo 2 */}
      <section className={`${sec} border-t border-white/10 pt-10`}>
        {!capitulo2 ? (
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.25em]" style={{ color: OURO }}>Capítulo 2</p>
            <p className="text-white text-2xl font-bold mt-2" style={h}>O que a balança não conta</p>
            <p className="text-gray-300 mt-2">Subiu 1 ou 2 kg depois do fim de semana? Será que tudo isso virou gordura?</p>
            <button type="button" onClick={abrirCap2} className={`${btn} mt-5`} style={{ background: OURO }}>ABRIR O CAPÍTULO 2</button>
          </div>
        ) : <Balanca kcalBeliscos={res.kcalDia} />}
      </section>

      <section className={`${sec} border border-white/15 p-6 relative`} style={{ background: "linear-gradient(180deg, rgba(255,255,255,.05), transparent)" }}>
        <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: OURO }} aria-hidden />
        <p className="text-white text-xl font-bold" style={h}>Seu resultado não precisa virar uma lista de proibições.</p>
        <p className="text-gray-300 mt-2 leading-relaxed">Na maioria das vezes, o que muda o processo é aprender a enxergar a rotina e criar uma estratégia que você consiga manter. Não é só sobre começar. É sobre conseguir continuar.</p>
        <a href={getWhatsAppUrl("Oi, Montinho! Fiz o Beliscômetro e queria entender melhor como ajustar minha rotina.")} target="_blank" rel="noopener noreferrer"
          data-wa-origem="ferramenta" data-cta-id="beliscometro:resultado" onClick={() => trackEvent("beliscometro_whatsapp_click", { origem: "resultado" })}
          className={`${btn} mt-5 inline-flex items-center justify-center w-full sm:w-auto tracking-wide`} style={{ background: OURO }}>QUERO CONVERSAR COM O MONTINHO</a>
      </section>

      <section className={`${sec} border border-white/10 p-5`}>
        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: OURO }}>Veja também</p>
        <p className="text-white text-lg font-bold mt-1" style={h}>Montinho Mata a Vontade</p>
        <p className="text-gray-300 text-sm mt-1">Está com vontade de alguma coisa específica? Descubra alternativas para matar a vontade sem transformar sua rotina em uma dieta impossível.</p>
        <Link href="/ferramentas/mata-a-vontade" className="inline-flex items-center min-h-[44px] mt-2 underline underline-offset-4" style={{ color: OURO }}>Abrir o Mata a Vontade →</Link>
      </section>

      <p className="text-gray-500 text-xs mt-8 leading-relaxed">Os valores são estimativas e podem variar conforme marca, receita, tamanho da porção e preparação. Fontes: Tabela TACO (NEPA-UNICAMP), USDA FoodData Central e medidas da POF/IBGE. O Beliscômetro é uma ferramenta educativa e não substitui orientação individual de nutricionista ou profissional de saúde.</p>
    </div>
  );
}

