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
  | "article_read"
  // Diagnóstico Montinho (funil da ferramenta /diagnostico)
  | "diagnostic_view"
  | "diagnostic_start"
  | "diagnostic_progress_25"
  | "diagnostic_progress_50"
  | "diagnostic_progress_75"
  | "diagnostic_complete"
  | "diagnostic_result_view"
  | "diagnostic_whatsapp_click"
  | "diagnostic_article_click"
  | "diagnostic_service_click"
  // Pergunte ao Montinho (nunca enviar o texto da pergunta — só categorias)
  | "ask_montinho_view"
  | "ask_montinho_start"
  | "ask_montinho_question"
  | "ask_montinho_answer"
  | "ask_montinho_source_click"
  | "ask_montinho_followup"
  | "ask_montinho_diagnostic_click"
  | "ask_montinho_service_click"
  | "ask_montinho_whatsapp_click"
  | "ask_montinho_no_answer"
  | "ask_montinho_error"

  /**
   * Fontes preferidas do Google. Só existem dois eventos, e a ausência de um
   * terceiro é deliberada: o site NÃO recebe confirmação de que a pessoa
   * concluiu a seleção do lado do Google. Um evento chamado
   * "preferred_source_added" seria dado inventado.
   */
  | "preferred_source_cta_view"
  | "preferred_source_cta_interaction"
  | "ask_montinho_feedback_positive"
  | "ask_montinho_feedback_negative"
  | "ask_montinho_embed_submit"

  // CTAs contextuais nos artigos
  | "contextual_cta_view"
  | "contextual_cta_click"

  // Treino Para Minha Rotina
  | "routine_tool_view"
  | "routine_tool_start"
  | "routine_tool_progress_50"
  | "routine_tool_complete"
  | "routine_result_view"
  | "routine_plan_b_view"
  | "routine_schedule_commit"
  | "routine_article_click"
  | "routine_diagnostic_click"
  | "routine_ask_click"
  | "routine_service_click"
  | "routine_whatsapp_click"

  // Revisão Gratuita de Execução
  | "execution_review_view"
  | "execution_review_whatsapp_click"
  | "execution_review_article_cta_view"

  // Academia Ideal em Alphaville
  | "gym_finder_view"
  | "gym_finder_start"
  | "gym_finder_complete"
  | "gym_result_click"
  | "gym_routine_tool_click"
  | "gym_personal_click";

export interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
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
 * Helper central de eventos. Envia por dois caminhos:
 * 1. dataLayer.push({event: ...}) — para triggers de evento personalizado no GTM
 *    (Google Ads, Meta, Clarity etc. configurados no painel)
 * 2. gtag('event', ...) — envio direto ao GA4 (G-J1ZSPMDJZE), sem depender
 *    de tags manuais no GTM. ATENÇÃO: se um dia os mesmos eventos forem
 *    configurados como tags GA4 dentro do GTM, remover o caminho 2 para
 *    evitar contagem dupla no GA4.
 * Seguro em SSR (no-op fora do browser).
 */
export function trackEvent(event: AnalyticsEvent, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  const payload = { ...baseParams(), ...params };

  // Caminho 1 — GTM (triggers de evento personalizado)
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });

  // Caminho 2 — GA4 direto via Google Tag API.
  // Se gtag ainda não foi definido pelo snippet (clique muito cedo),
  // definimos a fila padrão — o gtag.js processa ao carregar.
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments as unknown as Record<string, unknown>);
    };
  }
  // send_to garante que o evento vá apenas para a propriedade GA4.
  window.gtag("event", event, { ...payload, send_to: "G-J1ZSPMDJZE" });
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
