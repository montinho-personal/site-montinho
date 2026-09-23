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
  MET_ROLA,
  MET_TECNICA,
  NOTA_ESTIMATIVA,
  NOTA_LINEAR,
  NOTA_SEGURANCA,
  NOTA_SEM_PERDA_LOCALIZADA,
  NOTA_TECNICA,
  PESO_MAX,
  PESO_MIN,
  PRESETS_AULA,
  ROLAS_MAX,
  ROLA_MIN_MAX,
  ROLA_MIN_MIN,
  ROLA_PADRAO,
  VEZES_SEMANA,
  arredondaKcal,
  aulaValida,
  calcula,
  descansoValido,
  formataTempo,
  kcalPorRolaExtra,
  kgPorMes,
  parseNumero,
  pesoValido,
  rolaValido,
  rolasValidos,
} from "@/lib/jiujitsu";

/**
 * A Calculadora de Calorias no Jiu-Jitsu.
 *
 * O ROLA É A CONTA
 *
 * A pessoa informa a duração da aula e quantos rolas fez. O tempo que
 * não é rola nem descanso vira técnica. O resultado separa as duas partes
 * e mostra quanto um rola a mais soma — pouco, na mesma aula, o que
 * desmonta a ideia de que "emendar rolas" é o que emagrece.
 *
 * PRIVACIDADE
 *
 * Peso é dado do corpo. Nada sai do navegador e os eventos registram o
 * número de rolas e a frequência, nunca o peso.
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

export default function CalculadoraJiuJitsu({ placement }: { placement: string }) {
  const [pesoTexto, setPesoTexto] = useState("");
  const [aulaTexto, setAulaTexto] = useState("");
  const [rolasTexto, setRolasTexto] = useState("4");
  const [rolaTexto, setRolaTexto] = useState(String(ROLA_PADRAO));
  const [descansoTexto, setDescansoTexto] = useState(String(DESCANSO_PADRAO));
  const [vezes, setVezes] = useState(3);
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const aula = parseNumero(aulaTexto);
  const aulaOk = aulaValida(aula);
  const rolas = parseNumero(rolasTexto);
  const rolasOk = rolasValidos(rolas);
  const rola = parseNumero(rolaTexto);
  const rolaOk = rolaValido(rola);
  const descanso = parseNumero(descansoTexto);
  const descansoOk = descansoValido(descanso);

  const camposOk = pesoOk && aulaOk && rolasOk && rolaOk && descansoOk;
  const resultado = camposOk ? calcula(peso, aula, rolas, rola, descanso) : null;
  const naoCabe = camposOk && resultado === null;
  const kgMes = resultado ? kgPorMes(resultado, vezes) : null;
  const semRola = resultado && resultado.rolas > 0 ? calcula(peso!, aula!, 0, rola!, descanso!) : null;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          trackOncePerSession("jiujitsu_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  const temResultado = resultado !== null;
  const nRolas = rolasOk ? rolas : -1;
  useEffect(() => {
    if (temResultado && !jaUsou.current) {
      jaUsou.current = true;
      trackEvent("jiujitsu_calculator_use", { placement, rounds: nRolas, per_week: vezes });
    }
  }, [temResultado, placement, nRolas, vezes]);

  const resumoWhats = resultado ? `${formataTempo(resultado.minutosAula)} de jiu-jitsu com ${resultado.rolas} rolas ≈ ${kc(resultado.kcal)} kcal` : null;
  const linhasShare = resultado ? [`${formataTempo(resultado.minutosAula)} de jiu-jitsu`, `${resultado.rolas} ${resultado.rolas === 1 ? "rola" : "rolas"}`, `≈ ${kc(resultado.kcal)} kcal`] : [];
  const idc = (s: string) => `${s}-jj-${placement}`;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-jiujitsu"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Quanto o seu treino de jiu-jitsu gastou?
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
              onClick={() => { setAulaTexto(String(p)); trackEvent("jiujitsu_preset", { placement, preset: p }); }}>
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
          {aulaTexto.trim() !== "" && !aulaOk ? `Use um valor entre ${AULA_MIN} e ${AULA_MAX} minutos.` : "A aula inteira: aquecimento, técnica e rola."}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-2 max-w-md">
        <div>
          <label htmlFor={idc("rolas")} className="block text-gray-300 text-sm font-medium mb-2">Rolas</label>
          <input id={idc("rolas")} type="text" inputMode="numeric" autoComplete="off" value={rolasTexto}
            onChange={(e) => setRolasTexto(e.target.value)} className={`w-full ${campo}`} />
        </div>
        <div>
          <label htmlFor={idc("rola")} className="block text-gray-300 text-sm font-medium mb-2">Min/rola</label>
          <input id={idc("rola")} type="text" inputMode="decimal" autoComplete="off" value={rolaTexto}
            onChange={(e) => setRolaTexto(e.target.value)} className={`w-full ${campo}`} />
        </div>
        <div>
          <label htmlFor={idc("desc")} className="block text-gray-300 text-sm font-medium mb-2">Descanso</label>
          <input id={idc("desc")} type="text" inputMode="decimal" autoComplete="off" value={descansoTexto}
            onChange={(e) => setDescansoTexto(e.target.value)} className={`w-full ${campo}`} />
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-6 min-h-[20px] max-w-xl" data-testid="ajuda-rolas">
        {!rolasOk && rolasTexto.trim() !== ""
          ? `Use de 0 a ${ROLAS_MAX} rolas, em número inteiro.`
          : !rolaOk && rolaTexto.trim() !== ""
            ? `Cada rola pode ter de ${ROLA_MIN_MIN} a ${ROLA_MIN_MAX} minutos.`
            : !descansoOk && descansoTexto.trim() !== ""
              ? `O descanso vai de 0 a ${DESCANSO_MAX} minutos.`
              : naoCabe
                ? "Esses rolas não cabem nessa aula. Confira a duração da aula ou o número de rolas."
                : "Descanso entre um rola e outro, em minutos. O resto da aula conta como técnica."}
      </p>

      <div className="mb-7">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("sem")}>Quantas aulas por semana?</span>
        <div role="group" aria-labelledby={idc("sem")} className="flex flex-wrap gap-2">
          {VEZES_SEMANA.map((n) => (
            <button key={n} type="button" onClick={() => { setVezes(n); trackEvent("jiujitsu_frequency", { placement, per_week: n }); }}
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
                  {resultado.rolas === 0
                    ? "só técnica, sem rola"
                    : `${kc(resultado.kcalRola)} kcal nos rolas, ${kc(resultado.kcalTecnica)} na técnica`}
                </p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Só do tatame, {vezes}× por semana</p>
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
            {semRola && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }} data-testid="nota-rola">
                A mesma aula só com técnica gastaria cerca de {kc(semRola.kcal)} kcal. Cada rola a mais, na mesma duração, soma
                só cerca de {kc(kcalPorRolaExtra(peso!, rola!, descanso!))} kcal — o rola gasta o dobro por minuto, mas é curto.
                Quem quer gastar mais precisa de mais aulas, não de emendar rolas.
              </p>
            )}

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA} {NOTA_TECNICA} {NOTA_LINEAR}</p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("jiujitsu_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span>, por minuto. Técnica e drill valem {metF(MET_TECNICA)} METs
                    (artes marciais em ritmo lento de treino, no Compêndio de Atividades Físicas); o rola vale {metF(MET_ROLA)} (artes
                    marciais em ritmo de luta); o descanso entre rolas vale {metF(MET_DESCANSO)}, que é ficar em pé.
                  </p>
                  <p>
                    Na sua aula: {formataTempo(resultado.minutosTecnica)} de técnica, {formataTempo(resultado.minutosRola)} de rola
                    {resultado.minutosDescanso > 0 && <> e {formataTempo(resultado.minutosDescanso)} de descanso</>}.
                  </p>
                  <p>Os quilos saem do gasto líquido da semana, a 7.700 kcal por quilo de gordura. É teto: o corpo compensa parte do gasto.</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Calorias no Jiu-Jitsu" caminho="/ferramentas/calculadora-calorias-jiu-jitsu"
                local="tool_result" ferramenta="jiujitsu" resultado={linhasShare} gancho="Descobri quanto o meu treino de jiu-jitsu gastou:" aparencia="solido" />
              {placement !== "calculadora-calorias-jiu-jitsu" && (
                <Link href="/ferramentas/calculadora-calorias-jiu-jitsu" onClick={() => trackEvent("jiujitsu_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="jiujitsu" categoria="padrao" resumo={resumoWhats} placement={placement} />
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
