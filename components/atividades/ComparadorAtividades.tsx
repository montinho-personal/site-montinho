"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  MINUTOS_MAX,
  MINUTOS_MIN,
  NOTA_BRUTO,
  NOTA_ESTIMATIVA,
  NOTA_SEGURANCA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_MAX,
  PESO_MIN,
  PRESETS_MINUTOS,
  arredondaKcal,
  comparaAtividades,
  formataTempo,
  minutosValidos,
  parseNumero,
  pesoValido,
} from "@/lib/atividades";

/**
 * O comparador: peso e tempo, todas as atividades lado a lado.
 *
 * Não há seletor de atividade nem CTA de WhatsApp aqui de propósito. A
 * página responde "qual gasta mais" e manda para a calculadora de cada
 * uma, que é onde a conta completa e o próximo passo moram.
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
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");
const dec = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

export default function ComparadorAtividades({ placement }: { placement: string }) {
  const [pesoTexto, setPesoTexto] = useState("");
  const [minutosTexto, setMinutosTexto] = useState("60");
  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const minutos = parseNumero(minutosTexto);
  const minutosOk = minutosValidos(minutos);
  const linhas = pesoOk && minutosOk ? comparaAtividades(minutos, peso) : null;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("activity_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  const temResultado = linhas !== null;
  useEffect(() => {
    if (temResultado && !jaUsou.current) {
      jaUsou.current = true;
      trackEvent("activity_calculator_use", { placement, activity: "todas", mode: "comparar" });
    }
  }, [temResultado, placement]);

  const idc = (s: string) => `${s}-cmp-${placement}`;
  const linhasShare = linhas ? [`${formataTempo(linhas[0] ? minutos! : 0)} de atividade`, `1º ${linhas[0].nome}: ≈ ${kc(linhas[0].kcal)} kcal`, `2º ${linhas[1].nome}: ≈ ${kc(linhas[1].kcal)} kcal`] : [];

  return (
    <div ref={raiz} className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative" data-testid="comparador-atividades">
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Qual atividade gasta mais, no seu peso?
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 mb-7 max-w-lg">
        <div>
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
        <div>
          <label htmlFor={idc("min")} className="block text-gray-300 text-sm font-medium mb-2">Quanto tempo?</label>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {PRESETS_MINUTOS.map((p) => (
              <button key={p} type="button" aria-pressed={minutosTexto === String(p)} className={chip(minutosTexto === String(p))}
                onClick={() => { setMinutosTexto(String(p)); trackEvent("activity_preset", { placement, preset: p }); }}>
                {p} min
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input id={idc("min")} type="text" inputMode="numeric" autoComplete="off" placeholder="60" value={minutosTexto}
              onChange={(e) => setMinutosTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("min-ajuda")} />
            <span className="text-gray-300 text-lg">minutos</span>
          </div>
          <p id={idc("min-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {minutosTexto.trim() !== "" && !minutosOk ? `Use um valor entre ${MINUTOS_MIN} e ${MINUTOS_MAX} minutos.` : ""}
          </p>
        </div>
      </div>

      <div aria-live="polite">
        {linhas && pesoOk && minutosOk && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>
              {formataTempo(minutos)} para {dec(peso)} kg, do maior gasto ao menor
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Gasto estimado de cada atividade no mesmo tempo, para o peso informado</caption>
                <thead>
                  <tr className="border-b border-white/20 text-gray-400 text-xs">
                    <th scope="col" className="text-left font-medium py-2 pr-3">#</th>
                    <th scope="col" className="text-left font-medium py-2 pr-3">Atividade</th>
                    <th scope="col" className="text-left font-medium py-2 pr-3">METs</th>
                    <th scope="col" className="text-left font-medium py-2">Gasto</th>
                  </tr>
                </thead>
                <tbody>
                  {linhas.map((l, i) => (
                    <tr key={l.id} className="border-b border-white/10">
                      <td className="py-2.5 pr-3 text-gray-500 tabular-nums">{i + 1}</td>
                      <td className="py-2.5 pr-3">
                        <Link href={l.href} onClick={() => trackEvent("activity_tool_click", { placement, activity: l.id })} className={`text-white font-medium ${ln}`}>
                          {l.nome}
                        </Link>
                        <span className="block text-gray-500 text-xs">{l.ritmo}</span>
                      </td>
                      <td className="py-2.5 pr-3 tabular-nums text-gray-400">{metF(l.met)}</td>
                      <td className="py-2.5 tabular-nums text-white font-semibold whitespace-nowrap">≈ {kc(l.kcal)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
              Cada linha é um ritmo representativo. Clique na atividade para a calculadora dela, que pergunta o que muda a conta de verdade:
              os watts, as paradas, os rounds, os blocos, o revezamento.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA} {NOTA_BRUTO}</p>
            <Compartilhar contexto="tool-result" titulo="Qual atividade queima mais calorias?" caminho="/ferramentas/calculadora-calorias-atividades"
              local="tool_result" ferramenta="atividades" resultado={linhasShare} gancho="Comparei o gasto das atividades no meu peso:" aparencia="solido" />
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
