import type { BlogPost } from "@/lib/blog";
import { CTA_REGISTRY } from "./registry";
import { CTA_OVERRIDES } from "./overrides";
import type { CtaCluster, CtaDefinition, CtaPlan, CtaStage } from "./types";

/**
 * Classificador determinístico de intenção.
 *
 * Roda no build (SSG), é uma função pura e não faz chamada de rede nem de LLM.
 * Mesmo artigo entra, mesmo plano sai — o que torna o resultado testável e os
 * dados de analytics comparáveis ao longo do tempo.
 *
 * A ordem das regras importa: vai do sinal mais específico (geografia, GLP-1,
 * dor) para o mais genérico. A primeira que casa vence.
 */

/**
 * Residenciais e pontos que ficam dentro da região atendida mas cujo slug não
 * cita a cidade. Sem esta lista eles cairiam em "fora da região" e mandariam
 * para online alguém que mora a cinco minutos do atendimento presencial.
 */
const RESIDENCIAIS_DA_REGIAO = [
  "genesis", "melville", "valville", "burle-marx", "alpha-conde", "alpha-sitio",
  "itahye", "villa-solaia", "villa-lobos", "campos-do-conde", "new-ville",
  "scenic", "morada-dos-lagos", "parque-das-artes", "green-valley",
  "empresarial-18-do-forte", "alameda-rio-negro", "ghaia", "18-do-forte",
  "castelo-branco", "antonio-joao",
];

/**
 * Cidades com artigo no site que NÃO estão na área de atendimento presencial.
 * Para elas o CTA precisa ser online — nunca insinuar presencial inexistente.
 */
const FORA_DA_REGIAO = [
  "sorocaba", "jundiai", "itu", "cotia", "granja-viana", "osasco",
  "carapicuiba", "jandira", "itapevi", "vargem-grande-paulista",
  "pirapora-do-bom-jesus", "pinheiros", "perdizes", "higienopolis",
  "sao-paulo",
];

const GLP1 = /mounjaro|ozempic|wegovy|saxenda|tirzepatida|semaglutida|retatrutida|liraglutida|glp-?1|caneta(s)?-emagrecedora/;

const DOR = /\bdor\b|dores|lesao|lesoes|tendinite|tendinopatia|hernia|bursite|condromalacia|impacto-no-ombro|lombalgia|artrose|artrite|fascite|contratura|estiramento/;

const SAUDE = /diabetes|hipertensao|colesterol|dislipidemia|menopausa|climaterio|andropausa|gravidez|gestante|pos-parto|idoso|terceira-idade|acima-dos|pos-60|pos-65|osteoporose|tireoide|ansiedade|depressao|insonia|imunidade|sop\b|cardiaco|coracao|avc|cancer|quimioterapia|autoimune|fibromialgia|red-s|ciclo-menstrual|lipedema|varizes|anemia|enxaqueca|burnout|parkinson|alzheimer|apneia|sarcopenia|testosterona|trt\b|intestin|prisao-de-ventre|retencao-de-liquido|postura|criancas|adolescentes|longevidade|rejuvenesce|gripe|caibra|dormencia|circulacao/;

const EXERCICIO = /^como-fazer|rosca-|supino|agachamento|levantamento-terra|remada|leg-press|cadeira-(extensora|flexora|abdutora|adutora)|puxada|desenvolvimento|crucifixo|stiff|afundo|passada|elevacao-|triceps|biceps|panturrilha|abdominal|prancha|barra-fixa|paralela|hack-|pulldown|face-pull|encolhimento|glute-bridge|hip-thrust|execucao/;

const HIPERTROFIA = /hipertrofia|massa-muscular|ganhar-massa|volume-de-treino|serie|repeticoes|carga|falha-muscular|periodizacao|bulking|treino-abc|divisao-de-treino|drop-?set|rest-?pause|bi-?set|progressao-de-carga|tempo-sob-tensao/;

const EMAGRECIMENTO = /emagrec|perder-peso|perder-gordura|deficit-calorico|queimar|gordura-|balanca|sanfona|barriga|celulite|definicao|secar|peso-ideal|quantos-kg|recomposicao/;

