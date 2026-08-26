"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import type { CtaAction, CtaDefinition, CtaPosition } from "@/lib/cta/types";

/**
 * Bloco de CTA contextual.
 *
 * É client component só por causa do IntersectionObserver e do clique — o
 * markup inteiro vem no HTML estático, então funciona sem JavaScript e não
 * causa layout shift (nada é injetado depois da montagem).
 */

export interface ContextualCTAProps {
  cta: CtaDefinition;
  position: CtaPosition;
  articleSlug: string;
  articleCategory: string;
  cluster: string;
  stage: string;
}

const VARIANT_STYLES: Record<string, { wrap: string; accent: boolean }> = {
  // Informativo: discreto, não compete com o texto.
  light: { wrap: "border border-white/15 bg-white/[0.02]", accent: false },
  // Ferramenta: presença média, filete dourado.
  diagnostic: { wrap: "border border-white/20 bg-white/[0.04]", accent: true },
  // Comercial: mais peso visual, ainda dentro do design system.
  service: { wrap: "border border-white/25 bg-gradient-to-b from-white/[0.06] to-transparent", accent: true },
  // Local: mesmo peso do comercial; o que muda é a copy.
  local: { wrap: "border border-white/25 bg-gradient-to-b from-white/[0.06] to-transparent", accent: true },
};

export default function ContextualCTA({
  cta,
  position,
  articleSlug,
  articleCategory,
  cluster,
  stage,
}: ContextualCTAProps) {
  const ref = useRef<HTMLElement>(null);
  const seen = useRef(false);

  const params = {
    cta_id: cta.id,
    cta_type: cta.variant,
    cta_position: position,
    article_category: articleCategory,
    article_intent: stage,
    article_cluster: cluster,
  };

  // Impressão só quando o bloco realmente entra no viewport — carregar o HTML
  // não é ter visto.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !seen.current) {
            seen.current = true;
            trackEvent("contextual_cta_view", params);
            io.disconnect();
          }
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cta.id, position]);

  const onClick = (action: CtaAction, role: "primary" | "secondary") => {
    trackEvent("contextual_cta_click", {
      ...params,
      destination_type: action.destination,
      cta_role: role,
    });
    // Atribuição interna: sem query param, então nenhuma URL indexável nova
    // é criada e canonical/sitemap ficam intactos.
    try {
      sessionStorage.setItem(
        "mt_cta_origin",
        JSON.stringify({
          slug: articleSlug,
          cluster,
          stage,
          cta_id: cta.id,
          position,
        })
      );
    } catch {
      /* sem sessionStorage, a navegação segue normalmente */
    }
  };

  const style = VARIANT_STYLES[cta.variant] ?? VARIANT_STYLES.light;

  const renderAction = (action: CtaAction, role: "primary" | "secondary") => {
    const isPrimary = role === "primary";
    const cls = isPrimary
      ? "inline-flex items-center justify-center bg-white text-black px-6 py-3 text-sm font-semibold tracking-wide hover:bg-gray-100 transition-colors min-h-[48px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BA9E50]"
      : "inline-flex items-center text-sm text-gray-300 underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BA9E50]";

    if (action.external) {
      return (
        <a
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onClick(action, role)}
          className={cls}
        >
          {action.label}
          {isPrimary && <span aria-hidden="true"> →</span>}
        </a>
      );
    }
    return (
      <Link href={action.href} onClick={() => onClick(action, role)} className={cls}>
        {action.label}
        {isPrimary && <span aria-hidden="true"> →</span>}
      </Link>
    );
  };

  return (
    <aside
      ref={ref}
      // aside + label: leitores de tela anunciam como conteúdo complementar,
      // não como parte do artigo.
      aria-label="Sugestão de próximo passo"
      className={`${style.wrap} relative px-6 py-7 sm:px-8 sm:py-8 my-12`}
    >
      {style.accent && (
        <div
          className="absolute top-0 left-0 h-[2px] w-16"
          style={{ background: "#BA9E50" }}
          aria-hidden="true"
        />
      )}

      {cta.eyebrow && (
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
          {cta.eyebrow}
        </p>
      )}

      {/* <p><strong> em vez de heading: o CTA não deve poluir o outline
          de headings do artigo, que o Google usa para entender a estrutura. */}
      <p
        className="text-white font-bold text-lg sm:text-xl leading-snug mb-2"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        <strong className="font-bold">{cta.title}</strong>
      </p>

      <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
        {cta.body}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
        {renderAction(cta.primary, "primary")}
        {cta.secondary && renderAction(cta.secondary, "secondary")}
      </div>
    </aside>
  );
}
