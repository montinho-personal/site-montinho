"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import type { FerramentaCatalogo } from "@/lib/ferramentas/catalogo";
import IconeFerramenta from "./IconeFerramenta";

/**
 * O card compacto da central.
 *
 * Responde, nesta ordem e sem parágrafo: o que é (nome), o que eu descubro
 * (resultado), quanto custa em esforço (tempo · grátis) e onde clico
 * (ação). O card inteiro é clicável, mas existe UM link só — o nome —,
 * esticado sobre o card. Dois links para a mesma URL seriam duas paradas
 * de tabulação para a mesma coisa. A ação é texto decorativo do mesmo
 * clique; o leitor de tela ouve o nome da ferramenta, que é a âncora que
 * o Google também lê.
 */
export default function CardFerramenta({
  f,
  posicao,
  secao,
  destaque = false,
}: {
  f: FerramentaCatalogo;
  /** Posição dentro da seção, começando em 1 — vai para o analytics. */
  posicao: number;
  secao: string;
  /** Só na seção "mais usadas": o filete dourado no topo. */
  destaque?: boolean;
}) {
  return (
    <article
      className={`group relative flex flex-col border bg-white/[0.02] p-4 sm:p-5 transition-colors hover:border-white/40 focus-within:border-[#BA9E50] ${
        destaque ? "border-white/25" : "border-white/15"
      }`}
      data-testid="card-ferramenta"
      data-ferramenta={f.id}
    >
      {destaque && <div className="absolute top-0 left-0 h-[2px] w-12" style={{ background: "#BA9E50" }} aria-hidden="true" />}
      <div className="flex items-start gap-3">
        <span className="shrink-0 w-10 h-10 flex items-center justify-center border border-white/15 text-gray-200 group-hover:text-white transition-colors" aria-hidden="true">
          <IconeFerramenta id={f.icone} className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-white font-semibold leading-snug text-[15px] sm:text-base">
            <Link
              href={f.href}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
              onClick={() => trackEvent("tool_card_click", { tool_name: f.id, category: f.categoria, position: posicao, section: secao })}
            >
              {f.nome}
            </Link>
            {f.selo === "novo" && (
              <span className="ml-2 align-middle text-[10px] font-semibold tracking-[0.15em] uppercase px-1.5 py-0.5 border" style={{ color: "#BA9E50", borderColor: "rgba(186,158,80,.5)" }}>
                Novo
              </span>
            )}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mt-1">{f.resultado}</p>
        </div>
      </div>
      <div className="mt-auto pt-3 flex items-center justify-between gap-3 text-xs">
        <span className="text-gray-500">{f.tempo} · Grátis</span>
        <span className="text-white font-semibold whitespace-nowrap group-hover:underline underline-offset-4 decoration-1" style={{ textDecorationColor: "#BA9E50" }} aria-hidden="true">
          {f.acao} →
        </span>
      </div>
    </article>
  );
}
