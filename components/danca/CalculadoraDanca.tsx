"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  ESTILOS,
  ESTILO_PADRAO,
  MINUTOS_MAX,
  MINUTOS_MIN,
  NOTA_ESTIMATIVA,
  NOTA_LINEAR,
  NOTA_NOITE,
  NOTA_SEGURANCA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_MAX,
  PESO_MIN,
  PRESETS_MINUTOS,
  VEZES_SEMANA,
  arredondaKcal,
  calcula,
  comparaEstilos,
  estilo as estiloDe,
  formataTempo,
  kgPorMes,
  minutosValidos,
  parseNumero,
  pesoValido,
  type EstiloId,
} from "@/lib/danca";

/**
 * A Calculadora de Calorias na Dança.
 *
 * O ESTILO É A PERGUNTA
 *
 * O resultado não para no ritmo escolhido: compara todos no mesmo tempo e
 * peso, porque a pergunta do artigo é "qualquer ritmo vale?". Estilo que
 * o Compêndio não mede aparece com o encaixe declarado ao lado.
 *
 * PRIVACIDADE
 *
 * Peso é dado do corpo. Nada sai do navegador e os eventos registram o
 * estilo e a frequência, nunca o peso.
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

export default function CalculadoraDanca({ placement }: { placement: string }) {
  const [pesoTexto, setPesoTexto] = useState("");
  const [minutosTexto, setMinutosTexto] = useState("");
  const [estiloId, setEstiloId] = useState<EstiloId>(ESTILO_PADRAO);
  const [vezes, setVezes] = useState(2);
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const minutos = parseNumero(minutosTexto);
  const minutosOk = minutosValidos(minutos);
  const es = estiloDe(estiloId);

  const resultado = pesoOk && minutosOk ? calcula(peso, minutos, es.met) : null;
  const comparacao = resultado ? comparaEstilos(peso!, minutos!) : null;
  const kgMes = resultado ? kgPorMes(resultado, vezes) : null;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          trackOncePerSession("dance_calculator_view", { placement });
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
      trackEvent("dance_calculator_use", { placement, style: estiloId, per_week: vezes });
    }
  }, [temResultado, placement, estiloId, vezes]);

  const resumoWhats = resultado ? `${formataTempo(resultado.minutos)} de ${es.nome.toLowerCase()} ≈ ${kc(resultado.kcal)} kcal` : null;
  const linhasShare = resultado ? [`${formataTempo(resultado.minutos)} de ${es.nome.toLowerCase()}`, `≈ ${kc(resultado.kcal)} kcal`] : [];
  const idc = (s: string) => `${s}-dan-${placement}`;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-danca"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Quanto o seu ritmo gasta — e como ele se compara aos outros?
      </h2>

      <div className="mb-6">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("estilo")}>O que você dança?</span>
        <div role="group" aria-labelledby={idc("estilo")} className="flex flex-wrap gap-2">
          {ESTILOS.map((e) => (
            <button key={e.id} type="button" onClick={() => setEstiloId(e.id)} aria-pressed={estiloId === e.id} className={chip(estiloId === e.id)}>
              {e.nome}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-2 max-w-xl">{es.exemplos}.</p>
        {es.encaixe && <p className="text-gray-500 text-xs mt-1.5 max-w-xl" data-testid="encaixe">{es.encaixe}</p>}
        <p className="text-gray-500 text-xs mt-1.5 max-w-xl">
          Zumba tem calculadora própria, com as músicas com e sem salto:{" "}
          <Link href="/ferramentas/calculadora-calorias-zumba" className={ln}>Calculadora de Calorias na Zumba</Link>.
        </p>
      </div>

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
        <label htmlFor={idc("min")} className="block text-gray-300 text-sm font-medium mb-2">Quanto tempo você dançou?</label>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {PRESETS_MINUTOS.map((p) => (
            <button key={p} type="button" aria-pressed={minutosTexto === String(p)} className={chip(minutosTexto === String(p))}
              onClick={() => { setMinutosTexto(String(p)); trackEvent("dance_preset", { placement, preset: p }); }}>
              {formataTempo(p)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input id={idc("min")} type="text" inputMode="numeric" autoComplete="off" placeholder="60" value={minutosTexto}
            onChange={(e) => setMinutosTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("min-ajuda")} />
          <span className="text-gray-300 text-lg">minutos</span>
        </div>
        <p id={idc("min-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px] max-w-xl">
          {minutosTexto.trim() !== "" && !minutosOk ? `Use um valor entre ${MINUTOS_MIN} e ${MINUTOS_MAX} minutos.` : NOTA_NOITE}
        </p>
      </div>

      <div className="mb-7">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("sem")}>Quantas vezes por semana?</span>
        <div role="group" aria-labelledby={idc("sem")} className="flex flex-wrap gap-2">
          {VEZES_SEMANA.map((n) => (
            <button key={n} type="button" onClick={() => { setVezes(n); trackEvent("dance_frequency", { placement, per_week: n }); }}
              aria-pressed={vezes === n} className={chip(vezes === n)}>
              {n}×
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite">
        {resultado && pesoOk && comparacao && kgMes !== null && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>Seu resultado</p>
            <div className="grid gap-4 sm:grid-cols-2 mb-5">
              <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5">
                <p className="text-gray-400 text-xs mb-1">{es.nome}, {formataTempo(resultado.minutos)}</p>
                <p className="text-white font-bold text-4xl sm:text-5xl leading-none" style={h}>
                  {kc(resultado.kcal)}<span className="text-lg font-normal text-gray-300"> kcal</span>
                </p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Só da dança, {vezes}× por semana</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>
                  {kg(kgMes)}<span className="text-lg font-normal text-gray-300"> kg/mês</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">no máximo, pela conta linear</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-5 max-w-2xl">
              Descontando o que você gastaria parado, a dança acrescentou cerca de{" "}
              <strong className="text-white">{kc(resultado.kcalLiquida)} kcal</strong> ao seu dia.
            </p>

            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse" data-testid="comparacao-estilos">
                <caption className="text-left text-gray-400 text-xs mb-2">
                  Todos os ritmos, {formataTempo(resultado.minutos)} e {peso!.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} kg, do que gasta mais para o que gasta menos
                </caption>
                <tbody>
                  {comparacao.map((l) => (
                    <tr key={l.estilo.id} className={`border-b border-white/10 ${l.estilo.id === estiloId ? "text-white" : "text-gray-300"}`}>
                      <td className="py-2.5 pr-4">{l.estilo.nome}{l.estilo.encaixe ? " *" : ""}</td>
                      <td className="py-2.5 tabular-nums font-medium">≈ {kc(l.kcal)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-500 text-xs mb-5 max-w-2xl">* Estilo sem entrada própria no Compêndio, encaixado na medida mais próxima.</p>
            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
              Qualquer ritmo vale — mas não vale o mesmo. O que emagrece mais, no fim, é o que você repete toda semana, e
              nisso o ritmo de que você gosta ganha do que gasta 100 kcal a mais.
            </p>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA} {NOTA_LINEAR}</p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("dance_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span>, por minuto. {es.nome} vale {metF(es.met)} METs no
                    Compêndio de Atividades Físicas de 2011 ({es.origem}).
                  </p>
                  {es.encaixe && <p>{es.encaixe}</p>}
                  <p>Os quilos saem do gasto líquido da semana, a 7.700 kcal por quilo de gordura. É teto: o corpo compensa parte do gasto.</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Calorias na Dança" caminho="/ferramentas/calculadora-calorias-danca"
                local="tool_result" ferramenta="danca" resultado={linhasShare} gancho="Descobri quanto o meu ritmo gasta:" aparencia="solido" />
              {placement !== "calculadora-calorias-danca" && (
                <Link href="/ferramentas/calculadora-calorias-danca" onClick={() => trackEvent("dance_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="danca" categoria="padrao" resumo={resumoWhats} placement={placement} />
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
