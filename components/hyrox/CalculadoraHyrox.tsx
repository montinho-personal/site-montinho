"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  ESTACOES,
  KM_CORRIDA,
  MET_ESTACOES,
  NOTA_ESTIMATIVA,
  NOTA_PROVA,
  NOTA_SEGURANCA,
  PACE_MAX_SEG,
  PACE_MIN_SEG,
  PESO_MAX,
  PESO_MIN,
  PROVAS,
  TEMPO_MAX,
  TEMPO_MIN,
  arredondaKcal,
  calcula,
  formataPace,
  paceValido,
  parseNumero,
  parsePace,
  parseTempoProva,
  pesoValido,
  tempoValido,
} from "@/lib/hyrox";

/**
 * A Calculadora de Calorias no Hyrox.
 *
 * O TEMPO FINAL É A CONTA
 *
 * A prova é sempre a mesma: 8 × (1 km de corrida + 1 estação). A pessoa
 * informa o tempo final e o pace da corrida; a calculadora separa os
 * 8 km do tempo de estação e mostra quanto veio de cada parte.
 *
 * Não pergunta frequência: prova é um dia, não um hábito semanal.
 *
 * PRIVACIDADE
 *
 * Peso é dado do corpo. Nada sai do navegador e os eventos registram só o
 * uso, nunca o peso nem o tempo.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-2 decoration-1 hover:text-white transition-colors";
const campo =
  "bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors";
const chip = (ativo: boolean) =>
  `px-4 py-2.5 border text-sm font-semibold transition-colors min-h-[44px] ${
    ativo ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white" : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
  }`;
const metF = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
/** Kcal arredondada e com ponto de milhar. */
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");
const pct = (n: number) => `${Math.round(n * 100)}%`;
/** 85 → "1h25". */
const hm = (min: number) => {
  const t = Math.round(min);
  return t >= 60 ? `${Math.floor(t / 60)}h${String(t % 60).padStart(2, "0")}` : `${t} min`;
};