const INICIANTE = /iniciante|comecar|comeco|primeira-semana|primeiro-treino|nunca-treinei|voltar-a-treinar|voltar-academia|depois-de-parado|destreino|vergonha|por-onde-comecar|nao-sei-treinar/;

const ROTINA = /em-casa|sem-academia|30-minutos|20-minutos|pouco-tempo|falta-de-tempo|rotina|consistencia|motivacao|preguica|disciplina|habito|viagem|feriado|hotel|manha|noite|horario|frequencia|quantas-vezes|dias-por-semana|conciliar/;

const NUTRICAO = /dieta|alimenta|comer|proteina|carboidrato|gordura-boa|caloria|jejum|refeicao|cafe-da-manha|jantar|lanche|receita|suplement|creatina|whey|cafeina|pre-treino|omega|vitamina|magnesio|agua|refrigerante|alcool|cerveja|acucar|adocante|chocolate|fruta|ultraprocessado|engorda|saciedade/;

const SAZONAL = /natal|ano-novo|dia-das-maes|dia-dos-pais|dia-dos-namorados|ferias|carnaval|folia|verao|inverno|presente-fitness|casais/;

const TREINO_ESTRUTURA = /^treino-de-|^treino-para-|^exercicios-para-|gluteo|abdomen|panturrilha|posterior-de-coxa|potencia|explosividade|agilidade|resistencia/;

const ACADEMIA = /academia/;

/**
 * Redes e academias da região citadas pelo nome. Sem isso, "smart-fit-alphaville"
 * não casa com /academia/ e cai no fallback neutro — perdendo justamente o
 * artigo com maior intenção local do acervo.
 */
const MARCA_ACADEMIA = /smart-?fit|blue-?fit|body-?tech|bio-?ritmo|panobianco|nitrogym|arena-18|scelta|4perform|competition|24-wellness|sky-?fit|mormaii|voi-?fit|red-?fit|primax|crossfit|xsuperacao|obox|sparta-fitness|new-life-fitness|iron-?berg|selfit|just-?fit/;

const SERVICO_ONLINE = /consultoria|online|a-distancia|personal-trainer-online|treino-personalizado|planilha|app-de-treino|vale-a-pena-contratar|como-escolher-um-bom-personal|personal-trainer-ia|academia-ou-personal/;

const RESULTADOS = /resultado|transformacao|antes-e-depois|historia|depoimento|quanto-tempo-para/;

const SERVICO_LOCAL = /personal-trainer|personal-em-|treinador-particular|professor-de-musculacao|quanto-custa-personal/;

function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-");
}

/**
 * Dois campos de busca, de propósito.
 *
 * `core` (slug + título) decide geografia e intenção comercial. As tags NÃO
 * entram aqui: 104 artigos carregam a tag "personal trainer alphaville" por
 * SEO, o que descreve quem escreveu, não o que o leitor quer. Usar tag para
 * geografia fazia "creatina para hipertrofia" virar página de serviço local.
 *
 * `full` (core + tags) decide só o tema, onde a tag é sinal legítimo.
 *
 * Categoria fica fora dos dois: no acervo real ela é ruído (126 páginas locais
 * estão em "Treinamento"), então entra apenas como desempate final.
 */
function fields(post: BlogPost): { core: string; full: string } {
  const core = slugify(`${post.slug} ${post.title}`);
  return { core, full: `${core}-${slugify((post.tags ?? []).join(" "))}` };
}

/**
 * Região realmente atendida presencialmente (Alphaville, Tamboré, Barueri,
 * Santana de Parnaíba e Aldeia da Serra), conforme as páginas de serviço.
 * Retorna qual página presencial é a correta para aquele artigo.
 */
function matchRegiao(hay: string): string | null {
  if (/tambore/.test(hay)) return "tambore";
  if (/barueri/.test(hay)) return "barueri";
  if (/santana-de-parnaiba|aldeia-da-serra/.test(hay)) return "santana";
  if (/alphaville/.test(hay)) return "alphaville";
  if (RESIDENCIAIS_DA_REGIAO.some((r) => hay.includes(r))) return "alphaville";
  return null;
}

