"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  AULA_MAX,
  AULA_MIN,
  DESCANSO_MAX,
  DESCANSO_PADRAO,
  MET_DESCANSO,
  MET_ROUND,
  MET_TECNICA,
  NOTA_ESTIMATIVA,
  NOTA_LINEAR,
  NOTA_SEGURANCA,
  NOTA_SEM_PERDA_LOCALIZADA,
  NOTA_TECNICA,
  PESO_MAX,
  PESO_MIN,
  PRESETS_AULA,
  ROUND_EXTRA_MINIMO,
  ROUNDS_MAX,
  ROUNDS_PADRAO,
  ROUND_MIN_MAX,
  ROUND_MIN_MIN,
  ROUND_PADRAO,
  VEZES_SEMANA,
  arredondaKcal,
  aulaValida,
  calcula,
  descansoValido,
  formataTempo,
  kcalPorRoundExtra,
  kgPorMes,
  parseNumero,
  pesoValido,
  roundValido,
  roundsValidos,
} from "@/lib/muaythai";

/**
 * A Calculadora de Calorias no Muay Thai.
 *
 * A pessoa informa a duração da aula e quantos rounds fortes fez (manopla,
 * saco em ritmo de luta, sparring). O resto da aula vira técnica. Nada sai
 * do navegador; os eventos registram rounds e frequência, nunca o peso.
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
const kg = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function CalculadoraMuayThai({ placement }: { placement: string }) {
  const [pesoTexto, setPesoTexto] = useState("");
  const [aulaTexto, setAulaTexto] = useState("");
  const [roundsTexto, setRoundsTexto] = useState(String(ROUNDS_PADRAO));
  const [roundTexto, setRoundTexto] = useState(String(ROUND_PADRAO));
  const [descansoTexto, setDescansoTexto] = useState(String(DESCANSO_PADRAO));
  const [vezes, setVezes] = useState(3);
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const aula = parseNumero(aulaTexto);
  const aulaOk = aulaValida(aula);
  const rounds = parseNumero(roundsTexto);
  const roundsOk = roundsValidos(rounds);
  const round = parseNumero(roundTexto);
  const roundOk = roundValido(round);
  const descanso = parseNumero(descansoTexto);
  const descansoOk = descansoValido(descanso);

  const camposOk = pesoOk && aulaOk && roundsOk && roundOk && descansoOk;
  const resultado = camposOk ? calcula(peso, aula, rounds, round, descanso) : null;
  const naoCabe = camposOk && resultado === null;
  const kgMes = resultado ? kgPorMes(resultado, vezes) : null;
  const semRound = resultado && resultado.rounds > 0 ? calcula(peso!, aula!, 0, round!, descanso!) : null;
  const extra = resultado ? kcalPorRoundExtra(peso!, round!, descanso!) : 0;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          trackOncePerSession("muaythai_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  const temResultado = resultado !== null;
  const nRounds = roundsOk ? rounds : -1;
  useEffect(() => {
    if (temResultado && !jaUsou.current) {
      jaUsou.current = true;
      trackEvent("muaythai_calculator_use", { placement, rounds: nRounds, per_week: vezes });
    }
  }, [temResultado, placement, nRounds, vezes]);

  const resumoWhats = resultado ? `${formataTempo(resultado.minutosAula)} de muay thai com ${resultado.rounds} rounds fortes ≈ ${kc(resultado.kcal)} kcal` : null;
  const linhasShare = resultado ? [`${formataTempo(resultado.minutosAula)} de muay thai`, `${resultado.rounds} ${resultado.rounds === 1 ? "round forte" : "rounds fortes"}`, `≈ ${kc(resultado.kcal)} kcal`] : [];
  const idc = (s: string) => `${s}-mt-${placement}`;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-muaythai"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Quanto o seu treino de muay thai gastou?
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

      <div className="mb-6">
        <label htmlFor={idc("aula")} className="block text-gray-300 text-sm font-medium mb-2">Quanto tempo de aula?</label>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {PRESETS_AULA.map((p) => (
            <button key={p} type="button" aria-pressed={aulaTexto === String(p)} className={chip(aulaTexto === String(p))}
              onClick={() => { setAulaTexto(String(p)); trackEvent("muaythai_preset", { placement, preset: p }); }}>
              {formataTempo(p)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input id={idc("aula")} type="text" inputMode="numeric" autoComplete="off" placeholder="75" value={aulaTexto}
            onChange={(e) => setAulaTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("aula-ajuda")} />
          <span className="text-gray-300 text-lg">minutos</span>
        </div>
        <p id={idc("aula-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
          {aulaTexto.trim() !== "" && !aulaOk ? `Use um valor entre ${AULA_MIN} e ${AULA_MAX} minutos.` : "A aula inteira: aquecimento, técnica e rounds."}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-2 max-w-md">
        <div>
          <label htmlFor={idc("rounds")} className="block text-gray-300 text-sm font-medium mb-2">Rounds fortes</label>
          <input id={idc("rounds")} type="text" inputMode="numeric" autoComplete="off" value={roundsTexto}
            onChange={(e) => setRoundsTexto(e.target.value)} className={`w-full ${campo}`} />
        </div>
        <div>
          <label htmlFor={idc("round")} className="block text-gray-300 text-sm font-medium mb-2">Min/round</label>
          <input id={idc("round")} type="text" inputMode="decimal" autoComplete="off" value={roundTexto}
            onChange={(e) => setRoundTexto(e.target.value)} className={`w-full ${campo}`} />
        </div>
        <div>
          <label htmlFor={idc("desc")} className="block text-gray-300 text-sm font-medium mb-2">Descanso</label>
          <input id={idc("desc")} type="text" inputMode="decimal" autoComplete="off" value={descansoTexto}
            onChange={(e) => setDescansoTexto(e.target.value)} className={`w-full ${campo}`} />
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-6 min-h-[20px] max-w-xl" data-testid="ajuda-rounds">
        {!roundsOk && roundsTexto.trim() !== ""
          ? `Use de 0 a ${ROUNDS_MAX} rounds, em número inteiro.`
          : !roundOk && roundTexto.trim() !== ""
            ? `Cada round pode ter de ${ROUND_MIN_MIN} a ${ROUND_MIN_MAX} minutos.`
            : !descansoOk && descansoTexto.trim() !== ""
              ? `O descanso vai de 0 a ${DESCANSO_MAX} minutos.`
              : naoCabe
                ? "Esses rounds não cabem nessa aula. Confira a duração da aula ou o número de rounds."
                : "Rounds fortes: manopla, saco em ritmo de luta ou sparring. Descanso entre eles, em minutos. O resto da aula conta como técnica."}
      </p>

      <div className="mb-7">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("sem")}>Quantas aulas por semana?</span>
        <div role="group" aria-labelledby={idc("sem")} className="flex flex-wrap gap-2">
          {VEZES_SEMANA.map((n) => (
            <button key={n} type="button" onClick={() => { setVezes(n); trackEvent("muaythai_frequency", { placement, per_week: n }); }}
              aria-pressed={vezes === n} className={chip(vezes === n)}>
              {n}×
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite">
        {resultado && pesoOk && kgMes !== null && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>Seu resultado</p>
            <div className="grid gap-4 sm:grid-cols-2 mb-5">
              <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5">
                <p className="text-gray-400 text-xs mb-1">Gasto estimado da aula</p>
                <p className="text-white font-bold text-4xl sm:text-5xl leading-none" style={h}>
                  {kc(resultado.kcal)}<span className="text-lg font-normal text-gray-300"> kcal</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {resultado.rounds === 0
                    ? "só técnica, sem round forte"
                    : `${kc(resultado.kcalRound)} kcal nos rounds, ${kc(resultado.kcalTecnica)} na técnica`}
                </p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Só do treino, {vezes}× por semana</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>
                  {kg(kgMes)}<span className="text-lg font-normal text-gray-300"> kg/mês</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">no máximo, pela conta linear</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
              Descontando o que você gastaria parado, a aula acrescentou cerca de{" "}
              <strong className="text-white">{kc(resultado.kcalLiquida)} kcal</strong> ao seu dia.
            </p>
            {semRound && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }} data-testid="nota-round">
                A mesma aula só com técnica gastaria cerca de {kc(semRound.kcal)} kcal.{" "}
                {extra >= ROUND_EXTRA_MINIMO
                  ? <>Cada round forte a mais, na mesma duração, soma só cerca de {kc(extra)} kcal: o round gasta o dobro por minuto, mas é curto.</>
                  : <>Com rounds de {formataTempo(round!)} e {formataTempo(descanso!)} de descanso, um round a mais quase não muda o gasto: o descanso entre eles gasta menos que a técnica que ele substitui.</>}{" "}
                Quem quer gastar mais precisa de mais aulas, não de emendar rounds.
              </p>
            )}

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA} {NOTA_TECNICA} {NOTA_LINEAR}</p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("muaythai_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span>, por minuto. Técnica e drill valem {metF(MET_TECNICA)} METs
                    (artes marciais em ritmo lento de treino, no Compêndio de Atividades Físicas); o round forte vale {metF(MET_ROUND)} (artes
                    marciais em ritmo de luta, que inclui o muay thai); o descanso entre rounds vale {metF(MET_DESCANSO)}, que é ficar em pé.
                  </p>
                  <p>
                    Na sua aula: {formataTempo(resultado.minutosTecnica)} de técnica, {formataTempo(resultado.minutosRound)} de rounds fortes
                    {resultado.minutosDescanso > 0 && <> e {formataTempo(resultado.minutosDescanso)} de descanso</>}.
                  </p>
                  <p>Os quilos saem do gasto líquido da semana, a 7.700 kcal por quilo de gordura. É teto: o corpo compensa parte do gasto.</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Calorias no Muay Thai" caminho="/ferramentas/calculadora-calorias-muay-thai"
                local="tool_result" ferramenta="muaythai" resultado={linhasShare} gancho="Descobri quanto o meu treino de muay thai gastou:" aparencia="solido" />
              {placement !== "calculadora-calorias-muay-thai" && (
                <Link href="/ferramentas/calculadora-calorias-muay-thai" onClick={() => trackEvent("muaythai_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="muaythai" categoria="padrao" resumo={resumoWhats} placement={placement} />
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mt-5 max-w-2xl">
        {NOTA_SEM_PERDA_LOCALIZADA} {NOTA_SEGURANCA}{" "}
        <Link href="/blog/deficit-calorico-como-calcular" className={ln}>Entenda como funciona o déficit calórico</Link>.
      </p>
    </div>
  );
}
