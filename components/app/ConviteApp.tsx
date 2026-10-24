"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { AVISO_SO_APP, LINK_APP, OFERTA_APP, TEXTO_CONVITE_APP } from "@/lib/app-convite";

/**
 * Cartão do convite do app (30 dias grátis), depois do valor entregue.
 *
 * Fica FORA do bloco de próximo passo das ferramentas (PosResultado): aquele
 * bloco está num teste A/B de pergunta com destino fixo, e mudar o destino
 * ali dentro estragaria o teste. Aqui é uma oferta discreta, logo abaixo.
 */
interface Props {
  variante: keyof typeof TEXTO_CONVITE_APP;
  /** Onde o cartão está (ex.: "ferramenta-onerm", "artigo-progressao-de-carga"). */
  onde: string;
}

export default function ConviteApp({ variante, onde }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { titulo, texto } = TEXTO_CONVITE_APP[variante];

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          trackEvent("app_invite_view", { placement: onde });
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [onde]);

  return (
    <section
      ref={ref}
      data-testid="convite-app"
      aria-label="App do Montinho"
      className="relative border border-[#BA9E50]/40 bg-[#BA9E50]/[0.05] p-6 sm:p-7 mt-8"
    >
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        App do Montinho · {OFERTA_APP}
      </p>
      <p className="text-white font-bold text-lg sm:text-xl leading-snug mb-3" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
        {titulo}
      </p>
      <p className="text-gray-300 leading-relaxed mb-5 max-w-2xl">{texto}</p>
      <a
        href={LINK_APP}
        target="_blank"
        rel="noopener"
        onClick={() => trackEvent("app_invite_click", { placement: onde })}
        className="inline-flex items-center justify-center px-6 py-3.5 text-[15px] font-semibold min-h-[52px] rounded-md bg-[#BA9E50] text-black hover:bg-[#cdb267] transition-colors w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Testar o app grátis
      </a>
      <p className="text-gray-500 text-xs mt-3">{AVISO_SO_APP} Sem cartão.</p>
    </section>
  );
}
