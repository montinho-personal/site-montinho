"use client";

import { trackEvent } from "@/lib/analytics";

/**
 * Botão que abre o WhatsApp para a revisão de execução.
 *
 * Client component apenas por causa do evento de clique — é uma âncora
 * comum, funciona sem JavaScript e não causa layout shift.
 *
 * O evento se chama "click": o site sabe que a pessoa abriu o WhatsApp, e
 * nada além disso. Registrar "vídeo enviado" aqui seria métrica falsa —
 * o envio acontece dentro do WhatsApp, fora do nosso alcance.
 */
export default function RevisaoCTA({
  href,
  source,
  label = "Quero minha revisão gratuita",
  articleSlug,
}: {
  href: string;
  /** Onde na página o botão está: hero, como_funciona, final, artigo. */
  source: string;
  label?: string;
  articleSlug?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackEvent("execution_review_whatsapp_click", {
          review_source: source,
          article_slug: articleSlug,
        })
      }
      className="inline-flex items-center justify-center bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-colors min-h-[56px] w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BA9E50]"
    >
      {label} <span aria-hidden="true">&nbsp;→</span>
    </a>
  );
}
