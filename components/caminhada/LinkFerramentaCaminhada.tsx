"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * Convite para a Calculadora de Calorias da Caminhada nos artigos que
 * respondem "emagrece?" em prosa — onde uma calculadora no meio do texto
 * trocaria a resposta por um formulário.
 *
 * O link é obrigatório pelo motivo que lib/ferramentas/canonica.ts
 * documenta: ferramenta sem caminho de link saindo dos artigos que já têm
 * autoridade não ranqueia nem pelo próprio nome. A âncora carrega o termo
 * de busca de propósito.
 */
export default function LinkFerramentaCaminhada({ slug }: { slug: string }) {
  const placement = `link-${slug}`;
  return (
    <div className="mt-12 border border-white/15 p-5 sm:p-6">
      <p className="text-white font-semibold mb-1.5">Quantas calorias a sua caminhada gasta?</p>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        A conta muda bastante com o peso e o ritmo. Informe os seus para ver o gasto por tempo, por distância ou
        por passos — e quanto tempo levaria para uma meta de calorias.
      </p>
      <Link
        href="/ferramentas/calculadora-calorias-caminhada"
        onClick={() => trackEvent("walking_tool_click", { placement })}
        className="inline-flex items-center text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
        style={{ textDecorationColor: "#BA9E50" }}
      >
        Abrir a Calculadora de Calorias da Caminhada →
      </Link>
    </div>
  );
}
