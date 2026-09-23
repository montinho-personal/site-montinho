"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * Convite para a Calculadora de Creatina nos artigos que falam de creatina
 * sem que "quanto eu tomo?" seja a pergunta principal — e nos dois de
 * GLP-1, onde uma calculadora de dose no meio do texto pareceria
 * recomendação combinada com o remédio.
 */
export default function LinkFerramentaCreatina({ slug }: { slug: string }) {
  const placement = `link-${slug}`;
  return (
    <div className="mt-12 border border-white/15 p-5 sm:p-6" data-testid="link-creatina">
      <p className="text-white font-semibold mb-1.5">Quanto de creatina tomar por dia?</p>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        Informe seu peso e veja a referência do consenso científico, com ou sem saturação — e quanto tempo o seu pote dura.
      </p>
      <Link
        href="/ferramentas/calculadora-creatina"
        onClick={() => trackEvent("creatine_internal_link_click", { placement, calculator_section: "article_link" })}
        className="inline-flex items-center text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
        style={{ textDecorationColor: "#BA9E50" }}
      >
        Abrir a Calculadora de Creatina →
      </Link>
    </div>
  );
}
