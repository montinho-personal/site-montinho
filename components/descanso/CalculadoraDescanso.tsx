"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import Compartilhar from "@/components/share/Compartilhar";
import {
  DEMANDAS, ESFORCOS, ESFORCO_PARA_RIR, EXERCICIOS, OBJETIVOS, RIR_TEXTO,
  calcula, calculaRapido, encontraExercicio, explica, faixaDeReps, fmtFaixa, fmtTempo, minutosDeDescanso,
  type Demanda, type Esforco, type EsforcoRapido, type Experiencia, type Objetivo, type Resultado, type Rir, type TipoRapido,
} from "@/lib/descanso";

/**
 * Calculadora de Descanso Entre Séries — o motor está em lib/descanso.ts.
 *
 * Fluxo: objetivo → exercício → reps → esforço → FAIXA → cronômetro →
 * autorregulação. O cronômetro conta pelo relógio real (Date.now() contra o
 * horário de término), então não atrasa com a tela bloqueada ou a aba em
 * segundo plano: ao voltar, ele mostra o tempo certo.
 *
 * Nada sai do navegador. Os eventos levam objetivo, categoria e faixa de
 * RIR — nunca carga, nome do exercício digitado ou dado pessoal. O último
 * exercício e o último descanso ficam só no aparelho (localStorage).
 */

const CAMINHO = "/ferramentas/calculadora-descanso-entre-series";
const DOURADO = "#BA9E50";
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const chip = (on: boolean) => `border px-3 py-2.5 text-sm min-h-[48px] text-left leading-tight transition-colors ${on ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300 hover:border-white/50"} ${foco}`;
const campo = `w-full min-w-0 bg-black border border-white/25 focus:border-[#BA9E50] text-white text-lg font-bold px-4 py-3 outline-none ${foco}`;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const CHAVE_LOCAL = "montinho_descanso_v1";

type Modo = "completo" | "rapido";
type Metodo = "tradicional" | "superset" | "drop";
const REPS_OPCOES = [{ id: "1-3", n: 2 }, { id: "4-6", n: 5 }, { id: "7-10", n: 8 }, { id: "11-15", n: 12 }, { id: "16+", n: 18 }] as const;

function Grupo({ legenda, children, dica }: { legenda: string; children: React.ReactNode; dica?: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-sm font-semibold text-white mb-2">{legenda}</legend>
      {dica && <div className="text-xs text-gray-500 -mt-1 mb-2">{dica}</div>}
      {children}
    </fieldset>
  );
}

/* ───────────── Cronômetro ───────────── */

