"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * Convite para a Calculadora de Ciclo de Carboidratos nos artigos sobre
 * carb cycling e low carb: transformar a teoria numa semana prática.
 */
export default function LinkFerramentaCiclo({ slug }: { slug: string }) {
  return (
    <div className="mt-12 border border-white/15 p-5 sm:p-6" data-testid="link-ciclo">
      <p className="text-white font-semibold mb-1.5">Quer transformar a teoria numa semana prática?</p>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        Diga o que você treina em cada dia e a calculadora monta os dias de carbo alto, médio e baixo, com a média da semana preservada.
      </p>
      <Link
        href="/ferramentas/ciclo-de-carboidratos"
        onClick={() => trackEvent("carb_cycle_article_clicked", { placement: `link-${slug}` })}
        className="inline-flex items-center text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
        style={{ textDecorationColor: "#BA9E50" }}
      >
        Montar meu ciclo →
      </Link>
    </div>
  );
}
