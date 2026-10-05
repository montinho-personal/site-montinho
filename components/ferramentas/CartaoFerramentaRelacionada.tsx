"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { ARTIGOS_COM_CARTAO, CARTOES, HREF_POR_ARTIGO } from "@/lib/ferramentas/relacionadas";

/** Ver lib/ferramentas/relacionadas.ts. A âncora carrega o nome da ferramenta de propósito. */
export default function CartaoFerramentaRelacionada({ slug }: { slug: string }) {
  const id = ARTIGOS_COM_CARTAO[slug];
  if (!id) return null;
  const c = { ...CARTOES[id], ...HREF_POR_ARTIGO[slug] };
  return (
    <div className="mt-12 border border-white/15 p-5 sm:p-6">
      <p className="text-white font-semibold mb-1.5">{c.pergunta}</p>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">{c.texto}</p>
      <Link
        href={c.href}
        onClick={() => trackEvent("related_tool_click", { ferramenta: id, artigo: slug })}
        className="inline-flex items-center text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
        style={{ textDecorationColor: "#BA9E50" }}
      >
        {c.cta}
      </Link>
    </div>
  );
}
