/**
 * Camada central de analytics — todos os eventos vão para o dataLayer
 * do Google Tag Manager. Nunca chamar gtag()/pixels diretamente aqui.
 */

export type AnalyticsEvent =
  | "click_whatsapp"
  /** Clique em cartão de afiliado da Amazon (produto e artigo, nada de saúde). */
  | "click_afiliado"
  /** Montinho Mata a Vontade (sem restrições/alergias: só se teve ou não). */
  | "mata_vontade_inicio"
  | "mata_vontade_etapa"
  | "mata_vontade_resultado"
  | "mata_vontade_receita_aberta"
  | "mata_vontade_feedback"
  | "mata_vontade_cta"
  | "mata_vontade_fonte"
  | "mata_vontade_voz"
  /** Beliscômetro + "O que a balança não conta": só ids e contagens, nunca kcal ou peso da pessoa. */
  | "beliscometro_start"
  | "beliscometro_context_selected"
  | "beliscometro_food_selected"
  | "beliscometro_step_complete"
  | "beliscometro_result"
  | "beliscometro_simulation"
  | "beliscometro_share"
  | "beliscometro_whatsapp_click"
  | "beliscometro_restart"
  | "balanca_start"
  | "balanca_poll"
  | "balanca_result"
  | "balanca_slider"
  | "balanca_share"
  | "balanca_whatsapp_click"
  /** Palpite "quem vence?" nos artigos de evento (sem dado pessoal). */
  | "palpite_voto"
  | "palpite_compartilhar"
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
   * Depoimentos da home. `testimonials_expand` diz quantas pessoas quiseram
   * ler além dos três primeiros — é o sinal de que a prova social está
   * sendo lida, e não apenas rolada. `testimonials_google_click` conta quem
   * foi conferir na fonte.
   */
  | "testimonials_expand"
  | "testimonials_google_click"

  /**
   * Calculadora de proteína. Privacidade por desenho: o peso digitado e o
   * resultado NUNCA entram nos parâmetros — só o comportamento anônimo.
   */
  | "protein_calculator_view"
  | "protein_calculator_use"
  /** Troca da faixa de referência nos cartões. Vai o id da faixa, nunca o peso. */
  | "protein_range_select"
  | "protein_meals_open"
  | "protein_food_examples_open"
  | "protein_article_click"
  /** Ponte da meta de proteína para a tabela nutricional de alimentos. */
  | "protein_food_search_click"

  /**
   * Conversor mg/mL e Seringa U-100. Aqui a privacidade não é boa prática,
   * é obrigação: os valores descrevem um injetável que a pessoa tem em casa.
   * NENHUM número digitado — mg, mL, concentração, marca — entra em evento.
   * Só o comportamento: viu, calculou, abriu a explicação, moveu a marca,
   * abriu a conferência, achou divergência, abriu metodologia, abriu fonte.
   */
  | "concentration_tool_view"
  | "concentration_calculated"
  | "u100_education_open"
  | "u100_mark_change"
  | "instruction_check_open"
  | "instruction_check_mismatch"
  | "methodology_open"
  | "source_open"
  /** Clique no convite do conversor, no fim dos artigos de quem já usa. */
  | "concentration_article_click"
  | "compound_selected"
  | "reverse_calculation"
  | "result_copied"

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
  /** Modo voz (teste na TMB/TDEE): só uso, nunca o que foi dito. */
  | "voz_inicio"
  | "voz_passo"
  | "voz_fim"
  | "voz_erro"
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
  /**
   * Calculadora de Polichinelos. `mode` diz qual das quatro perguntas a
   * pessoa escolheu e `intensity` o ritmo — nunca o peso nem o resultado.
   * O funil que interessa (viu → mexeu → calculou → compartilhou → falou)
   * sai desses cinco mais os eventos de share e pós-resultado que já
   * existem; não há evento novo para o que o site já mede.
   */
  | "jumping_jack_calculator_view"
  | "jumping_jack_calculator_use"
  | "jumping_jack_mode_selected"
  | "jumping_jack_preset"
  | "jumping_jack_cadence_open"
  | "jumping_jack_methodology_open"
  | "jumping_jack_tool_click"
  /**
   * Calculadora de Calorias da Caminhada. `mode` diz qual das quatro
   * perguntas (tempo, distância, passos, meta), `pace` o ritmo e `incline`
   * se a pessoa abriu a esteira — nunca o peso nem o resultado.
   */
  | "walking_calculator_view"
  | "walking_calculator_use"
  | "walking_mode_selected"
  | "walking_preset"
  | "walking_treadmill_open"
  | "walking_methodology_open"
  | "walking_tool_click"
  /** Calculadora de Calorias do Elíptico. `mode` e `effort`; nunca peso nem resultado. */
  | "surplus_calculator_view"
  | "surplus_calculator_complete"
  | "surplus_activity_help_open"
  | "surplus_select"
  | "surplus_macros_click"
  | "surplus_methodology_open"
  | "surplus_article_click"
  | "strength_calculator_view"
  | "strength_calculator_use"
  | "strength_mode_selected"
  | "strength_preset"
  | "strength_methodology_open"
  | "strength_tool_click"
  | "elliptical_calculator_view"
  | "elliptical_calculator_use"
  | "elliptical_mode_selected"
  | "elliptical_preset"
  | "elliptical_display_open"
  | "elliptical_methodology_open"
  | "elliptical_tool_click"
  /** Calculadora de Calorias por Atividade. `activity` e `mode`; nunca peso nem resultado. */
  | "activity_calculator_view"
  | "activity_calculator_use"
  | "activity_preset"
  | "activity_tool_click"
  /** Calculadora de Corrida. `mode`, `race` e `incline`; nunca peso nem resultado. */
  | "running_calculator_view"
  | "running_calculator_use"
  | "running_mode_selected"
  | "running_race_preset"
  | "running_incline_open"
  | "running_methodology_open"
  | "running_tool_click"
  /**
   * Calculadora de Massa Magra no GLP-1. `protection` diz em qual dos três
   * cenários a pessoa caiu — nunca o peso, nunca as gramas de proteína, e
   * nunca qual medicamento, que a ferramenta sequer pergunta.
   */
  | "glp1_calculator_view"
  | "glp1_calculator_use"
  | "glp1_methodology_open"
  | "glp1_tool_click"
  /** Calculadora de Meta de Peso. `verdict` diz se a meta cabia; nunca o peso nem a data. */
  | "goal_calculator_view"
  | "goal_calculator_use"
  | "goal_date_changed"
  | "goal_methodology_open"
  | "goal_tool_click"
  /** Calculadora de Potencial Natural. `reading` e `level`; nunca altura, peso ou gordura. */
  | "potential_calculator_view"
  | "potential_calculator_use"
  | "potential_methodology_open"
  | "potential_tool_click"
  /** Calculadora de Composição Corporal. `range` é a faixa de leitura; nunca peso nem gordura. */
  | "composition_calculator_view"
  | "composition_calculator_use"
  | "composition_methodology_open"
  | "composition_tool_click"
  /** Calculadora de Calorias no Futebol. `game`, `teams` e `per_week`; nunca o peso. */
  | "soccer_calculator_view"
  | "soccer_calculator_use"
  | "soccer_preset"
  | "soccer_goalkeeper_selected"
  | "soccer_frequency"
  | "soccer_methodology_open"
  | "soccer_tool_click"
  /** Calculadora de Calorias no Boxe. `mode`, `format` e `rhythm`; nunca o peso nem o número do relógio. */
  | "boxing_calculator_view"
  | "boxing_calculator_use"
  | "boxing_mode_selected"
  | "boxing_preset"
  | "boxing_count_used"
  | "boxing_watch_open"
  | "boxing_methodology_open"
  | "boxing_tool_click"
  /** Calculadora de Calorias na Zumba. `jumps` e `per_week`; nunca o peso. */
  | "zumba_calculator_view"
  | "zumba_calculator_use"
  | "zumba_preset"
  | "zumba_frequency"
  | "zumba_methodology_open"
  | "zumba_tool_click"
  /** Calculadora de Calorias no Spinning. `mode` e `band` (código da faixa); nunca peso, watts nem visor. */
  | "spinning_calculator_view"
  | "spinning_calculator_use"
  | "spinning_mode_selected"
  | "spinning_preset"
  | "spinning_display_open"
  | "spinning_frequency"
  | "spinning_methodology_open"
  | "spinning_tool_click"
  /** Calculadora de Calorias na Dança. `style` e `per_week`; nunca o peso. */
  | "dance_calculator_view"
  | "dance_calculator_use"
  | "dance_preset"
  | "dance_frequency"
  | "dance_methodology_open"
  | "dance_tool_click"
  /** Calculadora de Calorias na Natação. `stroke` e `per_week`; nunca o peso. */
  | "swimming_calculator_view"
  | "swimming_calculator_use"
  | "swimming_preset"
  | "swimming_frequency"
  | "swimming_methodology_open"
  | "swimming_tool_click"
  /** Calculadora de Calorias no Jiu-Jitsu. `rounds` e `per_week`; nunca o peso. */
  | "jiujitsu_calculator_view"
  | "jiujitsu_calculator_use"
  | "jiujitsu_preset"
  | "jiujitsu_frequency"
  | "jiujitsu_methodology_open"
  | "jiujitsu_tool_click"
  | "muaythai_calculator_view"
  | "muaythai_calculator_use"
  | "muaythai_preset"
  | "muaythai_frequency"
  | "muaythai_methodology_open"
  | "muaythai_tool_click"
  /** Calculadora de Calorias nas Artes Marciais. `modality` e `preset`; nunca o peso nem as calorias. */
  | "artesmarciais_calculator_view"
  | "artesmarciais_calculator_use"
  | "artesmarciais_modality"
  | "artesmarciais_preset"
  | "artesmarciais_methodology_open"
  | "artesmarciais_tool_click"
  /** Calculadora de Calorias Pulando Corda. `pace`, `rounds` e `per_week`; nunca o peso. */
  /** Calculadora de Calorias na Bicicleta. Modo, faixa e frequência; nunca o peso nem a distância. */
  | "bike_calculator_view"
  | "bike_calculator_use"
  | "bike_mode_selected"
  | "bike_preset"
  | "bike_frequency"
  | "bike_methodology_open"
  | "bike_tool_click"
  /** Previsor da São Silvestre. Referência, nível e cenário; nunca o tempo digitado. */
  | "ss_predictor_view"
  | "ss_predictor_use"
  | "ss_predictor_error"
  | "ss_whatsapp_click"
  | "ss_tool_click"
  | "jump_rope_calculator_view"
  | "jump_rope_calculator_use"
  | "jump_rope_preset"
  | "jump_rope_frequency"
  | "jump_rope_methodology_open"
  | "jump_rope_tool_click"
  /** Calculadora de Calorias Subindo Escada. `pace`, `floors` e `per_week`; nunca o peso. */
  | "stairs_calculator_view"
  | "stairs_calculator_use"
  | "stairs_preset"
  | "stairs_frequency"
  | "stairs_methodology_open"
  | "stairs_tool_click"
  /** Calculadora de Calorias no CrossFit. `format` e `per_week`; nunca o peso. */
  | "crossfit_calculator_view"
  | "crossfit_calculator_use"
  | "crossfit_preset"
  | "crossfit_frequency"
  | "crossfit_methodology_open"
  | "crossfit_tool_click"
  /** Calculadora de Calorias no Hyrox. Só o uso; nunca o peso nem o tempo da prova. */
  | "hyrox_calculator_view"
  | "hyrox_calculator_use"
  | "hyrox_preset"
  | "hyrox_methodology_open"
  | "hyrox_tool_click"
  /** Calculadora de Creatina. Faixa de peso e tamanho do pote; nunca o peso nem o preço. */
  | "creatine_calculator_view"
  | "creatine_calculator_start"
  | "creatine_calculator_calculate"
  | "creatine_recalculate"
  | "creatine_loading_toggle"
  | "creatine_container_calculate"
  | "creatine_cost_calculate"
  | "creatine_whatsapp_click"
  | "creatine_internal_link_click"
  /**
   * Central de ferramentas. A consulta da busca vai como texto curto (até
   * 80 caracteres, sem acento) para descobrir o que as pessoas procuram e
   * não encontram; nenhum dado pessoal entra nela.
   */
  | "tools_hub_search"
  | "tools_no_results"
  | "tools_hub_filter"
  | "tools_hub_expand"
  | "tool_card_click"
  | "guided_path_click"
  | "ask_montinho_click"
  | "tools_hub_cta_click"
  | "protein_whey_click"
  /** Calculadora de Whey. Faixas de peso e de proteína faltante; nunca o peso, o consumo nem o preço. */
  | "whey_calculator_view"
  | "whey_calculator_start"
  | "whey_goal_selected"
  | "whey_protein_target_calculated"
  | "whey_food_estimator_open"
  | "whey_food_intake_entered"
  | "whey_label_entered"
  | "whey_amount_calculated"
  | "whey_inverse_calculated"
  | "whey_package_calculated"
  | "whey_cost_calculated"
  | "whey_compare_products"
  | "whey_recalculate"
  | "whey_whatsapp_click"
  | "whey_internal_link"
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
  | "training_volume_template_loaded"
  | "training_volume_exercise_add"
  | "training_volume_complete"
  | "training_volume_secondary_toggle"
  | "training_volume_muscle_open"
  | "training_volume_methodology_open"
  | "training_volume_share"
  | "training_volume_whatsapp_click"
  | "training_volume_1rm_click"
  | "training_volume_article_click"
  | "rotina_local_click"
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
  | "gym_result_click"
  /**
   * Simulador de Emagrecimento. Funil: view → start → step_complete (step =
   * número da etapa) → complete → scenario_changed (control = nome do
   * controle) → whatsapp_click. NENHUM parâmetro leva peso, altura, idade,
   * sexo, medicação, hormônio ou a resposta de qualquer campo — nem uma
   * variante de CTA que revele uso de caneta.
   */
  | "simulator_view"
  | "simulator_start"
  | "simulator_step_complete"
  | "simulator_complete"
  | "scenario_changed"
  | "simulator_methodology_opened"
  | "simulator_internal_tool_click"
  | "simulator_share_click"
  | "simulator_whatsapp_click"
  /**
   * Meu Shape em 12 Semanas. Mesma regra dos outros simuladores: nenhum
   * parâmetro leva dado do corpo, medicação ou hormônio — só a etapa, o
   * controle mexido ou o destino interno.
   */
  | "shape12_view"
  | "shape12_start"
  | "shape12_step_complete"
  | "shape12_complete"
  | "shape12_scenario_change"
  | "shape12_checkpoint_view"
  | "shape12_methodology_open"
  | "shape12_share"
  | "shape12_internal_tool_click"
  | "shape12_whatsapp_click"
  /**
   * Simulador do Fim de Semana. Só interação: etapa, controle mexido,
   * grupo do item adicionado (refeição/extra/bebida). Nunca calorias,
   * peso, bebidas contadas, medicação, idade ou sexo.
   */
  | "weekend_simulator_view"
  | "weekend_simulator_start"
  | "weekend_step_complete"
  | "weekend_simulation_complete"
  | "weekend_scenario_changed"
  | "weekend_food_added"
  | "weekend_alcohol_module_used"
  | "weekend_comparison_viewed"
  | "weekend_methodology_open"
  | "weekend_internal_tool_click"
  | "weekend_share_clicked"
  | "weekend_whatsapp_click"
  /**
   * Calculadora de Peso da Classic Physique. Só interação: nunca altura nem
   * peso. `variant` = "completa" | "compacta"; `placement` = página/artigo.
   */
  /**
   * Mr. Olympia 2026 (contagem, hub geral, painel Brasil): só interação,
   * nunca um evento por segundo do relógio. countdown_view: 1x por montagem.
   */
  | "olympia_countdown_view"
  | "olympia_live_result_click"
  | "olympia_hub_category_click"
  | "olympia_brazil_filter_use"
  | "olympia_brazil_athlete_click"
  /** Simulador "Quanto tempo para ter shape?": só interação, nunca dado corporal. */
  | "shape_timeline_view"
  | "shape_timeline_start"
  | "shape_timeline_complete"
  | "shape_reference_selected"
  | "shape_timeline_slider_use"
  | "shape_bottleneck_complete"
  | "shape_share"
  | "shape_mass_simulator_click"
  | "shape_training_tool_click"
  | "shape_whatsapp_click"
  | "shape_compact_start"
  | "steps_view"
  | "steps_started"
  | "steps_completed"
  | "steps_whatsapp"
  | "waist_height_view"
  | "waist_height_started"
  | "waist_height_completed"
  | "waist_height_whatsapp"
  | "classic_calc_view"
  | "classic_calc_started"
  | "classic_calc_completed"
  | "classic_calc_weight_used"
  | "classic_calc_table_open"
  | "classic_calc_share"
  | "classic_calc_mass_simulator_click"
  | "classic_calc_whatsapp_click";

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
