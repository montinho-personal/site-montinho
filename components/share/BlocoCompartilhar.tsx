"use client";

/**
 * Bloco de convite ao compartilhamento. Usado no fim do artigo e depois de
 * uma resposta direta. É de propósito pequeno: uma pergunta curta e dois
 * botões. Caixa grande no fim de artigo compete com o CTA de conversão, e
 * quem lê até o fim é justamente quem vale a pena convidar para conversar.
 */

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import Compartilhar from "./Compartilhar";
import { convite, urlCompartilhada, type ContextoShare, type LocalShare } from "@/lib/share/mensagens";

interface Props {
  contexto: ContextoShare;
  titulo: string;
  caminho: string;
  local: LocalShare;
  /** Substitui a pergunta de abertura quando o contexto pede outra coisa. */
  pergunta?: string;
  className?: string;
}

export default function BlocoCompartilhar({ contexto, titulo, caminho, local, pergunta, className = "" }: Props) {
  const [copiado, setCopiado] = useState(false);

  async function copiarLink() {
    const url = urlCompartilhada(caminho, "copy_link", contexto);
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(url); ok = true; }
    } catch { ok = false; }
    if (ok) {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2400);
      trackEvent("share_copy_link", { page_type: contexto, content_type: contexto, share_location: local, share_method: "copy_link" });
    }
  }

  return (
    <div className={`border border-white/10 bg-white/[0.02] px-5 py-4 sm:px-6 sm:py-5 ${className}`}>
      <p className="text-sm text-gray-300 mb-3">{pergunta ?? convite(contexto, caminho)}</p>
      <div className="flex flex-wrap items-center gap-3">
        <Compartilhar
          contexto={contexto}
          titulo={titulo}
          caminho={caminho}
          local={local}
          aparencia="solido"
          rotulo={contexto === "article" ? "Enviar para alguém" : undefined}
        />
        <button
          type="button"
          onClick={copiarLink}
          className="text-sm text-gray-400 hover:text-white underline-offset-4 hover:underline min-h-[44px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50]"
        >
          Copiar link
        </button>
        <span aria-live="polite" className={copiado ? "text-xs text-[#BA9E50]" : "sr-only"}>
          {copiado ? "Link copiado" : ""}
        </span>
      </div>
    </div>
  );
}