export function classify(post: BlogPost): { cluster: CtaCluster; stage: CtaStage; reason: string } {
  const { core, full } = fields(post);
  // Geografia e serviço: só slug + título.
  const foraDaRegiao = FORA_DA_REGIAO.some((c) => core.includes(c));
  const regiao = foraDaRegiao ? null : matchRegiao(core);

  // 1. Geografia primeiro: é o sinal com maior consequência se errarmos.
  if (foraDaRegiao && (SERVICO_LOCAL.test(core) || ACADEMIA.test(core))) {
    return { cluster: "local_other", stage: "servico", reason: "cidade fora da área presencial" };
  }
  if (regiao && SERVICO_LOCAL.test(core)) {
    return { cluster: "local_service", stage: "local", reason: `serviço presencial em ${regiao}` };
  }
  if (regiao && (ACADEMIA.test(core) || MARCA_ACADEMIA.test(core))) {
    return { cluster: "gym_local", stage: "local", reason: `academia na região (${regiao})` };
  }

  // 2. Temas com limite profissional — precisam de copy contida.
  if (GLP1.test(full)) {
    return { cluster: "glp1", stage: "solucao", reason: "conteúdo GLP-1" };
  }
  if (DOR.test(full)) {
    return { cluster: "pain", stage: "problema", reason: "dor ou lesão" };
  }
  if (SAUDE.test(full)) {
    return { cluster: "health", stage: "informativo", reason: "condição de saúde" };
  }

  // 3. Serviço sem geografia.
  if (SERVICO_ONLINE.test(core)) {
    return { cluster: "service_online", stage: "servico", reason: "avaliação de serviço/online" };
  }
  if (SERVICO_LOCAL.test(core)) {
    return { cluster: "service_online", stage: "servico", reason: "serviço sem cidade definida" };
  }

  // 4. Execução de exercício: informativo puro, nunca vender.
  if (EXERCICIO.test(core)) {
    return { cluster: "exercise", stage: "informativo", reason: "execução de exercício" };
  }

  // 5. Clusters temáticos.
  if (INICIANTE.test(full)) {
    return { cluster: "beginner", stage: "solucao", reason: "iniciante ou retorno" };
  }
  if (EMAGRECIMENTO.test(full)) {
    const travado = /por-que|nao-consigo|nao-emagreco|travou|travad|parou|balanca|sanfona|plato|estagn/.test(core);
    return {
      cluster: "weight_loss",
      stage: travado ? "problema" : "solucao",
      reason: travado ? "emagrecimento — resultado travado" : "emagrecimento — busca de estratégia",
    };
  }
  if (HIPERTROFIA.test(full)) {
    return { cluster: "hypertrophy", stage: "solucao", reason: "hipertrofia estruturada" };
  }
  if (ROTINA.test(full)) {
    return { cluster: "routine", stage: "solucao", reason: "tempo, rotina ou consistência" };
  }
  if (NUTRICAO.test(full)) {
    return { cluster: "nutrition", stage: "informativo", reason: "nutrição educativa" };
  }
  if (ACADEMIA.test(core) || MARCA_ACADEMIA.test(core)) {
    return { cluster: "gym_generic", stage: "informativo", reason: "academia sem geografia" };
  }
  if (SAZONAL.test(core)) {
    return { cluster: "routine", stage: "solucao", reason: "conteúdo sazonal — manter a rotina" };
  }
  if (TREINO_ESTRUTURA.test(core)) {
    return { cluster: "hypertrophy", stage: "solucao", reason: "estrutura de treino por grupo muscular" };
  }
  if (RESULTADOS.test(full)) {
    return { cluster: "results", stage: "servico", reason: "resultado e prova social" };
  }

  // 6. Desempate por categoria — último recurso, antes do fallback neutro.
  const cat = post.category.toLowerCase();
  if (cat.includes("emagrec")) {
    return { cluster: "weight_loss", stage: "solucao", reason: "categoria Emagrecimento" };
  }
  if (cat.includes("hipertrofia")) {
    return { cluster: "hypertrophy", stage: "solucao", reason: "categoria Hipertrofia" };
  }
  if (cat.includes("nutri")) {
    return { cluster: "nutrition", stage: "informativo", reason: "categoria Nutrição" };
  }
  if (cat.includes("lesa") || cat.includes("lesõ")) {
    return { cluster: "pain", stage: "problema", reason: "categoria Lesões" };
  }

  return { cluster: "general", stage: "informativo", reason: "sem sinal confiável — fallback" };
}

