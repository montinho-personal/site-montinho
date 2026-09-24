"use client";

/**
 * Peças reutilizáveis dos Simuladores Montinho.
 *
 * O Simulador de Emagrecimento é o primeiro de uma família. O que é da
 * experiência (progresso, pergunta, opções em cartão, campo numérico,
 * seletor de cenário, insight, metodologia) mora aqui; o que é do assunto
 * mora no componente do simulador. Um simulador novo reusa isto e escreve
 * só o motor e as perguntas.
 */

import { useId, type ReactNode } from "react";

export const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
export const DOURADO = "#BA9E50";

export function ProgressBar({ passo, total }: { passo: number; total: number }) {
  return (
    <div className="mb-6">
      <p className="text-gray-400 text-xs mb-2 tabular-nums" aria-live="polite">{passo} de {total}</p>
      <div className="h-1 bg-white/10" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={passo} aria-label="Progresso do simulador">
        <div className="h-1 transition-all duration-300" style={{ width: `${(passo / total) * 100}%`, background: DOURADO }} />
      </div>
    </div>
  );
}

export function QuestionStep({ titulo, ajuda, children, tituloRef }: { titulo: string; ajuda?: ReactNode; children: ReactNode; tituloRef?: React.Ref<HTMLHeadingElement> }) {
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">{titulo}</legend>
      <h2 ref={tituloRef} tabIndex={-1} className="text-2xl sm:text-3xl font-bold text-white mb-2 outline-none" style={h}>{titulo}</h2>
      {ajuda && <p className="text-gray-400 text-sm leading-relaxed mb-5">{ajuda}</p>}
      <div className={ajuda ? "" : "mt-5"}>{children}</div>
    </fieldset>
  );
}

export interface Opcao<T extends string | number> { valor: T; rotulo: string; detalhe?: string }

/**
 * `colunas` vale a partir de 640px; no celular, 3 e 4 colunas viram 2 — é
 * onde "Musculação" e "Combinação" estouravam o cartão. Palavras nunca
 * quebram no meio (break-words), e o cartão pode encolher (min-w-0).
 */
const GRID: Record<1 | 2 | 3 | 4, string> = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-2 sm:grid-cols-3", 4: "grid-cols-4" };
const cartao = (sel: boolean) =>
  `text-left border px-3 sm:px-4 py-3 min-h-[52px] min-w-0 break-words transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BA9E50] ${sel ? "border-[#BA9E50] bg-[#BA9E50]/10 text-white" : "border-white/20 text-gray-200 hover:border-white/50"}`;

