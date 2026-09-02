"use client";

import { useEffect } from "react";
import { trackOncePerSession, type AnalyticsEvent } from "@/lib/analytics";

/**
 * Conta que a página foi vista, uma vez por sessão.
 *
 * POR QUE ISSO EXISTE
 *
 * Clique sozinho não diz nada. "40 cliques" é ótimo em 100 visitas e
 * péssimo em 5.000 — e sem o denominador não dá para saber qual dos dois
 * aconteceu. Páginas montadas no servidor não conseguem disparar evento
 * sozinhas, então elas montam este componente, que não renderiza nada.
 *
 * Não substitui o pageview do GA4: este evento é da SEÇÃO que queremos
 * medir, e é ele que fecha a conta de conversão do botão logo abaixo.
 */
export default function VistaMedida({ evento, params }: { evento: AnalyticsEvent; params?: Record<string, string> }) {
  useEffect(() => {
    trackOncePerSession(evento, params);
  }, [evento, params]);
  return null;
}
