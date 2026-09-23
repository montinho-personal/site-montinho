"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent, type AnalyticsEvent, type EventParams } from "@/lib/analytics";

/**
 * Um link que registra o clique. Existe para que as seções estáticas da
 * central (o caminho guiado, o fallback, o CTA comercial) continuem sendo
 * HTML de servidor e ainda assim contem no Analytics — o único JavaScript
 * é o onClick.
 */
export default function LinkRastreado({
  href,
  evento,
  params,
  className,
  children,
  externo = false,
}: {
  href: string;
  evento: AnalyticsEvent;
  params?: EventParams;
  className?: string;
  children: ReactNode;
  externo?: boolean;
}) {
  const registra = () => trackEvent(evento, params);
  if (externo) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={registra} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={registra} className={className}>
      {children}
    </Link>
  );
}
