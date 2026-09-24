/**
 * A linha do tempo das 12 semanas — a assinatura visual da ferramenta.
 *
 * 01 ● 02 ● 03 ● 04 ★ … 08 ★ … 12 ★. Os checkpoints levam a data real
 * (calculada no navegador, a partir de hoje) e o peso estimado da curva.
 * Serve também, no futuro, a um plano real de consultoria: é só trocar o
 * peso estimado pelo medido.
 */
import { DOURADO } from "./ui";

export interface MarcoTimeline { semana: number; data?: string; valor?: string }

export default function TwelveWeekTimeline({ marcos, feitos }: { marcos: MarcoTimeline[]; feitos?: number }) {
  const porSemana = new Map(marcos.map((m) => [m.semana, m]));
  return (
    <div data-testid="timeline-12">
      <ol className="grid grid-cols-6 sm:grid-cols-12 gap-1.5" aria-label="As 12 semanas">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((s) => {
          const cp = s % 4 === 0;
          return (
            <li key={s} className={`flex flex-col items-center justify-center border min-h-[52px] ${cp ? "border-[#BA9E50] bg-[#BA9E50]/10" : "border-white/15"}`}>
              <span className="text-[11px] text-gray-400 tabular-nums">{String(s).padStart(2, "0")}</span>
              <span aria-hidden="true" style={{ color: cp ? DOURADO : "#6b7280" }}>{cp ? "★" : "●"}</span>
              <span className="sr-only">{cp ? (s === 12 ? "resultado" : "checkpoint") : "semana"}</span>
            </li>
          );
        })}
      </ol>
      <ol className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3" aria-label="Checkpoints">
        {[0, 4, 8, 12].map((s) => {
          const m = porSemana.get(s);
          return (
            <li key={s} className={`border p-3 ${s === 12 ? "border-[#BA9E50]" : "border-white/15"}`}>
              <p className="text-[11px] uppercase tracking-wide" style={{ color: s === 0 ? "#9ca3af" : DOURADO }}>{s === 0 ? "Hoje" : s === 12 ? "Semana 12 · resultado" : `Semana ${s} · checkpoint`}</p>
              {m?.data && <p className="text-gray-300 text-sm">{m.data}</p>}
              {m?.valor && <p className="text-white font-bold tabular-nums">{m.valor}</p>}
            </li>
          );
        })}
      </ol>
      {feitos !== undefined && <p className="text-gray-400 text-xs mt-2">{feitos} treinos feitos ao longo do caminho, neste cenário.</p>}
    </div>
  );
}