function Cronometro({ inicial, onEvento }: { inicial: number; onEvento: (nome: "start" | "complete" | "adjust", extra?: Record<string, string | number>) => void }) {
  const [duracao, setDuracao] = useState(inicial);
  const [fimEm, setFimEm] = useState<number | null>(null);
  const [restante, setRestante] = useState(inicial);
  const [acabou, setAcabou] = useState(false);
  const [som, setSom] = useState(false);
  const avisou = useRef(false);

  useEffect(() => { if (!fimEm) { setDuracao(inicial); setRestante(inicial); setAcabou(false); } }, [inicial, fimEm]);

  const tocar = useCallback(() => {
    try { navigator.vibrate?.([200, 100, 200]); } catch { /* sem vibração */ }
    if (!som) return;
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.frequency.value = 880; g.gain.value = 0.15; o.connect(g); g.connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + 0.4);
    } catch { /* sem áudio */ }
  }, [som]);

  useEffect(() => {
    if (!fimEm) return;
    const tick = () => {
      const r = Math.max(0, Math.ceil((fimEm - Date.now()) / 1000));
      setRestante(r);
      if (r === 0 && !avisou.current) { avisou.current = true; setAcabou(true); setFimEm(null); tocar(); onEvento("complete"); }
    };
    tick();
    const id = window.setInterval(tick, 250);
    document.addEventListener("visibilitychange", tick);
    return () => { window.clearInterval(id); document.removeEventListener("visibilitychange", tick); };
  }, [fimEm, tocar, onEvento]);

  const iniciar = (s = duracao) => { avisou.current = false; setAcabou(false); setDuracao(s); setRestante(s); setFimEm(Date.now() + s * 1000); onEvento("start", { segundos: s }); };
  const ajustar = (d: number) => {
    onEvento("adjust", { delta: d });
    if (fimEm) { const novo = Math.max(Date.now() + 1000, fimEm + d * 1000); setFimEm(novo); setDuracao((x) => Math.max(15, x + d)); }
    else { const s = Math.max(15, Math.min(600, duracao + d)); setDuracao(s); setRestante(s); }
  };
  const encerrar = () => { setFimEm(null); setRestante(duracao); setAcabou(false); };

  const rodando = fimEm !== null;
  const prog = duracao > 0 ? 1 - restante / duracao : 0;
  const R = 52, C = 2 * Math.PI * R;

  return (
    <div className="border border-[#BA9E50]/40 bg-black p-5" aria-label="Cronômetro de descanso">
      <div className="flex flex-col min-[400px]:flex-row items-center gap-4 text-center min-[400px]:text-left">
        <div className="relative w-36 h-36 shrink-0" aria-hidden="true">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
            <circle cx="60" cy="60" r={R} fill="none" stroke={DOURADO} strokeWidth="8" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - prog)} className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-300" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white tabular-nums" style={h}>{fmtTempo(restante)}</span>
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold" role="status" aria-live="polite">
            {acabou ? "Pronto para a próxima série?" : rodando ? "Descansando…" : `Descanso de ${fmtTempo(duracao)}`}
          </p>
          <p className="text-xs text-gray-500 mt-1" aria-live="off">{rodando ? "Pode bloquear a tela: o tempo continua certo ao voltar." : "Ajuste antes ou durante o descanso."}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        <button type="button" onClick={() => ajustar(-30)} className={`border border-white/25 text-white min-h-[52px] text-base font-semibold ${foco}`} aria-label="Menos 30 segundos">−30s</button>
        {rodando ? (
          <button type="button" onClick={encerrar} className={`border border-white/25 text-white min-h-[52px] text-base font-semibold ${foco}`}>Encerrar</button>
        ) : (
          <button type="button" onClick={() => iniciar()} className={`bg-[#BA9E50] text-black min-h-[52px] text-base font-bold ${foco}`}>{acabou ? "↻ Recomeçar" : `▶ ${fmtTempo(duracao)}`}</button>
        )}
        <button type="button" onClick={() => ajustar(30)} className={`border border-white/25 text-white min-h-[52px] text-base font-semibold ${foco}`} aria-label="Mais 30 segundos">+30s</button>
      </div>
      <label className="mt-3 flex items-center gap-2 text-xs text-gray-400 cursor-pointer min-h-[32px]">
        <input type="checkbox" checked={som} onChange={(e) => setSom(e.target.checked)} className="accent-[#BA9E50] w-4 h-4" />
        Tocar um bipe no fim (a vibração já vem ligada, quando o celular permite)
      </label>
    </div>
  );
}

/* ───────────── Calculadora ───────────── */

