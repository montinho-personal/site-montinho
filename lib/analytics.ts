/**
 * Camada central de analytics — todos os eventos vão para o dataLayer
 * do Google Tag Manager. Nunca chamar gtag()/pixels diretamente aqui.
 */

export type AnalyticsEvent =
  | "click_whatsapp"
  | "click_phone"
  | "submit_form"
  | "generate_lead"
  | "view_pricing"
  | "scroll_75"
  | "engaged_time"
  | "article_read";

export interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Parâmetros comuns anexados a todo evento. */
function baseParams(): EventParams {
  return {
    page_location: window.location.href,
    page_title: document.title,
    pathname: window.location.pathname,
    timestamp: new Date().toISOString(),
    device_type: window.matchMedia("(max-width: 768px)").matches
      ? "mobile"
      : "desktop",
  };
}

/**
 * Helper central: empurra um evento tipado para o dataLayer do GTM.
 * Seguro em SSR (no-op fora do browser).
 */
export function trackEvent(event: AnalyticsEvent, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...baseParams(), ...params });
}

/** Dispara no máximo 1x por sessão (sessionStorage). */
export function trackOncePerSession(
  event: AnalyticsEvent,
  params: EventParams = {}
): void {
  if (typeof window === "undefined") return;
  const key = `mt_evt_${event}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    // sessionStorage indisponível (modo privado etc.) — dispara mesmo assim
  }
  trackEvent(event, params);
}
