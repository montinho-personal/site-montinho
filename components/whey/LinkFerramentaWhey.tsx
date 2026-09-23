"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * Convite para a Calculadora de Whey nos artigos que falam de whey
 * sem que "quanto eu tomo?" seja a pergunta principal — e no de
 * Mounjaro, onde uma calculadora de dose no meio do texto pareceria
 * recomendação combinada com o remédio.
 */
export default function LinkFerramentaWhey({ slug }: { slug: string }) {
  const placement = `link-${slug}`;
  return (
    <div className="mt-12 border border-white/15 p-5 sm:p-6" data-testid="link-whey">
      <p className="text-white font-semibold mb-1.5">Quanto whey você precisa por dia?</p>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        A conta parte da sua meta de proteína e do que você já come, e usa o rótulo do seu whey — não um scoop padrão. Mostra também quanto o pacote dura e o custo por proteína.
      </p>
      <Link
        href="/ferramentas/calculadora-whey"
        onClick={() => trackEvent("whey_internal_link", { placement, calculator_section: "article_link" })}
        className="inline-flex items-center text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
        style={{ textDecorationColor: "#BA9E50" }}
      >
        Abrir a Calculadora de Whey →
      </Link>
    </div>
  );
}