export function OptionCards<T extends string | number>({ nome, opcoes, valor, onChange, colunas = 1 }: {
  nome: string; opcoes: Opcao<T>[]; valor: T | null; onChange: (v: T) => void; colunas?: 1 | 2 | 3 | 4;
}) {
  return (
    <div role="radiogroup" aria-label={nome} className={`grid ${GRID[colunas]} gap-2`}>
      {opcoes.map((o) => {
        const sel = valor === o.valor;
        return (
          <button key={String(o.valor)} type="button" role="radio" aria-checked={sel} onClick={() => onChange(o.valor)} className={cartao(sel)}>
            <span className="font-semibold block">{o.rotulo}</span>
            {o.detalhe && <span className="text-gray-400 text-xs block mt-0.5">{o.detalhe}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Mesma aparência, várias respostas: cada cartão é uma checkbox. */
export function MultiOptionCards<T extends string>({ nome, opcoes, valores, onChange, colunas = 1 }: {
  nome: string; opcoes: Opcao<T>[]; valores: T[]; onChange: (v: T[]) => void; colunas?: 1 | 2 | 3 | 4;
}) {
  return (
    <div role="group" aria-label={nome} className={`grid ${GRID[colunas]} gap-2`}>
      {opcoes.map((o) => {
        const sel = valores.includes(o.valor);
        return (
          <button key={o.valor} type="button" role="checkbox" aria-checked={sel}
            onClick={() => onChange(sel ? valores.filter((v) => v !== o.valor) : [...valores, o.valor])} className={cartao(sel)}>
            <span className="font-semibold block">{sel && <span aria-hidden="true" className="mr-1.5" style={{ color: DOURADO }}>✓</span>}{o.rotulo}</span>
            {o.detalhe && <span className="text-gray-400 text-xs block mt-0.5">{o.detalhe}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function NumericInput({ rotulo, valor, onChange, sufixo, erro, placeholder, ajuda, onEnter, autoFocus }: {
  rotulo: string; valor: string; onChange: (v: string) => void; sufixo?: string; erro?: string | null; placeholder?: string; ajuda?: string; onEnter?: () => void; autoFocus?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-white text-sm font-semibold mb-1.5">{rotulo}</label>
      <div className="flex items-stretch">
        <input id={id} type="text" inputMode="decimal" autoComplete="off" value={valor} placeholder={placeholder} autoFocus={autoFocus}
          aria-invalid={!!erro} aria-describedby={erro ? `${id}-e` : ajuda ? `${id}-a` : undefined}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && onEnter) { e.preventDefault(); onEnter(); } }}
          className={`w-full min-w-0 bg-black border ${erro ? "border-red-400" : "border-white/25"} focus:border-[#BA9E50] text-white text-xl font-bold px-4 py-3 outline-none transition-colors`} />
        {sufixo && <span className="border border-l-0 border-white/25 text-gray-400 px-3 flex items-center text-sm">{sufixo}</span>}
      </div>
      {ajuda && !erro && <p id={`${id}-a`} className="text-gray-500 text-xs mt-1.5">{ajuda}</p>}
      {erro && <p id={`${id}-e`} role="alert" className="text-red-300 text-sm mt-1.5">{erro}</p>}
    </div>
  );
}

/** Seletor segmentado de cenário: poucos valores, um toque, sem slider impreciso no celular. */
export function ScenarioSelector<T extends string | number>({ rotulo, opcoes, valor, onChange, atual }: {
  rotulo: string; opcoes: Opcao<T>[]; valor: T; onChange: (v: T) => void; atual?: T;
}) {
  return (
    <div>
      <p className="text-white text-sm font-semibold mb-2">{rotulo}</p>
      <div role="radiogroup" aria-label={rotulo} className="flex flex-wrap gap-1.5">
        {opcoes.map((o) => {
          const sel = valor === o.valor;
          return (
            <button key={String(o.valor)} type="button" role="radio" aria-checked={sel} onClick={() => onChange(o.valor)}
              className={`px-3 min-h-[44px] min-w-[52px] text-sm border transition-colors tabular-nums focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#BA9E50] ${sel ? "bg-white text-black border-white font-semibold" : "border-white/20 text-gray-300 hover:border-white/50"}`}>
              {o.rotulo}{atual === o.valor && <span className={`ml-1 text-[10px] uppercase tracking-wide ${sel ? "text-black/60" : "text-gray-500"}`}>hoje</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function InsightCard({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="border-l-2 pl-4 py-1" style={{ borderColor: DOURADO }}>
      <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-1" style={{ color: DOURADO }}>{titulo}</p>
      <div className="text-white leading-relaxed">{children}</div>
    </div>
  );
}

export function MethodologyDrawer({ aberto, onToggle, titulo, children }: { aberto: boolean; onToggle: () => void; titulo: string; children: ReactNode }) {
  const id = useId();
  return (
    <div className="border border-white/15">
      <button type="button" aria-expanded={aberto} aria-controls={id} onClick={onToggle}
        className="w-full text-left px-4 py-3 min-h-[52px] flex justify-between items-center text-white font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#BA9E50]">
        {titulo}<span aria-hidden="true" className="text-gray-400">{aberto ? "−" : "+"}</span>
      </button>
      {aberto && <div id={id} className="px-4 pb-4 text-gray-300 text-sm leading-relaxed space-y-3">{children}</div>}
    </div>
  );
}
