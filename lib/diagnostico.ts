/**
 * Diagnóstico Montinho — motor de resultado.
 *
 * Lógica 100% determinística: respostas → regras → perfil → recomendações.
 * A mesma combinação de respostas produz sempre o mesmo resultado.
 * Nenhum dado pessoal é coletado aqui; as respostas vivem apenas no cliente.
 *
 * Não é avaliação médica nem substitui a anamnese individual feita com alunos.
 */

// ── Perguntas ────────────────────────────────────────────────────────────────

export interface QuizOption {
  value: string;
  label: string;
}

export interface QuizQuestion {
  id: QuestionId;
  title: string;
  options: QuizOption[];
}

export type QuestionId =
  | "objetivo"
  | "situacao"
  | "dias"
  | "tempo"
  | "experiencia"
  | "dificuldade"
  | "local"
  | "acompanhamento"
  | "regiao";

export type Answers = Partial<Record<QuestionId, string>>;

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "objetivo",
    title: "Qual é seu principal objetivo hoje?",
    options: [
      { value: "emagrecer", label: "Emagrecer e reduzir gordura" },
      { value: "massa", label: "Ganhar massa muscular" },
      { value: "condicionamento", label: "Melhorar condicionamento e qualidade de vida" },
      { value: "voltar", label: "Voltar a treinar e recuperar consistência" },
      { value: "evoluir", label: "Evoluir meu treino atual" },
    ],
  },
  {
    id: "situacao",
    title: "Como está sua rotina de treino hoje?",
    options: [
      { value: "parado", label: "Não estou treinando" },
      { value: "1-2", label: "Treino 1–2 vezes por semana" },
      { value: "3", label: "Treino 3 vezes por semana" },
      { value: "4+", label: "Treino 4 ou mais vezes" },
      { value: "sem-estrutura", label: "Treino, mas sem muita estrutura" },
    ],
  },
  {
    id: "dias",
    title: "Pensando na sua rotina real, quantos dias por semana você consegue treinar?",
    options: [
      { value: "2", label: "2 dias" },
      { value: "3", label: "3 dias" },
      { value: "4", label: "4 dias" },
      { value: "5", label: "5 ou mais" },
    ],
  },
  {
    id: "tempo",
    title: "Quanto tempo você normalmente consegue reservar para cada treino?",
    options: [
      { value: "30", label: "Até 30 minutos" },
      { value: "45", label: "30 a 45 minutos" },
      { value: "60", label: "45 minutos a 1 hora" },
      { value: "60+", label: "Mais de 1 hora" },
    ],
  },
  {
    id: "experiencia",
    title: "Como você se considera na musculação?",
    options: [
      { value: "zero", label: "Nunca treinei ou estou começando agora" },
      { value: "iniciante", label: "Iniciante" },
      { value: "intermediario", label: "Intermediário" },
      { value: "avancado", label: "Avançado" },
    ],
  },
  {
    id: "dificuldade",
    title: "O que mais atrapalha seu resultado hoje?",
    options: [
      { value: "constancia", label: "Falta de constância — começo bem e abandono" },
      { value: "nao-sei", label: "Não sei o que fazer no treino" },
      { value: "tempo", label: "Falta de tempo" },
      { value: "plato", label: "Treino, mas parei de evoluir" },
      { value: "tecnica", label: "Insegurança com a técnica dos exercícios" },
    ],
  },
  {
    id: "local",
    title: "Onde você pretende treinar?",
    options: [
      { value: "academia", label: "Academia" },
      { value: "condominio", label: "Academia do condomínio" },
      { value: "casa", label: "Em casa" },
      { value: "indeciso", label: "Ainda não decidi" },
    ],
  },
  {
    id: "acompanhamento",
    title: "Como você prefere ser acompanhado?",
    options: [
      { value: "presencial", label: "Presencialmente" },
      { value: "online", label: "Online, com acompanhamento próximo" },
      { value: "hibrido", label: "Uma combinação dos dois" },
      { value: "nao-sei", label: "Ainda não sei" },
    ],
  },
  {
    id: "regiao",
    title: "Onde você está?",
    options: [
      { value: "alphaville", label: "Alphaville / Tamboré" },
      { value: "barueri", label: "Barueri" },
      { value: "santana", label: "Santana de Parnaíba e região" },
      { value: "sp", label: "Outra cidade de São Paulo" },
      { value: "brasil", label: "Outro estado do Brasil" },
    ],
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;

// ── Perfis ───────────────────────────────────────────────────────────────────

export type ProfileId =
  | "emagrecimento-estrutura"
  | "hipertrofia-progressao"
  | "retorno-consistencia"
  | "rotina-eficiente"
  | "evolucao-treino"
  | "base-qualidade";

export interface ArticleRec {
  slug: string;
  title: string;
}

export interface DiagnosticoResult {
  profileId: ProfileId;
  profileName: string;
  /** Por que chegou nesse perfil (usa as respostas reais). */
  explanation: string;
  /** Mensagem única de prioridade. */
  priority: string;
  /** Orientação de frequência compatível com a disponibilidade informada. */
  frequency: string;
  /** Principal gargalo identificado. */
  bottleneck: string;
  /** Modalidade recomendada. */
  modality: "Presencial" | "Online" | "Híbrido";
  modalityReason: string;
  /** Três próximos passos educativos. */
  steps: [string, string, string];
  articles: ArticleRec[];
}

const PROFILE_NAMES: Record<ProfileId, string> = {
  "emagrecimento-estrutura": "Emagrecimento com Estrutura",
  "hipertrofia-progressao": "Hipertrofia com Progressão",
  "retorno-consistencia": "Retorno com Consistência",
  "rotina-eficiente": "Rotina Eficiente",
  "evolucao-treino": "Evolução de Treino",
  "base-qualidade": "Base e Qualidade de Vida",
};

// Artigos REAIS do blog, auditados contra lib/blog.ts.
const ARTICLES: Record<ProfileId, ArticleRec[]> = {
  "emagrecimento-estrutura": [
    { slug: "deficit-calorico-como-calcular", title: "Déficit Calórico: Como Calcular o Seu" },
    { slug: "melhor-treino-para-emagrecer", title: "Qual o Melhor Treino Para Emagrecer?" },
    { slug: "habitos-que-sabotam-seu-emagrecimento", title: "Hábitos Que Sabotam Seu Emagrecimento" },
  ],
  "hipertrofia-progressao": [
    { slug: "como-montar-treino-de-hipertrofia", title: "Como Montar um Treino de Hipertrofia" },
    { slug: "progressao-de-carga", title: "Progressão de Carga: O Motor da Evolução" },
    { slug: "quanta-proteina-por-dia-para-ganhar-massa-muscular", title: "Quanta Proteína Por Dia Para Ganhar Massa" },
  ],
  "retorno-consistencia": [
    { slug: "como-criar-habito-de-treinar", title: "Como Criar o Hábito de Treinar" },
    { slug: "preguica-de-treinar", title: "Preguiça de Treinar: Como Vencer o Dia Ruim" },
    { slug: "como-evitar-efeito-sanfona", title: "Como Evitar o Efeito Sanfona" },
  ],
  "rotina-eficiente": [
    { slug: "treino-de-30-minutos-funciona", title: "Treino de 30 Minutos Funciona?" },
    { slug: "quanto-tempo-dura-um-treino", title: "Quanto Tempo Deve Durar um Treino?" },
    { slug: "frequencia-de-treino", title: "Frequência de Treino: Quantas Vezes Por Semana?" },
  ],
  "evolucao-treino": [
    { slug: "como-sair-do-plato-da-musculacao", title: "Como Sair do Platô da Musculação" },
    { slug: "quando-trocar-o-treino", title: "Quando Trocar o Treino?" },
    { slug: "carga-ideal-como-escolher", title: "Carga Ideal: Como Escolher o Peso Certo" },
  ],
  "base-qualidade": [
    { slug: "exercicio-para-sedentario", title: "Exercício Para Sedentário: Como Começar do Zero" },
    { slug: "primeira-semana-na-academia", title: "Primeira Semana na Academia" },
    { slug: "musculacao-emagrece", title: "Musculação Emagrece?" },
  ],
};

// Ajustes por contexto (substituições pontuais, sempre com slugs reais)
const CASA_ARTICLE: ArticleRec = { slug: "treino-em-casa-sem-equipamento", title: "Treino em Casa Sem Equipamento" };
const OBESO_ARTICLE: ArticleRec = { slug: "musculacao-para-obesos-como-comecar", title: "Musculação Para Quem Está Obeso: Como Começar" };
const INICIANTE_ARTICLE: ArticleRec = { slug: "primeira-semana-na-academia", title: "Primeira Semana na Academia" };

// ── Textos auxiliares ────────────────────────────────────────────────────────

const OBJETIVO_LABEL: Record<string, string> = {
  emagrecer: "emagrecer e reduzir gordura",
  massa: "ganhar massa muscular",
  condicionamento: "melhorar condicionamento e qualidade de vida",
  voltar: "voltar a treinar com consistência",
  evoluir: "evoluir o treino atual",
};

const DIFICULDADE_LABEL: Record<string, string> = {
  constancia: "manter a constância",
  "nao-sei": "saber o que fazer no treino",
  tempo: "a falta de tempo",
  plato: "a falta de evolução",
  tecnica: "a insegurança com a técnica",
};

const BOTTLENECK_TEXT: Record<string, string> = {
  constancia:
    "Seu maior gargalo não é o treino em si: é a repetição. Plano bom é o que você consegue cumprir na semana ruim — e é aí que o acompanhamento próximo faz mais diferença.",
  "nao-sei":
    "Seu maior gargalo é a direção: sem saber o que fazer, cada treino vira improviso. Com um plano claro, a mesma hora na academia rende muito mais.",
  tempo:
    "Seu maior gargalo é o tempo — então a estratégia precisa caber na agenda real, não na agenda ideal. Sessões curtas e bem montadas resolvem mais do que parece.",
  plato:
    "Seu maior gargalo é a progressão: treinar sem evoluir carga, volume ou técnica estaciona qualquer resultado. O ajuste fino do plano é o que destrava.",
  tecnica:
    "Seu maior gargalo é a técnica — e ela define quanto do treino vira estímulo de verdade (e quanto vira risco). Correção próxima acelera muito essa fase.",
};

// ── Motor ────────────────────────────────────────────────────────────────────

export function computeResult(answers: Answers): DiagnosticoResult {
  const objetivo = answers.objetivo ?? "condicionamento";
  const dias = answers.dias ?? "3";
  const tempo = answers.tempo ?? "60";
  const experiencia = answers.experiencia ?? "iniciante";
  const dificuldade = answers.dificuldade ?? "nao-sei";
  const local = answers.local ?? "academia";
  const acomp = answers.acompanhamento ?? "nao-sei";
  const regiao = answers.regiao ?? "brasil";
  const situacao = answers.situacao ?? "parado";

  // 1) Perfil — precedência explícita e determinística
  let profileId: ProfileId;
  if (objetivo === "voltar" || dificuldade === "constancia") {
    profileId = "retorno-consistencia";
  } else if (tempo === "30" || dificuldade === "tempo") {
    profileId = "rotina-eficiente";
  } else if (objetivo === "emagrecer") {
    profileId = "emagrecimento-estrutura";
  } else if (objetivo === "massa") {
    profileId = "hipertrofia-progressao";
  } else if (objetivo === "evoluir" || dificuldade === "plato") {
    profileId = "evolucao-treino";
  } else {
    profileId = "base-qualidade";
  }

  // 2) Modalidade
  const inRegion = ["alphaville", "barueri", "santana"].includes(regiao);
  let modality: DiagnosticoResult["modality"];
  let modalityReason: string;
  if (!inRegion) {
    modality = "Online";
    modalityReason =
      acomp === "presencial"
        ? "Você prefere o presencial, mas está fora da região onde o Montinho atende pessoalmente (Alphaville, Barueri e Santana de Parnaíba). A consultoria online mantém o acompanhamento próximo — plano individualizado, correção por vídeo e suporte diário no WhatsApp."
        : "Como você está fora da região de atendimento presencial, a consultoria online é o caminho natural: plano individualizado, correção por vídeo e suporte diário no WhatsApp, onde você estiver.";
  } else if (acomp === "online") {
    modality = "Online";
    modalityReason =
      "Você está na região atendida, mas prefere a flexibilidade do online — funciona muito bem quando há autonomia para executar o plano, com check-ins e ajustes constantes.";
  } else if (acomp === "hibrido") {
    modality = "Híbrido";
    modalityReason =
      "Estando na região, dá para combinar sessões presenciais (técnica e ajuste fino) com o suporte online no resto da semana — o melhor dos dois mundos para a sua rotina.";
  } else {
    modality = "Presencial";
    modalityReason =
      dificuldade === "tecnica" || experiencia === "zero"
        ? "Você está na região atendida e, pelo seu momento, a correção de técnica em tempo real acelera (e protege) muito o início. O presencial é onde isso funciona melhor."
        : "Você está na região onde o Montinho atende pessoalmente — o acompanhamento presencial dá o nível mais próximo de correção e cobrança, e pode evoluir para o híbrido conforme a rotina.";
  }

  // 3) Frequência (usa a disponibilidade REAL informada)
  const diasNum = dias === "5" ? "5 ou mais" : dias;
  const frequencyByProfile: Record<ProfileId, string> = {
    "retorno-consistencia": `Você indicou que consegue treinar ${diasNum} dias por semana. Nesse momento, cumprir esses ${diasNum} dias TODAS as semanas vale mais do que tentar aumentar — consistência primeiro, volume depois.`,
    "rotina-eficiente": `Com ${diasNum} dias e sessões de ${tempo === "30" ? "até 30" : "até 45"} minutos, o segredo é densidade: treinos enxutos, exercícios que rendem e zero enrolação. Dá para evoluir muito com isso.`,
    "emagrecimento-estrutura": `Seus ${diasNum} dias por semana são suficientes para emagrecer com qualidade — desde que combinados com o ajuste alimentar. Mais treino não compensa dieta desorganizada.`,
    "hipertrofia-progressao": `${diasNum} dias por semana comportam uma divisão de treino eficiente para hipertrofia. O fator decisivo não será a quantidade de dias, e sim progredir carga e execução semana a semana.`,
    "evolucao-treino": `${diasNum} dias por semana estão adequados. O que precisa mudar não é a frequência — é a qualidade do estímulo dentro de cada sessão.`,
    "base-qualidade": `${diasNum} dias por semana é um excelente ponto de partida. Regularidade nesses dias já muda disposição, sono e condicionamento nas primeiras semanas.`,
  };

  // 4) Explicação personalizada
  const objLabel = OBJETIVO_LABEL[objetivo] ?? objetivo;
  const difLabel = DIFICULDADE_LABEL[dificuldade] ?? dificuldade;
  const situPart =
    situacao === "parado"
      ? "está sem treinar no momento"
      : situacao === "sem-estrutura"
        ? "já treina, mas sem estrutura definida"
        : "já tem alguma rotina de treino";
  const explanationByProfile: Record<ProfileId, string> = {
    "retorno-consistencia": `Você quer ${objLabel} e ${situPart} — e o que mais pesa hoje é ${difLabel}. Por isso o seu ponto de partida não é um plano mais “pesado”, e sim um plano que você consiga sustentar. Estrutura realista vence empolgação de segunda-feira.`,
    "rotina-eficiente": `Você quer ${objLabel}, ${situPart}, e o tempo é o seu recurso mais escasso. O caminho é uma rotina eficiente: poucos exercícios, bem escolhidos, com intensidade certa — feita para caber na sua agenda real.`,
    "emagrecimento-estrutura": `Você quer ${objLabel} e ${situPart}. Emagrecimento sustentável nasce de estrutura: treino de força como base, gasto calórico organizado e hábitos que se mantêm — sem radicalismo que dura duas semanas.`,
    "hipertrofia-progressao": `Você quer ${objLabel} e ${situPart}. Hipertrofia responde a uma coisa acima de todas: progressão organizada. Um plano com cargas, volume e recuperação calibrados vai fazer cada treino contar.`,
    "evolucao-treino": `Você quer ${objLabel} e ${situPart} — mas sente que o resultado estagnou. Isso quase nunca é falta de esforço: é estímulo repetido demais. Pequenos ajustes de plano costumam destravar rápido.`,
    "base-qualidade": `Você quer ${objLabel} e ${situPart}. A prioridade é construir uma base: força, disposição e condicionamento que aparecem no dia a dia — energia, sono e saúde antes da estética.`,
  };

  const priorityByProfile: Record<ProfileId, string> = {
    "retorno-consistencia": "Sua prioridade agora: transformar treino em hábito — antes de intensificar qualquer coisa.",
    "rotina-eficiente": "Sua prioridade agora: extrair o máximo de cada minuto disponível, com um plano enxuto e direto.",
    "emagrecimento-estrutura": "Sua prioridade agora: estruturar treino + alimentação como um sistema único, sustentável.",
    "hipertrofia-progressao": "Sua prioridade agora: progressão registrada — carga, repetições e execução evoluindo semana a semana.",
    "evolucao-treino": "Sua prioridade agora: variar o estímulo com critério, não com achismo.",
    "base-qualidade": "Sua prioridade agora: regularidade — o corpo responde rápido quando o estímulo vira rotina.",
  };

  const stepsByProfile: Record<ProfileId, [string, string, string]> = {
    "retorno-consistencia": [
      "Marque no calendário os dias e horários exatos dos seus treinos desta semana — compromisso marcado é compromisso cumprido.",
      "Comece com treinos mais curtos do que você acha que aguenta: sobrar energia aumenta a chance de voltar no próximo.",
      "Defina um plano mínimo para a semana ruim (ex.: 2 treinos de 30 min) — é ele que impede o abandono.",
    ],
    "rotina-eficiente": [
      "Priorize exercícios multiarticulares — eles entregam mais resultado por minuto.",
      "Deixe o treino pronto antes de chegar: decidir na hora consome tempo e foco.",
      "Controle os descansos com o relógio — é onde treinos curtos mais desperdiçam tempo.",
    ],
    "emagrecimento-estrutura": [
      "Estabeleça um déficit calórico moderado — agressivo demais não se sustenta.",
      "Trate a musculação como base do processo: preservar músculo mantém o metabolismo trabalhando a seu favor.",
      "Escolha um único indicador de progresso (medidas ou fotos mensais) e ignore a balança diária.",
    ],
    "hipertrofia-progressao": [
      "Registre suas cargas — sem histórico não existe progressão, existe repetição.",
      "Garanta proteína suficiente distribuída no dia; sem matéria-prima o estímulo não vira músculo.",
      "Durma como quem treina: a recuperação é onde o crescimento acontece.",
    ],
    "evolucao-treino": [
      "Audite seu treino atual: quanto tempo faz que as cargas e os exercícios são os mesmos?",
      "Ajuste uma variável por vez (carga, volume, cadência ou exercício) para saber o que funcionou.",
      "Reavalie a execução dos principais exercícios — amplitude e controle valem mais do que carga nova.",
    ],
    "base-qualidade": [
      "Comece pelo simples: 2 a 3 treinos de corpo inteiro por semana já geram adaptação real.",
      "Some movimento fora do treino — caminhadas e escadas contam mais do que parecem.",
      "Se está há muito tempo parado, uma avaliação médica de rotina antes de intensificar é sempre bom cuidado.",
    ],
  };

  // 5) Artigos — base do perfil + ajustes de contexto
  let articles = [...ARTICLES[profileId]];
  if (local === "casa" && profileId !== "rotina-eficiente") {
    articles = [CASA_ARTICLE, ...articles.slice(0, 2)];
  } else if (experiencia === "zero" && profileId === "emagrecimento-estrutura") {
    articles = [OBESO_ARTICLE, ...articles.slice(0, 2)];
  } else if (experiencia === "zero" && profileId === "hipertrofia-progressao") {
    articles = [INICIANTE_ARTICLE, ...articles.slice(0, 2)];
  }

  return {
    profileId,
    profileName: PROFILE_NAMES[profileId],
    explanation: explanationByProfile[profileId],
    priority: priorityByProfile[profileId],
    frequency: frequencyByProfile[profileId],
    bottleneck: BOTTLENECK_TEXT[dificuldade] ?? BOTTLENECK_TEXT["nao-sei"],
    modality,
    modalityReason,
    steps: stepsByProfile[profileId],
    articles,
  };
}

// ── Mensagem de WhatsApp ─────────────────────────────────────────────────────

export function buildWhatsAppMessage(answers: Answers, result: DiagnosticoResult): string {
  const objetivo = OBJETIVO_LABEL[answers.objetivo ?? ""] ?? "definir meu objetivo";
  const dias = answers.dias === "5" ? "5+" : (answers.dias ?? "?");
  const dif = DIFICULDADE_LABEL[answers.dificuldade ?? ""] ?? "—";
  return (
    `Oi, Montinho! Fiz o Diagnóstico Montinho no site.\n` +
    `Meu perfil: ${result.profileName}\n` +
    `Objetivo: ${objetivo}\n` +
    `Disponibilidade: ${dias} dias por semana\n` +
    `Maior dificuldade: ${dif}\n` +
    `Modalidade indicada: ${result.modality}\n` +
    `Quero entender qual seria o próximo passo.`
  );
}