export default function CalculadoraHyrox({ placement }: { placement: string }) {
  const [pesoTexto, setPesoTexto] = useState("");
  const [tempoTexto, setTempoTexto] = useState("");
  const [paceTexto, setPaceTexto] = useState("");
  const [mostrarMetodo, setMostrarMetodo] = useState(false);
  const [mostrarEstacoes, setMostrarEstacoes] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const tempo = parseTempoProva(tempoTexto);
  const tempoOk = tempoValido(tempo);
  const pace = parsePace(paceTexto);
  const paceOk = paceValido(pace);

  const camposOk = pesoOk && tempoOk && paceOk;
  const resultado = camposOk ? calcula(peso, tempo, pace) : null;
  const naoCabe = camposOk && resultado === null;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          trackOncePerSession("hyrox_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  const temResultado = resultado !== null;
  useEffect(() => {
    if (temResultado && !jaUsou.current) {
      jaUsou.current = true;
      trackEvent("hyrox_calculator_use", { placement });
    }
  }, [temResultado, placement]);

  const escolheProva = (id: string) => {
    const p = PROVAS.find((x) => x.id === id)!;
    setTempoTexto(hm(p.minutos).replace(" min", ""));
    setPaceTexto(formataPace(p.paceSeg));
    trackEvent("hyrox_preset", { placement, preset: id });
  };
  const provaAtiva = PROVAS.find((p) => tempo === p.minutos && pace === p.paceSeg)?.id;

  const resumoWhats = resultado ? `Hyrox em ${hm(resultado.minutosTotais)} ≈ ${kc(resultado.kcal)} kcal` : null;
  const linhasShare = resultado ? [`Hyrox em ${hm(resultado.minutosTotais)}`, `pace ${formataPace(pace!)}/km`, `≈ ${kc(resultado.kcal)} kcal`] : [];
  const idc = (s: string) => `${s}-hyrox-${placement}`;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-hyrox"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Quanto a sua prova de Hyrox gastou?
      </h2>

      <div className="mb-6">
        <label htmlFor={idc("peso")} className="block text-gray-300 text-sm font-medium mb-2">Quanto você pesa?</label>
        <div className="flex items-center gap-3">
          <input id={idc("peso")} type="text" inputMode="decimal" autoComplete="off" placeholder="70" value={pesoTexto}
            onChange={(e) => setPesoTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("peso-ajuda")} />
          <span className="text-gray-300 text-lg">kg</span>
        </div>
        <p id={idc("peso-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
          {pesoTexto.trim() !== "" && !pesoOk ? `Confira o peso informado (entre ${PESO_MIN} e ${PESO_MAX} kg).` : ""}
        </p>
      </div>

      <div className="mb-3">
        <span className="block text-gray-300 text-sm font-medium mb-2">Qual foi a sua prova?</span>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {PROVAS.map((p) => (
            <button key={p.id} type="button" aria-pressed={provaAtiva === p.id} className={chip(provaAtiva === p.id)} onClick={() => escolheProva(p.id)}>
              {p.nome}: {hm(p.minutos)}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-2 max-w-md">
        <div>
          <label htmlFor={idc("tempo")} className="block text-gray-300 text-sm font-medium mb-2">Tempo final</label>
          <input id={idc("tempo")} type="text" inputMode="text" autoComplete="off" placeholder="1h30" value={tempoTexto}
            onChange={(e) => setTempoTexto(e.target.value)} className={`w-full ${campo}`} />
        </div>
        <div>
          <label htmlFor={idc("pace")} className="block text-gray-300 text-sm font-medium mb-2">Pace da corrida</label>
          <input id={idc("pace")} type="text" inputMode="text" autoComplete="off" placeholder="6:00" value={paceTexto}
            onChange={(e) => setPaceTexto(e.target.value)} className={`w-full ${campo}`} />
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-7 min-h-[20px] max-w-xl" data-testid="ajuda-prova">
        {tempoTexto.trim() !== "" && !tempoOk
          ? `Use o tempo final entre ${hm(TEMPO_MIN)} e ${hm(TEMPO_MAX)}, como 1h30 ou 1:30.`
          : paceTexto.trim() !== "" && !paceOk
            ? `Use o pace por km entre ${formataPace(PACE_MIN_SEG)} e ${formataPace(PACE_MAX_SEG)}, como 6:00.`
            : naoCabe
              ? `Nesse pace, os ${KM_CORRIDA} km de corrida quase não deixam tempo para as estações. Confira o tempo final ou o pace.`
              : "Tempo final como 1h30 ou 1:30. Pace médio das corridas de 1 km, como 6:00."}
      </p>

      <div aria-live="polite">
        {resultado && pesoOk && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>Seu resultado</p>
            <div className="grid gap-4 sm:grid-cols-2 mb-5">
              <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5">
                <p className="text-gray-400 text-xs mb-1">Gasto estimado da prova</p>
                <p className="text-white font-bold text-4xl sm:text-5xl leading-none" style={h}>
                  {kc(resultado.kcal)}<span className="text-lg font-normal text-gray-300"> kcal</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">em {hm(resultado.minutosTotais)}</p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">De onde veio</p>
                <p className="text-white text-lg leading-snug">
                  <strong>{kc(resultado.kcalCorrida)}</strong> kcal na corrida
                  <br />
                  <strong>{(arredondaKcal(resultado.kcal) - arredondaKcal(resultado.kcalCorrida)).toLocaleString("pt-BR")}</strong> kcal nas estações
                </p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }} data-testid="nota-corrida">
              Os {KM_CORRIDA} km de corrida levaram cerca de {hm(resultado.minutosCorrida)} —{" "}
              {pct(resultado.minutosCorrida / resultado.minutosTotais)} da prova — e fizeram{" "}
              <strong className="text-white">{pct(resultado.kcalCorrida / resultado.kcal)} do gasto</strong>. O Hyrox tem cara de prova de
              estações, mas é, antes de tudo, uma prova de corrida.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
              Descontando o que você gastaria parado, a prova acrescentou cerca de{" "}
              <strong className="text-white">{kc(resultado.kcalLiquida)} kcal</strong> ao seu dia. {NOTA_PROVA}
            </p>

            <div className="mb-5">
              <button type="button" aria-expanded={mostrarEstacoes} onClick={() => setMostrarEstacoes(!mostrarEstacoes)}
                className="text-gray-300 text-sm underline underline-offset-4 decoration-1 min-h-[44px]" style={{ textDecorationColor: "#BA9E50" }}>
                {mostrarEstacoes ? "Esconder" : "Ver"} o gasto de cada estação
              </button>
              {mostrarEstacoes && (
                <ul className="mt-3 space-y-1.5 text-sm max-w-md" data-testid="lista-estacoes">
                  {resultado.kcalPorEstacao.map(({ estacao, kcal }) => (
                    <li key={estacao.id} className="flex justify-between gap-4 border-b border-white/10 pb-1.5">
                      <span className="text-gray-300">{estacao.nome} · {estacao.distancia}</span>
                      <span className="text-white tabular-nums">≈ {kc(kcal)} kcal</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA}</p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("hyrox_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span>, por minuto. A corrida usa a equação de corrida da ACSM, a
                    mesma da <Link href="/ferramentas/calculadora-corrida" className={ln}>Calculadora de Corrida</Link>: no seu pace, {metF(resultado.metCorrida)} METs,
                    por {hm(resultado.minutosCorrida)}.
                  </p>
                  <p>
                    O resto do tempo — {hm(resultado.minutosEstacoes)} — é estação, dividido igualmente entre as oito. No Compêndio de
                    Atividades Físicas: SkiErg {metF(ESTACOES[0].met)} METs, remo {metF(ESTACOES[4].met)}, e as outras seis como treino em
                    circuito vigoroso, 8,0. Na média, {metF(MET_ESTACOES)} METs.
                  </p>
                  <p>O tempo na Roxzone, a área de transição, entra junto com as estações.</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Calorias no Hyrox" caminho="/ferramentas/calculadora-calorias-hyrox"
                local="tool_result" ferramenta="hyrox" resultado={linhasShare} gancho="Descobri quanto a minha prova de Hyrox gastou:" aparencia="solido" />
              {placement !== "calculadora-calorias-hyrox" && (
                <Link href="/ferramentas/calculadora-calorias-hyrox" onClick={() => trackEvent("hyrox_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="hyrox" categoria="padrao" resumo={resumoWhats} placement={placement} />
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mt-5 max-w-2xl">
        {NOTA_SEGURANCA}{" "}
        <Link href="/blog/treino-hibrido-forca-corrida-2025" className={ln}>Veja como combinar força e corrida</Link>.
      </p>
    </div>
  );
}
