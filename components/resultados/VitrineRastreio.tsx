"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Casca da vitrine: mede a visualização da seção (uma vez, quando metade
 * dela aparece) e os cliques nos links marcados com data-vitrine-acao.
 * O conteúdo vem do servidor como children; aqui só entra o rastreio.
 */
export default function VitrineRastreio({
  pagina,
  children,
  className,
  style,
  ariaLabelledby,
}: {
  pagina: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  ariaLabelledby?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          trackEvent("vitrine_view", { pagina });
          io.disconnect();
        }
      },
      // A seção é mais alta que a tela no celular: conta quando o topo dela
      // passa da parte de cima da tela, não quando um quarto dela aparece.
      { threshold: 0, rootMargin: "0px 0px -40% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pagina]);

  return (
    <section
      ref={ref}
      className={className}
      style={style}
      aria-labelledby={ariaLabelledby}
      onClick={(e) => {
        const alvo = (e.target as HTMLElement).closest<HTMLElement>("[data-vitrine-acao]");
        // Só conta clique em link de verdade (o CTA pode vir embrulhado num div).
        if (!alvo || !(e.target as HTMLElement).closest("a")) return;
        const acao = alvo.dataset.vitrineAcao;
        if (acao === "resultados") trackEvent("vitrine_resultados_click", { pagina });
        if (acao === "cta") trackEvent("vitrine_cta_click", { pagina });
      }}
    >
      {children}
    </section>
  );
}
