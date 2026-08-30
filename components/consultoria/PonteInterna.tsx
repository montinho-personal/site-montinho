"use client";

import Link from "next/link";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

/**
 * As duas únicas saídas da landing page — e o motivo de existirem.
 *
 * Esta página foi construída sem navegação de propósito: header e footer
 * ficam ocultos, e o único destino é o WhatsApp. É a decisão certa para
 * tráfego pago, onde cada saída é dinheiro que sai sem virar conversa.
 *
 * Mas ela também recebe tráfego orgânico, e aí a lógica se inverte: quem
 * chegou pelo Google ainda não confia, e obrigar essa pessoa a decidir sem
 * poder conferir a prova custa mais conversão do que a saída custa. Duas
 * saídas resolvem isso, e as duas levam para dentro do site, não para fora:
 * mais transformações e a história completa.
 *
 * Elas ficam sempre DEPOIS do CTA verde. Quem já se convenceu clica no botão
 * e nunca chega a ver o link.
 */
export default function PonteInterna({
  href,
  evento,
  texto,
  alinhamento = "center",
}: {
  href: string;
  evento: AnalyticsEvent;
  texto: string;
  alinhamento?: "center" | "left";
}) {
  return (
    <p className={`mt-5 ${alinhamento === "center" ? "text-center" : ""}`}>
      <Link
        href={href}
        onClick={() => trackEvent(evento, { placement: "consultoria-online" })}
        className="text-gray-400 hover:text-white text-sm underline underline-offset-4 decoration-1 decoration-white/25 transition-colors min-h-[44px] inline-flex items-center"
      >
        {texto} →
      </Link>
    </p>
  );
}
