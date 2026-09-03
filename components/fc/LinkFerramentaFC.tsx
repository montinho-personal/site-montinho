"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * Link contextual para a calculadora de zonas de frequência cardíaca.
 *
 * Vai nos artigos de cardio em que a dúvida do leitor é outra — emagrece?
 * antes ou depois da musculação? —, mas onde quem terminou de ler vai
 * treinar e precisa saber em que batimento ficar. A ferramenta inteira no
 * meio do texto atrapalharia; o link no fim pega exatamente quem vai calçar
 * o tênis.
 */
export default function LinkFerramentaFC({ slug }: { slug: string }) {
  return (
    <div className="mt-12 border border-white/15 p-5 sm:p-6">
      <p className="text-white font-semibold mb-1.5">
        Em que batimento você deveria treinar?
      </p>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        Informe sua idade e veja sua frequência cardíaca máxima estimada e as
        cinco zonas em batimentos por minuto, com o que cada uma serve.
      </p>
      <Link
        href="/ferramentas/zonas-de-frequencia-cardiaca"
        onClick={() => trackEvent("heart_rate_article_click", { placement: `link-${slug}` })}
        className="inline-flex items-center text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
        style={{ textDecorationColor: "#BA9E50" }}
      >
        Calcular minhas zonas →
      </Link>
    </div>
  );
}