export default function CalculadoraDescanso({ placement = "ferramenta" }: { placement?: string }) {
  const listId = useId();
  const [modo, setModo] = useState<Modo>("completo");
  const [objetivo, setObjetivo] = useState<Objetivo>("hipertrofia");
  const [busca, setBusca] = useState("");
  const [demanda, setDemanda] = useState<Demanda | null>(null);
  const [reps, setReps] = useState<string>("");
  const [rir, setRir] = useState<Rir | "nao_sei" | null>(null);
  const [esforco, setEsforco] = useState<Esforco | null>(null);
  const [exp, setExp] = useState<Experiencia | null>(null);
  const [metodo, setMetodo] = useState<Metodo>("tradicional");
  const [tipoR, setTipoR] = useState<TipoRapido | null>(null);
  const [esfR, setEsfR] = useState<EsforcoRapido | null>(null);
  const [series, setSeries] = useState("20");
  const resRef = useRef<HTMLDivElement>(null);

  const exercicio = encontraExercicio(busca);
  const demandaFinal: Demanda | null = demanda ?? exercicio?.demanda ?? null;

  useEffect(() => {
    trackOncePerSession("rest_calculator_view", { placement });
    try { const s = JSON.parse(localStorage.getItem(CHAVE_LOCAL) ?? "{}"); if (typeof s.ex === "string") setBusca(s.ex); } catch { /* sem storage */ }
  }, [placement]);

  const nReps = parseInt(reps, 10);
  const rirFinal: Rir | null = rir === "nao_sei" ? (esforco ? ESFORCO_PARA_RIR[esforco] : null) : rir;

  let resultado: Resultado | null = null;
  if (metodo !== "drop") {
    if (modo === "rapido" && tipoR && esfR) resultado = calculaRapido(tipoR, esfR);
    if (modo === "completo" && demandaFinal && nReps > 0 && nReps <= 50 && rirFinal !== null)
      resultado = calcula({ objetivo, demanda: demandaFinal, reps: faixaDeReps(nReps), rir: rirFinal, experiencia: exp ?? undefined });
  }
  const chave = resultado ? `${modo}-${resultado.min}-${resultado.max}` : "";
  const ultimo = useRef("");
  useEffect(() => {
    if (!resultado || ultimo.current === chave) return;
    ultimo.current = chave;
    trackEvent("rest_calculator_complete", { modo, objetivo: modo === "rapido" ? "hipertrofia" : objetivo, categoria: modo === "rapido" ? tipoR ?? "" : demandaFinal ?? "", faixa: fmtFaixa(resultado), placement });
    try { localStorage.setItem(CHAVE_LOCAL, JSON.stringify({ ex: exercicio?.nome ?? "", descanso: resultado.inicio })); } catch { /* sem storage */ }
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const evTimer = useCallback((nome: "start" | "complete" | "adjust", extra?: Record<string, string | number>) => {
    const dados = { placement, ...(extra ?? {}) };
    if (nome === "start") trackEvent("rest_timer_start", dados);
    else if (nome === "complete") trackEvent("rest_timer_complete", dados);
    else trackEvent("rest_timer_adjust", dados);
  }, [placement]);

  const texto = resultado && modo === "completo" && demandaFinal && rirFinal !== null
    ? explica({ objetivo, demanda: demandaFinal, reps: faixaDeReps(nReps), rir: rirFinal }, exercicio?.nome)
    : resultado ? "Esse intervalo tende a permitir recuperação suficiente para manter boa parte do desempenho na próxima série, sem prolongar o treino à toa." : "";

  const nSeries = Math.max(1, Math.min(60, parseInt(series, 10) || 0));

  return (
    <div className="border border-white/15 bg-[#0d0d0d] p-5 sm:p-6" data-testid="calculadora-descanso">
      <div role="tablist" aria-label="Modo" className="grid grid-cols-2 gap-2 mb-5">
        {(["completo", "rapido"] as Modo[]).map((m) => (
          <button key={m} role="tab" aria-selected={modo === m} type="button" onClick={() => setModo(m)} className={chip(modo === m) + " text-center"}>
            {m === "completo" ? "Modo completo" : "Modo rápido"}
          </button>
        ))}
      </div>

      {modo === "rapido" ? (
        <div className="space-y-5">
          <Grupo legenda="Que tipo de exercício?">
            <div className="grid grid-cols-3 gap-2">
              {([["isolador", "Isolador"], ["composto", "Composto"], ["composto_pesado", "Composto pesado"]] as const).map(([id, nome]) => (
                <button key={id} type="button" aria-pressed={tipoR === id} onClick={() => setTipoR(id)} className={chip(tipoR === id)}>{nome}</button>
              ))}
            </div>
          </Grupo>
          <Grupo legenda="Como foi a série?">
            <div className="grid grid-cols-3 gap-2">
              {([["moderado", "Moderada"], ["dificil", "Difícil"], ["muito_dificil", "Muito difícil"]] as const).map(([id, nome]) => (
                <button key={id} type="button" aria-pressed={esfR === id} onClick={() => setEsfR(id)} className={chip(esfR === id)}>{nome}</button>
              ))}
            </div>
          </Grupo>
          <p className="text-xs text-gray-500">O modo rápido assume hipertrofia, com séries de 7 a 10 repetições.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <Grupo legenda="1. Qual seu objetivo principal?">
            <div className="grid grid-cols-2 gap-2">
              {OBJETIVOS.map((o) => (
                <button key={o.id} type="button" aria-pressed={objetivo === o.id} onClick={() => { setObjetivo(o.id); trackEvent("rest_goal_select", { objetivo: o.id }); }} className={chip(objetivo === o.id)}>{o.nome}</button>
              ))}
            </div>
          </Grupo>

          <Grupo legenda="2. Qual exercício?">
            <label className="block">
              <span className="sr-only">Buscar exercício</span>
              <input
                list={listId} className={campo} value={busca} placeholder="Ex.: supino reto, agachamento…" autoComplete="off"
                onChange={(e) => { setBusca(e.target.value); setDemanda(null); const ex = encontraExercicio(e.target.value); if (ex && ex.nome === e.target.value) trackEvent("rest_exercise_select", { categoria: ex.demanda }); }}
              />
              <datalist id={listId}>{EXERCICIOS.map((x) => <option key={x.nome} value={x.nome} />)}</datalist>
            </label>
            <p className="text-xs text-gray-400 mt-2" aria-live="polite">
              {exercicio && !demanda ? <>Classificado como <strong className="text-white">{DEMANDAS.find((d) => d.id === exercicio.demanda)?.nome.toLowerCase()}</strong>. Não é o seu caso? Escolha abaixo.</> : busca.trim().length >= 3 && !exercicio ? "Não encontrei esse exercício. Escolha o tipo abaixo." : "Ou escolha o tipo direto:"}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {DEMANDAS.map((d) => (
                <button key={d.id} type="button" aria-pressed={demandaFinal === d.id} onClick={() => { setDemanda(d.id); trackEvent("rest_exercise_select", { categoria: d.id }); }} className={chip(demandaFinal === d.id)}>
                  {d.nome}<span className="block text-[11px] text-gray-500 mt-0.5">{d.texto}</span>
                </button>
              ))}
            </div>
          </Grupo>

          <Grupo legenda="3. Quantas repetições você fez?">
            <div className="grid grid-cols-5 gap-2">
              {REPS_OPCOES.map((r) => (
                <button key={r.id} type="button" aria-pressed={!!nReps && faixaDeReps(nReps) === r.id} onClick={() => setReps(String(r.n))} className={chip(!!nReps && faixaDeReps(nReps) === r.id) + " text-center px-1"}>{r.id}</button>
              ))}
            </div>
          </Grupo>

          <Grupo legenda="4. Quantas repetições ainda conseguiria fazer?" dica={<>Isso é o <strong className="text-gray-300">RIR — Repetições em Reserva</strong>. Não precisa saber o nome: pense em quantas sobraram.</>}>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {([0, 1, 2, 3, 4] as Rir[]).map((n) => (
                <button key={n} type="button" aria-pressed={rir === n} onClick={() => { setRir(n); trackEvent("rest_rir_select", { rir: n }); }} className={chip(rir === n) + " text-center"}>{n === 4 ? "4+" : n}</button>
              ))}
              <button type="button" aria-pressed={rir === "nao_sei"} onClick={() => { setRir("nao_sei"); trackEvent("rest_rir_select", { rir: "nao_sei" }); }} className={chip(rir === "nao_sei") + " text-center"}>Não sei</button>
            </div>
            {typeof rir === "number" && <p className="text-sm text-gray-300 mt-2" aria-live="polite">{RIR_TEXTO[rir]}</p>}
            {rir === "nao_sei" && (
              <div className="mt-3">
                <p className="text-sm text-white mb-2">Como terminou a série?</p>
                <div className="grid grid-cols-2 gap-2">
                  {ESFORCOS.map((e) => <button key={e.id} type="button" aria-pressed={esforco === e.id} onClick={() => setEsforco(e.id)} className={chip(esforco === e.id)}>{e.nome}</button>)}
                </div>
              </div>
            )}
          </Grupo>

          <details className="border border-white/10 p-3">
            <summary className="text-sm text-gray-300 cursor-pointer min-h-[32px]">Mais contexto (opcional)</summary>
            <div className="space-y-4 mt-3">
              <Grupo legenda="Experiência">
                <div className="grid grid-cols-3 gap-2">
                  {([["iniciante", "Iniciante"], ["intermediario", "Intermediário"], ["avancado", "Avançado"]] as const).map(([id, nome]) => (
                    <button key={id} type="button" aria-pressed={exp === id} onClick={() => setExp(exp === id ? null : id)} className={chip(exp === id) + " text-center"}>{nome}</button>
                  ))}
                </div>
              </Grupo>
              <Grupo legenda="Como é a série?">
                <div className="grid grid-cols-3 gap-2">
                  {([["tradicional", "Tradicional"], ["superset", "Bi-set / superset"], ["drop", "Drop-set / rest-pause"]] as const).map(([id, nome]) => (
                    <button key={id} type="button" aria-pressed={metodo === id} onClick={() => setMetodo(id)} className={chip(metodo === id) + " text-center px-1"}>{nome}</button>
                  ))}
                </div>
              </Grupo>
            </div>
          </details>
        </div>
      )}

      {metodo === "drop" && (
        <p className="mt-6 border-l-2 border-[#BA9E50] pl-4 text-sm text-gray-300" role="status">Técnicas como drop-set e rest-pause usam intervalos próprios dentro do método. Esta calculadora foi feita para séries tradicionais: use-a para o descanso <em>depois</em> do bloco inteiro.</p>
      )}

      {resultado && (
        <div ref={resRef} aria-live="polite" className="mt-7 border-t border-white/10 pt-6 space-y-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: DOURADO }}>Seu descanso</p>
            <p className="text-5xl sm:text-6xl font-bold text-white my-1 tabular-nums" style={h}>{fmtFaixa(resultado)}</p>
            <p className="text-gray-300">Comece por <strong className="text-white">{fmtTempo(resultado.inicio)}</strong> e ajuste pela sua performance.</p>
            <p className="text-gray-300 text-sm leading-relaxed mt-3">{texto}</p>
            {metodo === "superset" && <p className="text-gray-400 text-sm mt-2">Em bi-set, o descanso pode ficar entre os exercícios ou só depois do par. Use a faixa como referência para o descanso depois do par.</p>}
          </div>

          <Cronometro inicial={resultado.inicio} onEvento={evTimer} />

          <div className="border border-white/15 p-4">
            <p className="text-white font-semibold mb-2">Como saber se descansou o suficiente?</p>
            <p className="text-gray-300 text-sm mb-3">Na próxima série, veja se mantém carga, repetições e técnica perto do planejado.</p>
            <ul className="text-sm space-y-2">
              <li><span className="text-white font-semibold">↑ Caiu muito?</span> <span className="text-gray-300">Perdeu várias repetições ou a técnica piorou: aumente o descanso (+30s).</span></li>
              <li><span className="text-white font-semibold">↓ Já estava inteiro há tempo?</span> <span className="text-gray-300">Pode testar um pouco menos (−30s).</span></li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">A frequência cardíaca volta antes do músculo e do sistema nervoso: não espere o coração baixar a um número para começar. O critério é o desempenho.</p>
          </div>

          {modo === "completo" && objetivo === "forca" && (
            <Link href="/ferramentas/calculadora-1rm" onClick={() => trackEvent("rest_1rm_click", { placement })} className={`block border border-white/15 p-4 hover:border-white/40 ${foco}`}>
              <span className="text-white font-semibold">Quer estimar a intensidade da sua carga?</span>
              <span className="block text-sm mt-1" style={{ color: DOURADO }}>Calcular meu 1RM →</span>
            </Link>
          )}

          <details className="border border-white/15 p-4" onToggle={(e) => { if ((e.target as HTMLDetailsElement).open) trackEvent("rest_cta_click", { cta: "duracao", placement }); }}>
            <summary className="text-white font-semibold cursor-pointer min-h-[32px]">Quanto os descansos ocupam do seu treino?</summary>
            <label className="block mt-3 max-w-[200px]">
              <span className="block text-sm text-gray-300 mb-1">Séries no treino</span>
              <input inputMode="numeric" className={campo} value={series} onChange={(e) => setSeries(e.target.value.replace(/\D/g, ""))} />
            </label>
            <p className="text-gray-300 text-sm mt-3">Com {nSeries} séries e descanso médio de {fmtTempo(resultado.inicio)}, cerca de <strong className="text-white">{Math.round(minutosDeDescanso(nSeries, resultado.inicio / 60))} minutos</strong> do treino são intervalo.</p>
            <table className="w-full text-sm mt-3 border border-white/10">
              <caption className="sr-only">Tempo de intervalo por descanso médio</caption>
              <thead><tr className="text-left text-gray-400"><th className="p-2 font-normal">Descanso médio</th><th className="p-2 font-normal">Intervalos no treino</th></tr></thead>
              <tbody>{[1, 2, 3].map((m) => <tr key={m} className="border-t border-white/10"><td className="p-2">{m} min</td><td className="p-2 text-white">≈ {minutosDeDescanso(nSeries, m)} min</td></tr>)}</tbody>
            </table>
            <p className="text-xs text-gray-500 mt-2">Aproximação: não conta o tempo das séries nem a troca de aparelho. Encurtar o descanso para &quot;queimar mais&quot; costuma piorar as séries; se o treino ficou longo, reduzir séries pouco produtivas tende a funcionar melhor.</p>
          </details>

          <div onClickCapture={() => trackEvent("rest_share", { placement })}>
            <Compartilhar
              contexto="tool-result"
              titulo="Calculadora de Descanso Entre Séries"
              caminho={CAMINHO}
              local="tool_result"
              ferramenta="calculadora_descanso"
              resultado={[`Meu descanso estimado${exercicio && modo === "completo" ? ` para ${exercicio.nome.toLowerCase()}` : ""}: ≈ ${fmtFaixa(resultado)}`]}
              gancho="Meu cálculo:"
              aparencia="solido"
            />
          </div>

          <div className="border border-white/15 p-4">
            <p className="text-white font-semibold">O descanso é só uma variável.</p>
            <p className="text-gray-300 text-sm mt-1">Exercícios, volume, intensidade, progressão e recuperação precisam funcionar juntos.</p>
            <Link href="/ferramentas/calculadora-volume-treino" onClick={() => trackEvent("rest_volume_click", { placement })} className={`inline-block mt-3 text-sm min-h-[44px] ${ln}`} style={{ textDecorationColor: DOURADO }}>Analisar meu volume semanal →</Link>
          </div>

          <div className="border border-white/15 p-4">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: DOURADO }}>{FECHAMENTO_COMPARACAO.titulo}</p>
            {FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white text-sm leading-relaxed mb-3">{t}</p>)}
            <a
              href={getWhatsAppUrl("Oi Montinho! Quero entender como organizar melhor volume, intensidade, descanso e progressão no meu treino.")}
              target="_blank" rel="noopener noreferrer"
              onClick={() => trackEvent("rest_cta_click", { cta: "whatsapp", placement })}
              className={`inline-flex items-center justify-center border border-white/25 text-white px-5 py-3 text-sm min-h-[48px] hover:border-white/60 ${foco}`}
            >
              Quero organizar meu treino de verdade
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
