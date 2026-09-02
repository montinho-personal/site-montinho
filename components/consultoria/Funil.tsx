"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { trackOncePerSession, type AnalyticsEvent } from "@/lib/analytics";

/**
 * O funil da página de Consultoria Online.
 *
 * POR QUE ETAPA VISTA, E NÃO PORCENTAGEM DE ROLAGEM
 *
 * "Rolou 50%" muda de significado toda vez que a página muda de tamanho:
 * acrescente uma seção e o mesmo 50% passa a apontar para outro conteúdo.
 * Comparar a conversão antes e depois de uma alteração fica impossível —
 * justamente quando comparar é o objetivo.
 *
 * "Viu a prova social" continua querendo dizer a mesma coisa daqui a um ano.
 * Por isso o funil aqui é medido por etapa, e não por pixel.
 *
 * O QUE ESTES EVENTOS NÃO FAZEM
 *
 * Não repetem o que já existe. O clique no WhatsApp já é capturado
 * globalmente por `click_whatsapp`, com delegação no document, e a rolagem
 * de 75% por `scroll_75`. Duplicar qualquer um dos dois inflaria a contagem
 * e quebraria a comparação com o resto do site.
 */

/**
 * Marca uma etapa quando a seção cruza o meio da tela.
 *
 * A primeira versão usava `threshold: 0.4` — "40% da seção visível" —, e a
 * etapa da prova social NUNCA disparava. O motivo é aritmético e vale
 * registrar: aquela seção tem 2.295 px e a tela do celular tem 844. Só 37%
 * dela cabe na tela de uma vez, então 40% visível era impossível de
 * alcançar. O evento não estava com bug: estava proibido de acontecer.
 *
 * A `rootMargin` negativa resolve para qualquer tamanho. Ela encolhe a área
 * de observação para a faixa central da tela, e o evento dispara quando a
 * seção cruza essa faixa — critério que independe de a seção ser maior ou
 * menor que o aparelho, que é justamente o que muda entre celular e desktop.
 */
export default function Etapa({ evento, children }: { evento: AnalyticsEvent; children: ReactNode }) {
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          trackOncePerSession(evento, { placement: "consultoria-online" });
          obs.disconnect();
        }
      },
      { threshold: 0, rootMargin: "-35% 0px -35% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [evento]);

  return <div ref={raiz}>{children}</div>;
}

/**
 * Entrada no funil.
 *
 * Separado do pageview do GA4 de propósito: o pageview conta acesso, este
 * conta entrada NESTE funil — e é contra ele que as etapas seguintes são
 * comparadas para descobrir onde a pessoa desiste.
 */
export function VistaDaPagina() {
  useEffect(() => {
    trackOncePerSession("consultoria_view", { placement: "consultoria-online" });
  }, []);
  return null;
}
