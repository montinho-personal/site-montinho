"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  BORDA_MAX,
  MET_BORDA,
  MINUTOS_MAX,
  MINUTOS_MIN,
  NADOS,
  NADO_PADRAO,
  NOTA_BORDA,
  NOTA_ESTIMATIVA,
  NOTA_LINEAR,
  NOTA_SEGURANCA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_MAX,
  PESO_MIN,
  PRESETS_MINUTOS,
  VEZES_SEMANA,
  arredondaKcal,
  bordaValida,
  calcula,
  comparaNados,
  formataTempo,
  kgPorMes,
  minutosValidos,
  nado as nadoDe,
  parseNumero,
  pesoValido,
  type NadoId,
} from "@/lib/natacao";

/**
 * A Calculadora de Calorias na Natação.
 *
 * O NADO E A BORDA
 *
 * O nado muda o gasto por minuto mais do que em qualquer outra atividade
 * do site — da natação de lazer à borboleta, mais que o dobro. E o tempo
 * parado na borda, que o artigo diz ser o erro mais comum de quem conta a
 * piscina, entra como campo próprio, com o valor de ficar em pé.
 *
 * PRIVACIDADE
 *
 * Peso é dado do corpo. Nada sai do navegador e os eventos registram o
 * nado e a frequência, nunca o peso.
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

export default function CalculadoraNatacao({ placement }: { placement: string }) {
  const [pesoTexto, setPesoTexto] = useState("");
  const [minutosTexto, setMinutosTexto] = useState("");
  const [bordaTexto, setBordaTexto] = useState("");
  const [nadoId, setNadoId] = useState<NadoId>(NADO_PADRAO);
  const [vezes, setVezes] = useState(2);
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const minutos = parseNumero(minutosTexto);
  const minutosOk = minutosValidos(minutos);
  const borda = bordaTexto.trim() === "" ? 0 : parseNumero(bordaTexto);
  const bordaOk = bordaValida(borda);
  const nd = nadoDe(nadoId);

  const resultado = pesoOk && minutosOk && bordaOk ? calcula(peso, minutos, nd.met, borda) : null;
  const comparacao = resultado ? comparaNados(peso!, minutos!) : null;
  const kgMes = resultado ? kgPorMes(resultado, vezes) : null;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          trackOncePerSession("swimming_calculator_view", { placement });
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
      trackEvent("swimming_calculator_use", { placement, stroke: nadoId, per_week: vezes });
    }
  }, [temResultado, placement, nadoId, vezes]);

  const resumoWhats = resultado ? `${formataTempo(resultado.minutosNadando)} de ${nd.nome.toLowerCase()} ≈ ${kc(resultado.kcal)} kcal` : null;
  const linhasShare = resultado ? [`${formataTempo(resultado.minutosNadando)} de ${nd.nome.toLowerCase()}`, `≈ ${kc(resultado.kcal)} kcal`] : [];
  const idc = (s: string) => `${s}-nat-${placement}`;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-natacao"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Quanto o seu treino na piscina gastou?
      </h2>

      <div className="mb-6">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("nado")}>Que nado?</span>
        <div role="group" aria-labelledby={idc("nado")} className="flex flex-wrap gap-2">
          {NADOS.map((n) => (
            <button key={n.id} type="button" onClick={() => setNadoId(n.id)} aria-pressed={nadoId === n.id} className={chip(nadoId === n.id)}>
              {n.nome}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-2 max-w-xl">{nd.comoReconhecer}</p>
      </div>

      <div className="mb-6">
        <label htmlFor={idc("peso")} className="block text-gray-300 text-sm font-medium mb-2">Quanto você pesa?</label>
        <div className="flex items-center gap-3">
          <input id={idc("peso")} type="text" inputMode="decimal" autoComplete="off" placeholder="80" value={pesoTexto}
            onChange={(e) => setPesoTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("peso-ajuda")} />
          <span className="text-gray-300 text-lg">kg</span>
        </div>
        <p id={idc("peso-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
          {pesoTexto.trim() !== "" && !pesoOk ? `Confira o peso informado (entre ${PESO_MIN} e ${PESO_MAX} kg).` : ""}
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor={idc("min")} className="block text-gray-300 text-sm font-medium mb-2">Quanto tempo você nadou de fato?</label>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {PRESETS_MINUTOS.map((p) => (
            <button key={p} type="button" aria-pressed={minutosTexto === String(p)} className={chip(minutosTexto === String(p))}
              onClick={() => { setMinutosTexto(String(p)); trackEvent("swimming_preset", { placement, preset: p }); }}>
              {formataTempo(p)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input id={idc("min")} type="text" inputMode="numeric" autoComplete="off" placeholder="40" value={minutosTexto}
            onChange={(e) => setMinutosTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("min-ajuda")} />
          <span className="text-gray-300 text-lg">minutos</span>
        </div>
        <p id={idc("min-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
          {minutosTexto.trim() !== "" && !minutosOk ? `Use um valor entre ${MINUTOS_MIN} e ${MINUTOS_MAX} minutos.` : "Só o tempo nadando. A borda vem no campo de baixo."}
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor={idc("borda")} className="block text-gray-300 text-sm font-medium mb-2">
          E parado na borda? <span className="text-gray-500 font-normal">(opcional)</span>
        </label>
        <div className="flex items-center gap-3">
          <input id={idc("borda")} type="text" inputMode="numeric" autoComplete="off" placeholder="0" value={bordaTexto}
            onChange={(e) => setBordaTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("borda-ajuda")} />
          <span className="text-gray-300 text-lg">minutos</span>
        </div>
        <p id={idc("borda-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px] max-w-xl">
          {!bordaOk ? `Use de 0 a ${BORDA_MAX} minutos.` : "Descanso entre as séries, conversa, ajuste de óculos. Some tudo."}
        </p>
      </div>

      <div className="mb-7">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("sem")}>Quantas vezes por semana?</span>
        <div role="group" aria-labelledby={idc("sem")} className="flex flex-wrap gap-2">
          {VEZES_SEMANA.map((n) => (
            <button key={n} type="button" onClick={() => { setVezes(n); trackEvent("swimming_frequency", { placement, per_week: n }); }}
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
                <p className="text-gray-400 text-xs mb-1">Gasto estimado</p>
                <p className="text-white font-bold text-4xl sm:text-5xl leading-none" style={h}>
                  {kc(resultado.kcal)}<span className="text-lg font-normal text-gray-300"> kcal</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {resultado.minutosBorda > 0
                    ? `${formataTempo(resultado.minutosNadando)} nadando e ${formataTempo(resultado.minutosBorda)} na borda`
                    : `${formataTempo(resultado.minutosNadando)} de ${nd.nome.toLowerCase()}`}
                </p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Só da piscina, {vezes}× por semana</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>
                  {kg(kgMes)}<span className="text-lg font-normal text-gray-300"> kg/mês</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">no máximo, pela conta linear</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
              Descontando o que você gastaria parado, o treino acrescentou cerca de{" "}
              <strong className="text-white">{kc(resultado.kcalLiquida)} kcal</strong> ao seu dia.
            </p>
            {resultado.minutosBorda > 0 && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }} data-testid="nota-borda">
                Se os {formataTempo(resultado.minutosNadando + resultado.minutosBorda)} tivessem sido todos nadando, seriam cerca de{" "}
                {kc(calcula(peso!, resultado.minutosNadando + resultado.minutosBorda, nd.met).kcal)} kcal. {NOTA_BORDA}
              </p>
            )}

            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse" data-testid="comparacao-nados">
                <caption className="text-left text-gray-400 text-xs mb-2">
                  Todos os nados, {formataTempo(resultado.minutosNadando)} nadando e {peso!.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} kg
                </caption>
                <tbody>
                  {comparacao.map((l) => (
                    <tr key={l.nado.id} className={`border-b border-white/10 ${l.nado.id === nadoId ? "text-white" : "text-gray-300"}`}>
                      <td className="py-2.5 pr-4">{l.nado.nome}</td>
                      <td className="py-2.5 tabular-nums font-medium">≈ {kc(l.kcal)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA} {NOTA_LINEAR}</p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("swimming_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span>, por minuto. {nd.nome} vale {metF(nd.met)} METs no
                    Compêndio de Atividades Físicas de 2011; o tempo na borda vale {metF(MET_BORDA)} MET, que é ficar em pé parado.
                  </p>
                  <p>Os quilos saem do gasto líquido da semana, a 7.700 kcal por quilo de gordura. É teto: o corpo compensa parte do gasto.</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Calorias na Natação" caminho="/ferramentas/calculadora-calorias-natacao"
                local="tool_result" ferramenta="natacao" resultado={linhasShare} gancho="Descobri quanto o meu treino de natação gastou:" aparencia="solido" />
              {placement !== "calculadora-calorias-natacao" && (
                <Link href="/ferramentas/calculadora-calorias-natacao" onClick={() => trackEvent("swimming_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="natacao" categoria="padrao" resumo={resumoWhats} placement={placement} />
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