/** CTA do meio por cluster. null = não interromper a leitura deste tema. */
const MID_BY_CLUSTER: Partial<Record<CtaCluster, string>> = {
  exercise: "ask_exercise",
  hypertrophy: "ask_concept",
  weight_loss: "ask_concept",
  beginner: "ask_concept",
  routine: "ask_concept",
  glp1: "ask_health",
  pain: "ask_health",
  health: "ask_health",
  nutrition: "ask_nutrition",
  gym_generic: "ask_concept",
  gym_local: "ask_concept",
  local_service: "ask_concept",
  local_other: "ask_concept",
  service_online: "ask_concept",
  results: "ask_concept",
  general: "fallback_ask",
};

/** CTA final por cluster. É onde mora a intenção comercial, quando existe. */
const END_BY_CLUSTER: Record<CtaCluster, string> = {
  exercise: "fallback_continue",
  hypertrophy: "diag_hypertrophy",
  weight_loss: "diag_weight_loss",
  beginner: "diag_beginner",
  routine: "diag_routine",
  glp1: "diag_glp1",
  pain: "diag_pain",
  health: "diag_stuck",
  nutrition: "fallback_continue",
  gym_local: "local_gym",
  gym_generic: "diag_beginner",
  local_service: "local_alphaville",
  local_other: "service_online",
  service_online: "service_general",
  results: "service_results",
  general: "fallback_continue",
};

/** Página presencial correta para o bairro/cidade do artigo. */
function localEndId(hay: string): string {
  const r = matchRegiao(hay);
  if (r === "tambore") return "local_tambore";
  if (r === "barueri") return "local_barueri";
  if (r === "santana") return "local_santana";
  return "local_alphaville";
}

/** Artigo comporta um CTA no meio sem atrapalhar a leitura? */
export function allowsMidCta(post: BlogPost): boolean {
  const h2 = (post.content.match(/<h2/g)?.length ?? 0) + (post.content.match(/^## /gm)?.length ?? 0);
  return post.content.length >= 6000 && h2 >= 5;
}

/**
 * @param renderEnd  se o CTA final contextual será realmente renderizado.
 *   Na fase 1 ele não é (o bloco final antigo segue no lugar), então o dedupe
 *   contra ele precisa ser desligado — senão o CTA do meio se anula contra um
 *   bloco que não existe na página.
 */
export function planCTAs(post: BlogPost, { renderEnd = true } = {}): CtaPlan {
  const auto = classify(post);
  const override = CTA_OVERRIDES[post.slug];

  const cluster = override?.cluster ?? auto.cluster;
  const stage = override?.stage ?? auto.stage;
  const reason = override ? `override editorial (${override.note ?? "sem nota"})` : auto.reason;

  const { core } = fields(post);

  let endId = override?.end ?? END_BY_CLUSTER[cluster];
  if (!override?.end && cluster === "local_service") endId = localEndId(core);

  // Dedupe: o artigo já leva a pessoa ao WhatsApp no corpo do texto. Repetir
  // a mesma ação no bloco final vira insistência, não ajuda.
  let end = CTA_REGISTRY[endId] ?? CTA_REGISTRY.fallback_continue;
  if (/wa\.me|api\.whatsapp/.test(post.content) && end.secondary?.destination === "whatsapp") {
    end = { ...end, secondary: undefined };
  }

  // CTA do meio
  let mid: CtaDefinition | null = null;
  if (override?.mid !== null) {
    const midId = override?.mid ?? MID_BY_CLUSTER[cluster];
    const candidate = midId ? CTA_REGISTRY[midId] ?? null : null;
    // Só entra se o artigo comporta e se a ação difere do CTA final.
    const conflita = renderEnd && candidate?.primary.destination === end.primary.destination;
    if (candidate && (override?.mid || allowsMidCta(post)) && !conflita) {
      mid = candidate;
    }
  }

  return { cluster, stage, mid, end, reason };
}
