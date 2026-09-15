"use client";

import { trackEvent } from "@/lib/analytics";
import { FONTES } from "@/lib/concentracao/fontes";

/**
 * "Como fazemos os cálculos" e "Fontes", com medição de abertura.
 *
 * O conteúdo fica no HTML desde o primeiro byte (details/summary), como o
 * FAQ do site. O clique numa fonte registra qual fonte foi aberta — é
 * conteúdo nosso, não dado de quem leu.
 */
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

export default function MetodologiaEFontes({ placement }: { placement: string }) {
  return (
    <div className="space-y-6">
      <details className="border border-white/15 p-5 sm:p-6" onToggle={(e) => { if ((e.currentTarget as HTMLDetailsElement).open) trackEvent("methodology_open", { placement }); }}>
        <summary className="cursor-pointer list-none min-h-[44px] flex items-center justify-between gap-3">
          <span className="text-white font-bold text-xl" style={h}>Como fazemos os cálculos</span>
          <span aria-hidden="true" className="text-[#BA9E50] text-2xl leading-none">+</span>
        </summary>
        <div className="mt-4 space-y-4 text-gray-300 leading-relaxed">
          <div className="border border-white/10 bg-black/40 p-4 font-mono text-sm text-gray-200 leading-relaxed">
            concentração (mg/mL) = quantidade total (mg) ÷ volume final (mL)<br />
            volume (mL) = marca U-100 ÷ 100<br />
            quantidade contida (mg) = concentração (mg/mL) × volume (mL)
          </div>
          <p className="leading-relaxed mb-3">
            Só isso. Não existe quarta fórmula. A ferramenta nunca recebe uma quantidade desejada e devolve uma marca de seringa: esse caminho inverso é deliberadamente ausente do código, e um teste automatizado reprova o projeto se ele aparecer.
          </p>
          <p className="leading-relaxed mb-3">
            A conferência de instrução compara a quantidade informada com a quantidade contida na marca informada, com tolerância de 2% para absorver arredondamento. Quando não bate, a ferramenta diz que não bate e manda confirmar com o prescritor ou farmacêutico. Ela não sugere a marca “certa”.
          </p>
          <p className="leading-relaxed">
            Todo cálculo acontece no seu navegador. Nenhum valor digitado é enviado, armazenado ou registrado em analytics.
          </p>
        </div>
      </details>

      <div>
        <h3 className="text-white font-bold text-xl mb-3" style={h}>Fontes</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">Cada fonte sustenta uma afirmação específica da página. Só agência reguladora, ISMP e norma técnica: nada de fórum, rede social ou vendedor.</p>
        <ol className="space-y-4">
          {FONTES.map((f, i) => (
            <li key={f.id} className="text-sm leading-relaxed">
              <p className="text-gray-200">
                <span className="text-gray-500 mr-2">{i + 1}.</span>
                <a href={f.url} target="_blank" rel="noopener noreferrer" className={ln} onClick={() => trackEvent("source_open", { placement, fonte: f.id })}>{f.titulo}</a>
                <span className="text-gray-400"> — {f.orgao}, {f.ano}.</span>
              </p>
              <p className="text-gray-400 mt-1">Sustenta: {f.sustenta}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
