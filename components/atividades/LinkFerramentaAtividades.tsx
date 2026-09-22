"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { atividadeDoArtigo } from "@/lib/atividades";

/**
 * Convite para a Calculadora de Calorias por Atividade nos artigos que
 * ainda não recebem o embed (impressão perto de zero hoje).
 *
 * O link é obrigatório pelo motivo que lib/ferramentas/canonica.ts
 * documenta, e a âncora carrega o nome da ferramenta de propósito.
 */
export default function LinkFerramentaAtividades({ slug }: { slug: string }) {
  const a = atividadeDoArtigo(slug);
  return (
    <div className="mt-12 border border-white/15 p-5 sm:p-6">
      <p className="text-white font-semibold mb-1.5">
        Quantas calorias {a ? `o seu ${a.nome.toLowerCase()} gasta` : "a sua atividade gasta"}?
      </p>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        A conta muda bastante com o peso e o ritmo. Informe os seus para ver o gasto da sessão — e comparar com as
        outras atividades no mesmo tempo.
      </p>
      <Link
        href="/ferramentas/calculadora-calorias-atividades"
        onClick={() => trackEvent("activity_tool_click", { placement: `link-${slug}` })}
        className="inline-flex items-center text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
        style={{ textDecorationColor: "#BA9E50" }}
      >
        Abrir a Calculadora de Calorias por Atividade →
      </Link>
    </div>
  );
}
