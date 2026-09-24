"use client";

/**
 * Gráfico de trajetória em SVG puro: sem biblioteca, sem hover obrigatório.
 *
 * Mostra a curva principal com a faixa de incerteza, uma curva de
 * comparação opcional (tracejada) e a meta. Os marcos são botões: tocar
 * mostra o valor embaixo do gráfico, e o teclado alcança todos. A leitura
 * textual completa vai numa tabela para leitor de tela.
 */

import { useEffect, useRef, useState } from "react";
import { DOURADO } from "./ui";

export interface SeriePonto { x: number; y: number; min?: number; max?: number }
export interface Marco { x: number; rotulo: string }

const M = { t: 16, r: 12, b: 30, l: 34 };

export default function ProjectionChart({ serie, comparacao, meta, marcos, formataY, formataX, rotuloSerie, rotuloComparacao, descricao }: {
  serie: SeriePonto[]; comparacao?: SeriePonto[] | null; meta?: number | null; marcos: Marco[];
  formataY: (y: number) => string; formataX: (x: number) => string; rotuloSerie: string; rotuloComparacao?: string; descricao: string;
}) {
  const [ativo, setAtivo] = useState<number>(marcos.length - 1);
  /* O viewBox acompanha a largura real, para o texto do eixo ter sempre ~12px (no celular e no desktop). */
  const caixa = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(640);
  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(260, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = Math.round(Math.min(320, Math.max(220, W * 0.6)));
  const todos = [...serie.flatMap((p) => [p.y, p.min ?? p.y, p.max ?? p.y]), ...(comparacao ?? []).map((p) => p.y), ...(meta != null ? [meta] : [])];
  let yMin = Math.min(...todos), yMax = Math.max(...todos);
  const folga = Math.max(1, (yMax - yMin) * 0.12);
  yMin = Math.floor(yMin - folga); yMax = Math.ceil(yMax + folga);
  const xMax = serie[serie.length - 1].x || 1;
  const sx = (x: number) => M.l + (x / xMax) * (W - M.l - M.r);
  const sy = (y: number) => M.t + ((yMax - y) / (yMax - yMin)) * (H - M.t - M.b);
  const linha = (pts: SeriePonto[]) => pts.map((p, i) => `${i ? "L" : "M"}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join("");
  const faixa = serie.some((p) => p.min != null)
    ? serie.map((p, i) => `${i ? "L" : "M"}${sx(p.x).toFixed(1)},${sy(p.max ?? p.y).toFixed(1)}`).join("") +
      [...serie].reverse().map((p) => `L${sx(p.x).toFixed(1)},${sy(p.min ?? p.y).toFixed(1)}`).join("") + "Z"
    : null;
  const passoY = (yMax - yMin) > 24 ? 10 : (yMax - yMin) > 10 ? 5 : 2;
  const ticksY: number[] = [];
  for (let v = Math.ceil(yMin / passoY) * passoY; v <= yMax; v += passoY) ticksY.push(v);
  const yEm = (x: number, pts: SeriePonto[]) => {
    const i = pts.findIndex((p) => p.x >= x);
    if (i <= 0) return pts[0].y;
    const a = pts[i - 1], b = pts[i];
    return a.y + ((x - a.x) / (b.x - a.x)) * (b.y - a.y);
  };
  const m = marcos[Math.min(ativo, marcos.length - 1)];
  /*
   * Rótulos do eixo que cabem. Com 12 meses no eixo, "Hoje", "4 sem", "8 sem"
   * e "12 sem" ficam a poucos pixels e se sobrepunham. Um rótulo só aparece
   * se tem ~7px por letra de distância do último desenhado; o último marco
   * sempre aparece. Os botões embaixo continuam dando acesso a todos.
   */
  const rotulosVisiveis = new Set<number>();
  {
    let ultimoFim = -Infinity;
    const larg = (i: number) => marcos[i].rotulo.length * 7;
    const inicio = (i: number) => (i === 0 ? sx(marcos[i].x) : i === marcos.length - 1 ? sx(marcos[i].x) - larg(i) : sx(marcos[i].x) - larg(i) / 2);
    const ultimo = marcos.length - 1;
    for (let i = 0; i < marcos.length; i++) {
      const cabeAntesDoUltimo = i === ultimo || inicio(i) + larg(i) + 8 <= inicio(ultimo);
      if (inicio(i) >= ultimoFim + 8 && cabeAntesDoUltimo) { rotulosVisiveis.add(i); ultimoFim = inicio(i) + larg(i); }
    }
    rotulosVisiveis.add(ultimo);
  }

  return (
    <figure className="m-0">
      <div ref={caixa}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none" role="img" aria-label={descricao}>
        {ticksY.map((v) => (
          <g key={v}>
            <line x1={M.l} x2={W - M.r} y1={sy(v)} y2={sy(v)} stroke="rgba(255,255,255,0.08)" />
            <text x={M.l - 8} y={sy(v) + 4} textAnchor="end" fontSize="12" fill="#9ca3af">{v}</text>
          </g>
        ))}
        {faixa && <path d={faixa} fill={DOURADO} opacity="0.14" />}
        {meta != null && (
          <g>
            <line x1={M.l} x2={W - M.r} y1={sy(meta)} y2={sy(meta)} stroke="#e5e7eb" strokeDasharray="2 5" />
            <text x={W - M.r} y={sy(meta) - 6} textAnchor="end" fontSize="12" fill="#e5e7eb">meta</text>
          </g>
        )}
        {comparacao && <path d={linha(comparacao)} fill="none" stroke="#9ca3af" strokeWidth="2" strokeDasharray="6 5" />}
        <path d={linha(serie)} fill="none" stroke={DOURADO} strokeWidth="3" strokeLinejoin="round" />
        {marcos.map((mc, i) => (
          <g key={mc.x}>
            {rotulosVisiveis.has(i) && <text x={sx(mc.x)} y={H - 12} textAnchor={i === 0 ? "start" : i === marcos.length - 1 ? "end" : "middle"} fontSize="12" fill={i === ativo ? "#fff" : "#9ca3af"}>{mc.rotulo}</text>}
            <circle cx={sx(mc.x)} cy={sy(yEm(mc.x, serie))} r={i === ativo ? 7 : 5} fill={i === ativo ? "#fff" : DOURADO} stroke="#000" strokeWidth="2" />
            {/* Área de toque generosa, invisível. */}
            <rect x={sx(mc.x) - 22} y={M.t} width="44" height={H - M.t} fill="transparent" style={{ cursor: "pointer" }}
              onClick={() => setAtivo(i)} aria-hidden="true" />
          </g>
        ))}
      </svg>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2" role="group" aria-label="Marcos da trajetória">
        {marcos.map((mc, i) => (
          <button key={mc.x} type="button" onClick={() => setAtivo(i)} aria-pressed={i === ativo}
            className={`px-2.5 min-h-[40px] text-xs border transition-colors ${i === ativo ? "border-white text-white" : "border-white/15 text-gray-400"}`}>{mc.rotulo}</button>
        ))}
      </div>
      <figcaption className="mt-3 text-sm text-gray-300" aria-live="polite">
        <span className="text-white font-semibold">{formataX(m.x)}:</span> {rotuloSerie} {formataY(yEm(m.x, serie))}
        {comparacao && rotuloComparacao && <> · {rotuloComparacao} {formataY(yEm(m.x, comparacao))}</>}
      </figcaption>
      <div className="sr-only"><table>
        <caption>{descricao}</caption>
        <thead><tr><th scope="col">Quando</th><th scope="col">{rotuloSerie}</th>{comparacao && <th scope="col">{rotuloComparacao}</th>}</tr></thead>
        <tbody>
          {marcos.map((mc) => (
            <tr key={mc.x}><th scope="row">{formataX(mc.x)}</th><td>{formataY(yEm(mc.x, serie))}</td>{comparacao && <td>{formataY(yEm(mc.x, comparacao))}</td>}</tr>
          ))}
        </tbody>
      </table></div>
    </figure>
  );
}
