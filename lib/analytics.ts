/**
 * Camada central de analytics — todos os eventos vão para o dataLayer
 * do Google Tag Manager. Nunca chamar gtag()/pixels diretamente aqui.
 */

export type AnalyticsEvent =
  | "click_whatsapp"
  /**
   * Clique no WhatsApp a partir de uma landing page de anúncio (/lp/*).
   *
   * NÃO substitui `click_whatsapp` nem `generate_lead`, que o listener
   * global já dispara em qualquer link wa.me e servem de conversão no
   * Google Ads. Este evento existe para o que aqueles não carregam:
   * `cta_location` (hero, como_funciona, atendimento, faq, final, sticky…)
   * e `page_type` (lp_personal_alphaville). É o que responde qual bloco da
   * página gera contato — sem inflar a contagem de conversões.
   */
  | "whatsapp_click"
  | "click_phone"
  | "submit_form"
  | "generate_lead"
  | "view_pricing"
  | "scroll_75"
  | "engaged_time"
  | "article_read"
  /**
   * Vídeos dentro dos artigos.
   *
   * `article_video_view` conta quantas páginas com vídeo foram abertas e
   * quantos players havia; `article_video_play` conta quem apertou play. Um
   * sem o outro não responde nada: 40 plays é ótimo em 100 visitas e
   * irrelevante em 5.000.
   */
  | "article_video_view"
  | "article_video_play"
  /**
   * Sticky bar contextual. `sticky_view` conta exposição, `sticky_click` a
   * ação, `sticky_close` o descarte. Parâmetros: content_category (a regra),
   * cta_variant (a/b), cta_destination, traffic_source — nunca conteúdo
   * digitado, nunca dado corporal.
   */
  | "sticky_view"
  | "sticky_click"
  | "sticky_close"
  /**
   * Bloco pós-resultado das ferramentas. `post_tool_cta_view` uma vez por
   * ferramenta por sessão; `post_tool_cta_click` a ação principal;
   * `tool_journey_continue` quando ela leva a outra ferramenta ou ao
   * diagnóstico; `tool_to_whatsapp` quando abre conversa;
   * `post_tool_secondary_click` a ação discreta. Parâmetros: tool_name,
   * tool_result_category (faixa, nunca o número), cta_variant (a/b/c),
   * cta_destination, session_tool_count, previous_tool.
   */
  | "post_tool_cta_view"
  | "post_tool_cta_click"
  | "post_tool_secondary_click"
  | "tool_journey_continue"
  | "tool_to_whatsapp"
  /**
   * Abertura de pergunta do FAQ, em qualquer página. A pergunta vai no
   * parâmetro porque é conteúdo editorial nosso, não dado de quem leu:
   * saber qual dúvida abre mais diz o que a página devia responder antes.
   */
  | "faq_view"
  | "faq_open"
  // Diagnóstico Montinho (funil da ferramenta /diagnostico)
  | "diagnostic_view"
  | "diagnostic_start"
  | "diagnostic_progress_25"
  | "diagnostic_progress_50"
  | "diagnostic_progress_75"
  | "diagnostic_complete"
  | "diagnostic_result_view"
  | "diagnostic_whatsapp_click"
  | "diagnostic_routine_click"
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
   * Destrave Seu Corpo (funil do teste de mobilidade).
   *
   * Nenhum evento carrega resposta de teste ou de triagem — só categorias.
   * As respostas dizem onde o corpo da pessoa tem limitação e o que ela sente:
   * é dado de saúde, e dado de saúde não sai do aparelho dela.
   */
  | "mobility_tool_view"
  | "mobility_start"
  | "mobility_screening_block"
  | "mobility_quick_test"
  | "mobility_full_test"
  | "mobility_test_complete"
  | "mobility_result_view"
  | "mobility_protocol_generated"
  | "mobility_protocol_duration"
  | "mobility_plan_b"
  | "mobility_save"
  | "mobility_whatsapp"
  | "mobility_share"
  | "mobility_retest_start"
  | "mobility_retest_complete"
  | "mobility_restart"

  /**
   * Fontes preferidas do Google. Só existem dois eventos, e a ausência de um
   * terceiro é deliberada: o site NÃO recebe confirmação de que a pessoa
   * concluiu a seleção do lado do Google. Um evento chamado
   * "preferred_source_added" seria dado inventado.
   */
  | "preferred_source_cta_view"
  | "preferred_source_cta_interaction"

  /**
   * Compartilhamento contextual.
   *
   * `share_open` é INTENÇÃO (abriu o menu ou o painel nativo); os outros
   * são AÇÃO escolhida. Contar os dois como a mesma coisa infla o número e
   * esconde a pergunta que interessa: de cada dez que demonstram vontade de
   * enviar, quantas realmente enviam.
   *
   * O compartilhamento nativo do aparelho não diz qual aplicativo a pessoa
   * escolheu — `share_native` significa "o painel do sistema foi aberto e
   * não foi cancelado", e nada além disso. Cancelar não gera evento de
   * erro: desistir não é falha.
   *
   * Parâmetros: page_type, content_type, share_location, share_method,
   * tool_name. NUNCA o resultado do cálculo, o peso, a idade, a altura, o
   * sexo, o texto da mensagem nem a URL com dado pessoal.
   */
  | "share_open"
  | "share_native"
  | "share_whatsapp"
  | "share_copy_link"
  | "share_copy_message"
  | "share_email"
  | "share_result"

  /**
   * Calculadora de proteína. Privacidade por desenho: o peso digitado e o
   * resultado NUNCA entram nos parâmetros — só o comportamento anônimo.
   */
  | "protein_calculator_view"
  | "protein_calculator_use"
  | "protein_meals_open"
  | "protein_food_examples_open"
  | "protein_article_click"
  /** Ponte da meta de proteína para a tabela nutricional de alimentos. */
  | "protein_food_search_click"

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
  | "tdee_training_click"
  | "tdee_article_click"

  /**
   * Calculadora de zonas de frequência cardíaca. Idade e FC de repouso são
   * dados do corpo, e FC máxima e limite de zona são função direta da
   * idade — nada disso entra em parâmetro de evento. Só placement.
   */
  | "heart_rate_calculator_view"
  | "heart_rate_calculator_use"
  | "heart_rate_resting_open"
  | "heart_rate_methodology_open"
  | "heart_rate_article_click"

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
  | "one_rm_review_click"
  | "one_rm_article_click"

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
  /** Clique no botão que leva de volta ao campo que falta preencher. */
  | "macro_fill_jump"
  | "macro_protein_calculator_click"
  | "macro_cardapio_click"
  | "macro_article_click"
  | "macro_food_search_click"

  /**
   * Buscador nutricional. O TERMO pesquisado nunca entra em parâmetro: é
   * dado de dieta, e vale aqui a mesma regra das calculadoras. A demanda por
   * alimentos que faltam na base é medida no Search Console, não no evento.
   */
  | "food_search_view"
  | "food_result_open"
  | "food_quantity_change"
  | "food_nutrients_expand"
  | "food_compare_open"
  | "food_portion_select"
  | "food_protein_target_change"
  /* O critério é categoria de produto, não dado da pessoa — pode ir. */
  | "food_discover_sort"
  | "food_discover_filter"
  | "food_page_view"
  | "food_protein_calculator_click"
  | "food_macros_click"

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
  | "meal_training_click"
  | "meal_article_click"
  | "meal_cta_click"
  /* Fim do cardápio → WhatsApp com objetivo e meta preenchidos. */
  | "meal_whatsapp_click"
  | "ask_montinho_feedback_positive"
  | "ask_montinho_feedback_negative"
  | "ask_montinho_embed_submit"

  /**
   * Consultoria Online — o funil da página.
   *
   * O clique no WhatsApp já é capturado globalmente por click_whatsapp, com
   * delegação no document. Estes eventos NÃO o repetem: eles respondem o que
   * o global não responde — de qual seção da página o clique partiu, e até
   * onde a pessoa leu antes de desistir.
   *
   * As etapas são seções vistas, e não porcentagem de rolagem, de propósito.
   * "Rolou 50%" muda de significado toda vez que a página muda de tamanho;
   * "viu a prova social" continua querendo dizer a mesma coisa daqui a um
   * ano, e é isso que permite comparar antes e depois de uma alteração.
   */
  | "consultoria_view"
  | "consultoria_etapa_proposta"
  | "consultoria_etapa_metodo"
  | "consultoria_etapa_prova"
  | "consultoria_etapa_objecoes"
  | "consultoria_cta_click"
  | "consultoria_resultados_click"
  | "consultoria_historia_click"

  /** Páginas /comece — as portas de entrada dos caminhos. */
  | "comece_view"

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
  | "routine_volume_click"
  | "routine_article_click"
  | "routine_diagnostic_click"
  | "routine_plan_copied"
  | "routine_plan_saved"
  | "routine_ask_click"
  | "routine_service_click"
  | "routine_whatsapp_click"

  // Revisão Gratuita de Execução
  | "execution_review_view"
  | "execution_review_whatsapp_click"

  // Academia Ideal em Alphaville
  | "gym_finder_view"
  | "gym_finder_start"
  | "gym_finder_complete"
  | "gym_result_click";

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

  /*
   * Caminho 0 — a própria página. A sticky bar precisa saber quando uma
   * ferramenta entregou resultado, e as ferramentas já anunciam isso aqui.
   * Um evento DOM evita acoplar cada ferramenta à barra: quem quiser ouvir,
   * ouve; ninguém precisa importar ninguém.
   */
  try {
    window.dispatchEvent(new CustomEvent("montinho:evento", { detail: { event } }));
  } catch {
    /* ambiente sem CustomEvent: só perde o aviso local. */
  }

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
