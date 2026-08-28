"use client";

import { useEffect } from "react";
import { trackOncePerSession } from "@/lib/analytics";

/**
 * O único JavaScript das páginas /comece: registrar que a página foi vista.
 * As LPs são de convencimento, não de interação — todo o resto é HTML puro,
 * e os cliques nos passos o GA4 já enxerga como navegação.
 */
export default function RastreioComece({ pagina }: { pagina: string }) {
  useEffect(() => {
    trackOncePerSession("comece_view", { pagina });
  }, [pagina]);
  return null;
}
