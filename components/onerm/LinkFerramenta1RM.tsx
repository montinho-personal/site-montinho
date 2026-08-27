"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * Link contextual para a calculadora de 1RM.
 *
 * Vai nos artigos de técnica dos grandes exercícios, onde a dúvida do leitor
 * é como executar e não quanto carregar. A ferramenta inteira no meio do
 * texto atrapalharia a leitura; um link no fim pega exatamente quem terminou
 * de ler e agora quer saber a própria carga.
 */
export default function LinkFerramenta1RM({ slug }: { slug: string }) {
  return (
    <div className="mt-12 border border-white/15 p-5 sm:p-6">
      <p className="text-white font-semibold mb-1.5">
        Quer estimar sua carga máxima sem fazer um teste de 1RM?
      </p>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        Informe uma série que você já fez e veja o 1RM estimado, as cargas de
        cada intensidade e quais anilhas colocar na barra.
      </p>
      <Link
        href="/ferramentas/calculadora-1rm"
        onClick={() => trackEvent("one_rm_article_click", { placement: `link-${slug}` })}
        className="inline-flex items-center text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
        style={{ textDecorationColor: "#BA9E50" }}
      >
        Calcular meu 1RM →
      </Link>
    </div>
  );
}
