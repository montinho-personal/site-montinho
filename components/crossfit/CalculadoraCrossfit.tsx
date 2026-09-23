"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  AULAS,
  AULA_MAX,
  AULA_MIN,
  EMOM_MAX,
  EMOM_MIN,
  EMOM_PADRAO,
  FORMATOS,
  MET_AQUECIMENTO,
  MET_FORCA,
  MET_PARADO,
  MET_WOD,
  NOTA_ESTIMATIVA,
  NOTA_LINEAR,
  NOTA_PARTES,
  NOTA_SEGURANCA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PARTE_MAX,
  PESO_MAX,
  PESO_MIN,
  VEZES_SEMANA,
  arredondaKcal,
  aulaValida,
  calcula,
  emomValido,
  formataTempo,
  kcalSeFosseTudoWod,
  kgPorMes,
  parseNumero,
  parteValida,
  pesoValido,
  type FormatoId,
} from "@/lib/crossfit";

/**
 * A Calculadora de Calorias no CrossFit.
 *
 * A AULA TEM PARTES
 *
 * A pessoa informa a duração da aula, os minutos de aquecimento, força e
 * WOD, e o formato do WOD. O que sobra é explicação e montagem de material.
 * O resultado mostra quanto do gasto veio do WOD e compara com a conta de
 * uma hora inteira de WOD — que é de onde saem as "1.000 kcal".
 *
 * PRIVACIDADE
 *
 * Peso é dado do corpo. Nada sai do navegador e os eventos registram o
 * formato do WOD e a frequência, nunca o peso.
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
const pct = (n: number) => `${Math.round(n * 100)}%`;

export default function CalculadoraCrossfit({ placement }: { placement: string }) {
  const [pesoTexto, setPesoTexto] = useState("");
  const [aulaTexto, setAulaTexto] = useState("");
  const [aquecTexto, setAquecTexto] = useState("");
  const [forcaTexto, setForcaTexto] = useState("");
  const [wodTexto, setWodTexto] = useState("");
  const [formato, setFormato] = useState<FormatoId>("continuo");
  const [emomTexto, setEmomTexto] = useState(String(EMOM_PADRAO));
  const [vezes, setVezes] = useState(3);
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const aula = parseNumero(aulaTexto);
  const aulaOk = aulaValida(aula);
  const aquec = parseNumero(aquecTexto);
  const forca = parseNumero(forcaTexto);
  const wod = parseNumero(wodTexto);
  const partesOk = parteValida(aquec) && parteValida(forca) && parteValida(wod) && (wod ?? 0) > 0;
  const emom = parseNumero(emomTexto);
  const emomOk = formato !== "emom" || emomValido(emom);

  const camposOk = pesoOk && aulaOk && partesOk && emomOk;
  const resultado = camposOk ? calcula(peso, aula, aquec!, forca!, wod!, formato, emom ?? EMOM_PADRAO) : null;
  const naoCabe = camposOk && resultado === null;
  const kgMes = resultado ? kgPorMes(resultado, vezes) : null;
  const tudoWod = resultado ? kcalSeFosseTudoWod(peso!, aula!) : 0;
  const outros = resultado
    ? FORMATOS.filter((f) => f.id !== formato).map((f) => ({ f, kcal: calcula(peso!, aula!, aquec!, forca!, wod!, f.id, EMOM_PADRAO)!.kcal }))
    : [];

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          trackOncePerSession("crossfit_calculator_view", { placement });
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
      trackEvent("crossfit_calculator_use", { placement, format: formato, per_week: vezes });
    }
  }, [temResultado, placement, formato, vezes]);

  const escolheAula = (id: string) => {
    const a = AULAS.find((x) => x.id === id)!;
    setAulaTexto(String(a.aula));
    setAquecTexto(String(a.aquecimento));
    setForcaTexto(String(a.forca));
    setWodTexto(String(a.wod));
    setFormato(a.formato);
    if (a.formato === "emom") setEmomTexto(String(EMOM_PADRAO));
    trackEvent("crossfit_preset", { placement, preset: id });
  };
  const aulaAtiva = AULAS.find(
    (a) => aulaTexto === String(a.aula) && aquecTexto === String(a.aquecimento) && forcaTexto === String(a.forca) && wodTexto === String(a.wod) && formato === a.formato,
  )?.id;

  const nomeFormato = FORMATOS.find((f) => f.id === formato)!.nome;
  const resumoWhats = resultado ? `${formataTempo(resultado.minutosAula)} de CrossFit, WOD de ${formataTempo(resultado.minutosWod)} ≈ ${kc(resultado.kcal)} kcal` : null;
  const linhasShare = resultado ? [`${formataTempo(resultado.minutosAula)} de CrossFit`, `WOD ${nomeFormato} de ${formataTempo(resultado.minutosWod)}`, `≈ ${kc(resultado.kcal)} kcal`] : [];
  const idc = (s: string) => `${s}-cf-${placement}`;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-crossfit"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Quanto a sua aula de CrossFit gastou?
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
        <span className="block text-gray-300 text-sm font-medium mb-2">Como foi a aula?</span>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {AULAS.map((a) => (
            <button key={a.id} type="button" aria-pressed={aulaAtiva === a.id} className={chip(aulaAtiva === a.id)} onClick={() => escolheAula(a.id)}>
              {a.nome}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2 max-w-2xl">
        <div>
          <label htmlFor={idc("aula")} className="block text-gray-300 text-sm font-medium mb-2">Aula (min)</label>
          <input id={idc("aula")} type="text" inputMode="numeric" autoComplete="off" placeholder="60" value={aulaTexto}
            onChange={(e) => setAulaTexto(e.target.value)} className={`w-full ${campo}`} />
        </div>
        <div>
          <label htmlFor={idc("aquec")} className="block text-gray-300 text-sm font-medium mb-2">Aquecimento</label>
          <input id={idc("aquec")} type="text" inputMode="numeric" autoComplete="off" placeholder="12" value={aquecTexto}
            onChange={(e) => setAquecTexto(e.target.value)} className={`w-full ${campo}`} />
        </div>
        <div>
          <label htmlFor={idc("forca")} className="block text-gray-300 text-sm font-medium mb-2">Força</label>
          <input id={idc("forca")} type="text" inputMode="numeric" autoComplete="off" placeholder="15" value={forcaTexto}
            onChange={(e) => setForcaTexto(e.target.value)} className={`w-full ${campo}`} />
        </div>
        <div>
          <label htmlFor={idc("wod")} className="block text-gray-300 text-sm font-medium mb-2">WOD</label>
          <input id={idc("wod")} type="text" inputMode="numeric" autoComplete="off" placeholder="15" value={wodTexto}
            onChange={(e) => setWodTexto(e.target.value)} className={`w-full ${campo}`} />
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-6 min-h-[20px] max-w-xl" data-testid="ajuda-partes">
        {aulaTexto.trim() !== "" && !aulaOk
          ? `A aula vai de ${AULA_MIN} a ${AULA_MAX} minutos.`
          : [aquecTexto, forcaTexto, wodTexto].some((t) => t.trim() !== "") && !partesOk
            ? `Cada parte vai de 0 a ${PARTE_MAX} minutos, e o WOD precisa ter pelo menos 1.`
            : naoCabe
              ? "As partes somam mais que a aula. Confira os minutos."
              : "Minutos de cada parte. Sem força no dia, use 0. O que sobra é explicação e montagem de material."}
      </p>

      <div className="mb-6">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("formato")}>Qual foi o formato do WOD?</span>
        <div role="group" aria-labelledby={idc("formato")} className="flex flex-wrap gap-2 mb-2">
          {FORMATOS.map((f) => (
            <button key={f.id} type="button" aria-pressed={formato === f.id} className={chip(formato === f.id)} onClick={() => setFormato(f.id)}>
              {f.nome}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm" data-testid="ajuda-formato">{FORMATOS.find((f) => f.id === formato)!.descricao}</p>
        {formato === "emom" && (
          <div className="mt-3">
            <label htmlFor={idc("emom")} className="block text-gray-300 text-sm font-medium mb-2">Quantos segundos o bloco levava?</label>
            <div className="flex items-center gap-3">
              <input id={idc("emom")} type="text" inputMode="numeric" autoComplete="off" value={emomTexto}
                onChange={(e) => setEmomTexto(e.target.value)} className={`w-28 ${campo}`} />
              <span className="text-gray-300">segundos por minuto</span>
            </div>
            {!emomOk && <p className="text-gray-400 text-sm mt-2">Use de {EMOM_MIN} a {EMOM_MAX} segundos.</p>}
          </div>
        )}
      </div>

      <div className="mb-7">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("sem")}>Quantas aulas por semana?</span>
        <div role="group" aria-labelledby={idc("sem")} className="flex flex-wrap gap-2">
          {VEZES_SEMANA.map((n) => (
            <button key={n} type="button" onClick={() => { setVezes(n); trackEvent("crossfit_frequency", { placement, per_week: n }); }}
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
                  {kc(resultado.kcalWod)} no WOD, {(arredondaKcal(resultado.kcal) - arredondaKcal(resultado.kcalWod)).toLocaleString("pt-BR")} no resto da aula
                </p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Só do box, {vezes}× por semana</p>
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
            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }} data-testid="nota-wod">
              O WOD foi {Math.round(resultado.minutosWod)} dos {Math.round(resultado.minutosAula)} minutos de aula e fez{" "}
              <strong className="text-white">{pct(resultado.kcalWod / resultado.kcal)} do gasto</strong>. Se a aula inteira fosse WOD sem
              pausa, daria {kc(tudoWod)} kcal — é dessa conta que saem os números de mil calorias.
            </p>
            {outros.length > 0 && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl" data-testid="nota-formatos">
                Com o WOD em outro formato, a mesma aula daria cerca de{" "}
                {outros.map((o, i) => (
                  <span key={o.f.id}>{i > 0 && " e "}{kc(o.kcal)} kcal em {o.f.nome}</span>
                ))}
                .
              </p>
            )}

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA} {NOTA_PARTES} {NOTA_LINEAR}</p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("crossfit_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span>, por minuto, parte por parte. No Compêndio de
                    Atividades Físicas: o WOD é treino em circuito vigoroso, {metF(MET_WOD)} METs; a força é levantamento de peso vigoroso,{" "}
                    {metF(MET_FORCA)}; o aquecimento é calistenia leve, {metF(MET_AQUECIMENTO)}; o resto da aula e a pausa dentro do WOD
                    valem {metF(MET_PARADO)}, que é ficar em pé.
                  </p>
                  <p>
                    Na sua aula: {formataTempo(resultado.minutosAquecimento)} de aquecimento, {formataTempo(resultado.minutosForca)} de força,{" "}
                    {formataTempo(resultado.minutosWodTrabalho)} de trabalho no WOD e {formataTempo(resultado.minutosParado)} em pé.
                  </p>
                  <p>Os quilos saem do gasto líquido da semana, a 7.700 kcal por quilo de gordura. É teto: o corpo compensa parte do gasto.</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Calorias no CrossFit" caminho="/ferramentas/calculadora-calorias-crossfit"
                local="tool_result" ferramenta="crossfit" resultado={linhasShare} gancho="Descobri quanto a minha aula de CrossFit gastou:" aparencia="solido" />
              {placement !== "calculadora-calorias-crossfit" && (
                <Link href="/ferramentas/calculadora-calorias-crossfit" onClick={() => trackEvent("crossfit_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="crossfit" categoria="padrao" resumo={resumoWhats} placement={placement} />
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
