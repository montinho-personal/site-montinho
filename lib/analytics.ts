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

  /**
   * Calculadora de proteína. Privacidade por desenho: o peso digitado e o
   * resultado NUNCA entram nos parâmetros — só o comportamento anônimo.
   */
  | "protein_calculator_view"
  | "protein_calculator_use"
  | "protein_meals_open"
  | "protein_food_examples_open"
  | "protein_article_click"
  | "protein_cta_click"

  /**
   * Calculadora de déficit calórico. Mesma regra de privacidade, e aqui ela
   * pesa mais: peso, altura, idade e sexo juntos são dados corporais
   * sensíveis. NADA disso — nem a TMB, nem o TDEE, nem a meta calculada —
   * entra em parâmetro de evento. Só o comportamento anônimo.
   */
  | "calorie_calculator_view"
  | "calorie_calculator_complete"
  | "calorie_activity_help_open"
  | "calorie_methodology_open"
  | "calorie_deficit_select"
  | "calorie_article_click"
  | "calorie_cta_click"
  | "calorie_macros_click"

  /**
   * Calculadora de TMB e Gasto Calórico (TDEE). Mesma regra de privacidade
   * da calculadora de déficit: peso, altura, idade, sexo, TMB e TDEE são
   * dados corporais e NUNCA entram em parâmetro de evento.
   */
  | "tdee_calculator_view"
  | "tdee_calculator_complete"
  | "tdee_activity_change"
  | "tdee_methodology_open"
  | "tdee_gain_open"
  | "tdee_deficit_click"
  | "tdee_macros_click"
  | "tdee_article_click"

  /**
   * Calculadora de 1RM. Mesma regra: carga, repetições e o 1RM estimado são
   * desempenho individual e NUNCA entram em parâmetro de evento. Não
   * precisamos armazenar o quanto ninguém levanta para saber se a
   * ferramenta é usada.
   */
  | "one_rm_calculator_view"
  | "one_rm_calculator_use"
  | "one_rm_percentage_select"
  | "one_rm_plate_calculator_open"
  | "one_rm_methodology_open"
  | "one_rm_article_click"
  | "one_rm_cta_click"

  /**
   * Calculadora de macros. Peso, calorias e os gramas calculados são dados
   * corporais e de dieta — nunca entram em parâmetro de evento.
   */
  | "macro_calculator_view"
  | "macro_calculator_complete"
  | "macro_protein_change"
  | "macro_fat_change"
  | "macro_meal_split_open"
  | "macro_methodology_open"
  | "macro_deficit_click"
  | "macro_protein_calculator_click"
  | "macro_cardapio_click"
  | "macro_article_click"
  | "macro_cta_click"

  /**
   * Calculadora de volume de treino. A ficha de treino inteira é dado
   * pessoal de desempenho — nada dela vai para o Analytics. Só o
   * comportamento: viu, começou, adicionou exercício, concluiu.
   */
  | "training_volume_view"
  | "training_volume_start"
  | "training_volume_exercise_add"
  | "training_volume_complete"
  | "training_volume_secondary_toggle"
  | "training_volume_muscle_open"
  | "training_volume_methodology_open"
  | "training_volume_share"
  | "training_volume_whatsapp_click"
  | "training_volume_1rm_click"
  | "training_volume_article_click"
  | "training_volume_cta_click"

  /**
   * Monte seu Cardápio. Funil completo, zero conteúdo: nenhuma resposta,
   * meta, peso ou alimento escolhido entra em parâmetro — só o passo do
   * funil e as dimensões agregáveis (objetivo, nº de refeições, dieta), que
   * são as únicas coisas necessárias para melhorar o produto.
   */
  | "meal_planner_view"
  | "meal_planner_start"
  /**
   * A pessoa marcou uma situação que pede acompanhamento, leu a orientação
   * e escolheu seguir com a simulação. Disparado SEM parâmetro de situação:
   * gestação, idade, condição clínica e histórico de transtorno alimentar
   * são dados de saúde e não entram em evento nenhum. Saber quantas pessoas
   * seguem já responde a pergunta de produto.
   */
  | "meal_planner_special_continue"
  | "meal_planner_goal_selected"
  | "meal_planner_preferences_complete"
  | "meal_plan_generated"
  | "meal_swap_clicked"
  | "meal_swapped"
  | "weekly_plan_generated"
  | "shopping_list_generated"
  | "meal_plan_saved"
  | "meal_methodology_open"
  | "meal_article_click"
  | "meal_cta_click"
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
