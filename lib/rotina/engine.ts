/**
 * Motor do Treino Para Minha Rotina.
 *
 * Função pura e determinística: as mesmas respostas produzem sempre o mesmo
 * plano. Nenhuma chamada de LLM, nenhuma aleatoriedade. As regras estão
 * documentadas inline e cada uma aponta para um princípio em evidence.ts —
 * se não há princípio que sustente, a regra não existe.
 *
 * O que o motor entrega é uma ESTRUTURA (divisão, frequência, duração,
 * distribuição na semana, plano B), nunca uma ficha com exercícios e cargas.
 * Individualização de verdade é papel do acompanhamento, e a ferramenta diz
 * isso explicitamente.
 */

export type Objetivo = "massa" | "emagrecer" | "forca" | "saude" | "voltar";
export type Dias = 2 | 3 | 4 | 5 | 6;
export type Tempo = "ate30" | "30a45" | "45a60" | "60a75" | "75mais";
export type Experiencia = "iniciante" | "base" | "intermediario" | "avancado";
export type Ambiente = "academia" | "condominio" | "casa_equipada" | "casa_pouco";
export type Distribuicao = "espalhados" | "consecutivos" | "variavel" | "fim_de_semana" | "nao_sei";
export type Barreira =
  | "tempo" | "imprevisivel" | "cansaco" | "motivacao"
  | "nao_saber" | "longos" | "abandono" | "raro" | "viagens";
export type Preferencia = "fullbody" | "dividido" | "tanto_faz";
export type Prioridade = "pernas" | "gluteos" | "quadriceps" | "posteriores" | "peito" | "costas" | "ombros" | "bracos";
export type Recuperacao = "bem" | "medio" | "cansado" | "nao_sei";
export type Cardio = "nao" | "pouco" | "muito";

export interface RotinaAnswers {
  objetivo: Objetivo;
  dias: Dias;
  tempo: Tempo;
  experiencia: Experiencia;
  ambiente: Ambiente;
  distribuicao: Distribuicao;
  barreira: Barreira;
  preferencia: Preferencia;
  /** Gate de segurança: dor/condição que exige adaptação individual. */
  temLimitacao: boolean;
  /**
   * V2 — todos opcionais, para quem não respondeu (estado salvo antigo,
   * links pré-configurados) continuar funcionando.
   * diasSelecionados: os dias da semana que normalmente existem (0=SEG).
   * Pode ter MAIS dias que `dias`: a sobra vira margem para o Plano B.
   */
  diasSelecionados?: number[];
  /** "Meus dias mudam toda semana": sequência em vez de calendário. */
  agendaVariavel?: boolean;
  prioridades?: Prioridade[];
  recuperacao?: Recuperacao;
  /** Cardio ou esporte que cansa as pernas (corrida, futebol, bike…). */
  cardio?: Cardio;
}

export interface OpcaoRanking {
  id: string;
  nome: string;
  rotulo: "Melhor encaixe" | "Boa alternativa" | "Possível, mas menos conveniente";
  semana: WeekDay[];
  /** Motivos a favor, em frases curtas. */
  pros: string[];
  /** Por que não ficou em primeiro (vazio no primeiro). */
  contras: string[];
}

export interface WeekDay {
  dia: string; // SEG..DOM
  sessao: string | null; // "Treino A" | "Corpo inteiro" | null
}

export interface RotinaPlan {
  /** id estável da estrutura — vai para analytics. */
  structureId: string;
  /** Nome legível: "Full Body — 3x por semana". */
  structureName: string;
  sessoesPorSemana: number;
  duracaoAlvo: string;
  /** true quando recomendamos menos sessões do que os dias disponíveis. */
  usaMenosQueDisponivel: boolean;
  semana: WeekDay[];
  /** Dias sugeridos (índices 0=SEG..6=DOM) para o seletor de agenda. */
  diasSugeridos: number[];
  porque: string;
  porqueNaoMais: string | null;
  focos: string[];
  riscoAderencia: { titulo: string; texto: string };
  planoB: { estrutura: string; texto: string };
  /** Ajuste comunicado quando os dias reais são consecutivos/variáveis. */
  notaDistribuicao: string | null;
  /** Nota de tempo curto (dose mínima) quando tempo ≤ 30–45. */
  notaTempo: string | null;
  /** Nota de objetivo (cardio p/ emagrecimento etc.), só quando há lógica. */
  notaObjetivo: string | null;
  /** Artigos reais relacionados — slugs verificados contra lib/blog. */
  artigos: Array<{ slug: string; title: string }>;
  /** ids de evidence.ts que sustentam este plano. */
  evidencia: string[];
  temLimitacao: boolean;
  // ── V2 ─────────────────────────────────────────────────────────────────
  /** Até 3 estruturas, a primeira é a recomendada. Sem score exposto. */
  ranking: OpcaoRanking[];
  /** "Por que escolhemos": checklist curta. */
  porqueLista: string[];
  /** Calendário fixo ou sequência contínua (agenda que muda). */
  modo: "calendario" | "sequencia";
  /** Ordem das sessões, para o modo sequência e o "perdi um treino". */
  sequencia: string[];
  /** Quantas vezes cada região é treinada na semana. */
  frequencia: Array<{ regiao: string; vezes: number }>;
  /** Tempo semanal de musculação (sem deslocamento). */
  tempoSemanal: string;
  cabe: { ok: boolean; texto: string };
  /** Nota sobre a(s) prioridade(s) muscular(es), sem prescrição. */
  notaPrioridade: string | null;
  /** Dias marcados além das sessões: margem para remarcar. */
  margem: number;
}

const DIAS_SEMANA = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];

const TEMPO_LABEL: Record<Tempo, string> = {
  ate30: "cerca de 30 minutos",
  "30a45": "30–45 minutos",
  "45a60": "45–60 minutos",
  "60a75": "60–75 minutos",
  "75mais": "mais de 75 minutos",
};

const OBJETIVO_LABEL: Record<Objetivo, string> = {
  massa: "ganhar massa muscular",
  emagrecer: "emagrecer preservando musculatura",
  forca: "ganhar força",
  saude: "saúde e condicionamento",
  voltar: "voltar a treinar com consistência",
};

/** Distribui N sessões na semana começando na segunda, com folga entre elas. */
function distribuir(n: number, consecutivos: boolean): number[] {
  if (consecutivos) return Array.from({ length: n }, (_, i) => i); // SEG..(SEG+n)
  const mapas: Record<number, number[]> = {
    1: [0],
    2: [0, 3], // SEG QUI
    3: [0, 2, 4], // SEG QUA SEX
    4: [0, 1, 3, 4], // SEG TER QUI SEX
    5: [0, 1, 2, 4, 5], // SEG TER QUA SEX SÁB
    6: [0, 1, 2, 3, 4, 5],
  };
  return mapas[n] ?? mapas[3];
}


export function computeRotina(a: RotinaAnswers): RotinaPlan {
  const evidencia: string[] = ["acsm_rt_guidelines", "prescription_network", "montinho_practice"];

  // ---------------------------------------------------------------- sessões
  // Regra: iniciante e quem está voltando não usa todos os dias disponíveis.
  // Disponibilidade alta não vira obrigação de volume (beginner_dose).
  let sessoes: number = a.dias;
  const conservador = a.experiencia === "iniciante" || a.objetivo === "voltar";
  if (conservador && sessoes > 3) {
    sessoes = 3;
    evidencia.push("beginner_dose");
  }
  if (a.experiencia === "base" && sessoes > 4) sessoes = 4;

  const usaMenos = sessoes < a.dias;

  // ------------------------------------------------------------- estrutura
  // A divisão distribui o trabalho; com volume equiparado os resultados são
  // semelhantes (volume_over_split). Então o ranking não procura "a melhor
  // divisão": procura a que cabe nos dias que existem, respeita recuperação
  // entre dias seguidos, cabe no tempo e é simples o bastante para o momento
  // da pessoa (rankTrainingSplits, abaixo). Preferência desempata.
  const ranking = rankTrainingSplits(a, sessoes);
  const primeira = ranking[0];
  const split = SPLITS.find((x) => x.id === primeira.id)!;
  const structureId = split.id;
  const structureName = split.nome;
  if (a.preferencia !== "tanto_faz") evidencia.push("sdt_adherence");
  evidencia.push("volume_over_split");

  const consecutivos = temDiasSeguidos(primeira.semana);
  let notaDistribuicao: string | null = null;
  if (a.agendaVariavel || (!a.diasSelecionados && a.distribuicao === "variavel")) {
    notaDistribuicao =
      "Sua agenda varia — então a estrutura não depende de dias fixos. O que importa é completar as sessões da semana, na ordem, nos dias que aparecerem.";
  } else if (consecutivos && structureId.startsWith("fb")) {
    notaDistribuicao =
      "Como seus treinos ficam em dias seguidos, cada sessão de corpo inteiro alterna a ênfase (um dia mais membros superiores, outro mais inferiores). Assim um grupamento descansa enquanto o outro trabalha — sem exigir que sua agenda mude.";
    evidencia.push("recovery_distribution");
  } else if (consecutivos) {
    evidencia.push("recovery_distribution");
  }

  // ------------------------------------------------------------------ tempo
  let notaTempo: string | null = null;
  if (a.tempo === "ate30") {
    notaTempo =
      "Menos tempo muda a estratégia — não torna o treino inútil. Com ~30 minutos, a sessão prioriza poucos exercícios de alto valor (multiarticulares), descansos controlados e zero enrolação. A pesquisa sobre dose mínima mostra que isso produz adaptações reais.";
    evidencia.push("minimal_dose");
  } else if (a.tempo === "30a45") {
    notaTempo =
      "Com 30–45 minutos a sessão funciona bem sendo direta: exercícios principais primeiro, acessórios só se sobrar tempo.";
    evidencia.push("minimal_dose");
  }

  // --------------------------------------------------------------- objetivo
  let notaObjetivo: string | null = null;
  if (a.objetivo === "emagrecer") {
    notaObjetivo =
      "Para emagrecer, a musculação preserva a massa muscular enquanto o déficit calórico faz o peso descer. Caminhada ou cardio leve nos dias livres ajuda no gasto — mas é opcional, não obrigação.";
  } else if (a.objetivo === "forca") {
    notaObjetivo =
      "Para força, as sessões giram em torno dos levantamentos principais com cargas mais altas e descansos mais longos — o que também favorece sessões objetivas.";
  } else if (a.objetivo === "saude") {
    notaObjetivo =
      "Para saúde e condicionamento, a musculação é a base e o dia opcional pode virar caminhada, mobilidade ou um cardio que você goste.";
  }

  // --------------------------------------------------------------- barreira
  const risco: Record<Barreira, { titulo: string; texto: string }> = {
    tempo: {
      titulo: "Sua maior barreira: falta de tempo",
      texto:
        "Seu plano não deve depender de sessões enormes. Por isso a estrutura cabe no tempo que você declarou como real — e o Plano B existe para a semana em que nem isso couber.",
    },
    imprevisivel: {
      titulo: "Sua maior barreira: agenda imprevisível",
      texto:
        "A estrutura não depende de dias fixos: as sessões têm ordem, não data. Perdeu um dia? A sequência continua no próximo dia possível.",
    },
    cansaco: {
      titulo: "Sua maior barreira: cansaço",
      texto:
        "Sessões objetivas cansam menos que sessões longas — e treino feito cansado a 80% vale mais que treino perfeito adiado. Se o dia estiver pesado, o Plano B é a versão curta, não o sofá.",
    },
    motivacao: {
      titulo: "Sua maior barreira: motivação",
      texto:
        "Você não precisa depender de estar motivado todos os dias. Precisa reduzir o número de decisões para começar: dia definido, estrutura definida, sessão definida. A motivação costuma aparecer depois do aquecimento, não antes.",
    },
    nao_saber: {
      titulo: "Sua maior barreira: não saber o que fazer",
      texto:
        "A estrutura resolve metade disso: você sempre sabe qual sessão é a próxima. A outra metade — quais exercícios, quanto peso, como progredir — é exatamente o que um acompanhamento individual resolve.",
    },
    longos: {
      titulo: "Sua maior barreira: treinos longos demais",
      texto:
        "Então o plano não tem sessão longa. Duração alvo definida, poucos exercícios de alto valor, e a sessão termina quando cumpre o essencial — não quando você desaba.",
    },
    abandono: {
      titulo: "Sua maior barreira: começar forte e abandonar",
      texto:
        "Por isso a estrutura começa pelo sustentável, não pelo máximo. A progressão vem depois da consistência — aumentar o desafio de um plano que você já cumpre é fácil; sustentar um plano máximo desde o dia 1 é o que gera o ciclo de abandono.",
    },
    viagens: {
      titulo: "Sua maior barreira: viagens",
      texto:
        "Semana de viagem não precisa ser semana perdida: siga a sequência, não o calendário, e use a versão curta do Plano B onde der — hotel, condomínio ou só o peso do corpo. Na volta, você continua de onde parou, sem recomeçar.",
    },
    raro: {
      titulo: "Você raramente perde treinos",
      texto:
        "Consistência já é o seu forte — então a estrutura pode puxar um pouco mais em progressão e organização, que é onde você ganha mais agora.",
    },
  };
  if (a.barreira === "motivacao" || a.barreira === "abandono") evidencia.push("sdt_adherence");

  // ----------------------------------------------------------------- plano B
  const planoBEstrutura =
    sessoes <= 2 ? "1 sessão de corpo inteiro" : sessoes <= 4 ? "Full Body — 2x" : "Full Body — 2 a 3x";
  const planoB = {
    estrutura: planoBEstrutura,
    texto:
      `Semana normal: ${structureName.toLowerCase()}. Semana que apertou: ${planoBEstrutura.toLowerCase()}, priorizando os movimentos principais. O Plano B não existe para substituir sua estratégia — existe para impedir que uma semana ruim vire abandono. ${sessoes} virar ${planoBEstrutura.match(/\d/)?.[0] ?? "menos"} é ajuste; ${sessoes} virar 0 é recomeço.`,
  };
  evidencia.push("implementation_intentions");

  // ----------------------------------------------------------------- textos
  const diasTxt = `${a.dias} dias`;
  const porque = `Você tem ${diasTxt} e ${TEMPO_LABEL[a.tempo]} por sessão, e quer ${OBJETIVO_LABEL[a.objetivo]}. Em vez de encaixar uma divisão pensada para outra rotina, essa estrutura distribui seu trabalho semanal pelas ${sessoes} sessões que você realmente consegue cumprir — com cada grupamento sendo estimulado mais de uma vez na semana.`;

  const porqueNaoMais = usaMenos
    ? `Você tem ${a.dias} dias disponíveis, mas recomendamos ${sessoes} sessões. Mais dias não seriam necessariamente melhores agora: ${
        conservador
          ? "no seu momento, o corpo progride com menos sessões — e sobra recuperação, que é onde o resultado acontece. Quando as " + sessoes + " sessões estiverem consistentes há algumas semanas, adicionar um dia é um passo natural"
          : "a estrutura atual já cobre o estímulo semanal necessário; o dia extra pode entrar como sessão opcional leve quando a rotina estiver rodando"
      }. Um plano que depende de ${a.dias} sessões quando ${sessoes} bastam cria um problema antes mesmo do treino começar.`
    : null;

  const focos = [
    "Movimentos principais primeiro",
    "Volume distribuído pela semana",
    "Progressão gradual de carga ou repetições",
    "Consistência antes de complexidade",
  ];

  // ----------------------------------------------------------------- artigos
  // Slugs verificados contra lib/blog.ts — nunca inventados.
  const artigos: Array<{ slug: string; title: string }> = [];
  const add = (slug: string, title: string) => {
    if (artigos.length < 4 && !artigos.some((x) => x.slug === slug)) artigos.push({ slug, title });
  };
  if (structureId.startsWith("fb")) add("full-body-vs-divisao-abc", "Full Body vs Divisão ABC");
  if (structureId.startsWith("ul")) add("treino-upper-lower-superior-inferior", "Treino Upper/Lower");
  if (structureId.startsWith("ppl")) add("push-pull-legs", "Push Pull Legs: como montar e para quem serve");
  add("frequencia-de-treino", "Frequência de treino: quantas vezes por semana?");
  if (a.tempo === "ate30" || a.tempo === "30a45") add("treino-de-30-minutos-funciona", "Treino de 30 minutos funciona?");
  if (a.ambiente === "casa_pouco" || a.ambiente === "casa_equipada")
    add("treino-em-casa-sem-equipamento", "Treino em casa sem equipamento");
  if (a.objetivo === "massa") add("como-montar-treino-de-hipertrofia", "Como montar um treino de hipertrofia");
  if (a.objetivo === "emagrecer") add("musculacao-emagrece", "Musculação emagrece?");
  if (a.objetivo === "voltar") add("como-voltar-academia-depois-de-parado", "Como voltar à academia depois de parado");
  if (a.experiencia === "iniciante") add("primeira-semana-na-academia", "Primeira semana na academia");
  add("treinar-todos-os-dias-faz-mal", "Treinar todos os dias faz mal?");

  const semana = primeira.semana;
  const diasSugeridos = semana.map((d, i) => (d.sessao ? i : -1)).filter((i) => i >= 0);
  const modo: RotinaPlan["modo"] = a.agendaVariavel || (!a.diasSelecionados && a.distribuicao === "variavel") ? "sequencia" : "calendario";
  const [tMin, tMax] = TEMPO_MIN[a.tempo];
  const h = (m: number) => { const hh = Math.floor(m / 60), mm = m % 60; return hh ? `${hh}h${mm ? String(mm).padStart(2, "0") : ""}` : `${mm} min`; };
  const tempoSemanal = tMax ? `${h(sessoes * tMin)} a ${h(sessoes * tMax)} por semana` : `${h(sessoes * tMin)} ou mais por semana`;
  const apertado = TEMPO_MIN[a.tempo][1] !== null && (TEMPO_MIN[a.tempo][1] as number) < split.tempoMin;
  const cabe = apertado
    ? { ok: false, texto: `Dá para fazer, mas fica apertado: essa estrutura costuma pedir sessões de ${split.tempoMin} minutos ou mais. Com o seu tempo, o ajuste é reduzir o número de exercícios por sessão e priorizar os principais.` }
    : { ok: true, texto: `Parece compatível com o tempo que você declarou: ${sessoes} sessões de ${TEMPO_LABEL[a.tempo]}.` };
  const freqMap = new Map<string, number>();
  for (const sess of split.sessoes) for (const r of REGIOES_DA_SESSAO[sess.tipo]) freqMap.set(r, (freqMap.get(r) ?? 0) + 1);
  const frequencia = [...freqMap.entries()].map(([regiao, vezes]) => ({ regiao: NOME_REGIAO[regiao as Regiao], vezes }));
  const prios = (a.prioridades ?? []).slice(0, 2);
  let notaPrioridade: string | null = null;
  if (prios.length) {
    const nomesP = prios.map((p) => NOME_PRIORIDADE[p]).join(" e ");
    const regs = new Set(prios.map((p) => REGIAO_DA_PRIORIDADE[p]));
    const vezes = Math.max(...[...regs].map((r) => split.sessoes.filter((x) => REGIOES_DA_SESSAO[x.tipo].includes(r)).length));
    notaPrioridade = vezes >= 2
      ? `Prioridade em ${nomesP}: essa estrutura passa por ${nomesP.includes(" e ") ? "elas" : "ela"} ${vezes} vezes na semana. Na primeira sessão da semana, ${nomesP} entra no começo, com o corpo descansado; na outra, um segundo estímulo. Quantos exercícios e séries fica para o seu treino, não para esta ferramenta.`
      : `Prioridade em ${nomesP}: nessa estrutura, ${nomesP} é treinado uma vez na semana. Para priorizar, vale começar essa sessão por ${nomesP}; se a prioridade for grande, uma estrutura que repita a região na semana pode encaixar melhor.`;
  }
  const porqueLista = primeira.pros;
  const margem = Math.max(0, (a.diasSelecionados?.length ?? 0) - sessoes);

  return {
    structureId,
    structureName,
    sessoesPorSemana: sessoes,
    duracaoAlvo: TEMPO_LABEL[a.tempo],
    usaMenosQueDisponivel: usaMenos,
    semana,
    diasSugeridos,
    porque,
    porqueNaoMais,
    focos,
    riscoAderencia: risco[a.barreira],
    planoB,
    notaDistribuicao,
    notaTempo,
    notaObjetivo,
    artigos,
    evidencia: [...new Set(evidencia)],
    temLimitacao: a.temLimitacao,
    ranking,
    porqueLista,
    modo,
    sequencia: split.sessoes.map((x) => x.nome),
    frequencia,
    tempoSemanal,
    cabe,
    notaPrioridade,
    margem,
  };
}

/**
 * Valida a escolha de dias do usuário na etapa de agenda.
 * Nunca diz "errado": sugere alternativa quando há concentração e a estrutura
 * se beneficia de melhor distribuição. A vida real vence o calendário.
 */
export function validarDias(escolhidos: number[], plan: RotinaPlan): string | null {
  if (escolhidos.length === 0) return null;
  const orden = [...escolhidos].sort((a, b) => a - b);
  let maiorSequencia = 1;
  let atual = 1;
  for (let i = 1; i < orden.length; i++) {
    atual = orden[i] === orden[i - 1] + 1 ? atual + 1 : 1;
    maiorSequencia = Math.max(maiorSequencia, atual);
  }
  if (maiorSequencia >= 3 && plan.structureId.startsWith("fb")) {
    const alt = plan.diasSugeridos.map((i) => DIAS_SEMANA[i]).join(" / ");
    return `Essa distribuição concentra seus treinos em dias seguidos. Se você tiver flexibilidade, ${alt} distribui melhor a recuperação. Se esses são os dias que existem na sua vida, siga com eles — cada sessão alterna a ênfase para compensar.`;
  }
  if (escolhidos.length < plan.sessoesPorSemana) {
    return `Você marcou ${escolhidos.length} dia(s) para ${plan.sessoesPorSemana} sessões. Sem problema: as sessões têm ordem, não data — a que faltar entra na semana seguinte, ou vale ativar o Plano B (${plan.planoB.estrutura}).`;
  }
  return null;
}

/**
 * Mensagem que a pessoa envia ao abrir o WhatsApp a partir do resultado.
 *
 * Leva só o contexto de treino que ela mesma declarou — nada de dado pessoal,
 * clínico ou de identificação. O objetivo é que a conversa comece já sabendo
 * a rotina, e não em "oi, quanto custa?".
 */
export function buildRotinaWhatsApp(
  plan: RotinaPlan,
  a: RotinaAnswers,
  diasEscolhidos?: number[]
): string {
  const agenda =
    diasEscolhidos && diasEscolhidos.length > 0
      ? `Dias que reservei: ${diasEscolhidos.map((i) => DIAS_SEMANA[i]).join(", ")}\n`
      : "";
  return (
    `Oi, Montinho! Fiz o Treino Para Minha Rotina no seu site.\n\n` +
    `Estrutura sugerida: ${plan.structureName}\n` +
    `Disponibilidade: ${a.dias} dias por semana\n` +
    `Tempo por sessão: ${TEMPO_LABEL[a.tempo]}\n` +
    agenda +
    `Objetivo: ${OBJETIVO_LABEL[a.objetivo]}\n\n` +
    `Quero entender como transformar essa estrutura em um treino individualizado.`
  );
}

export { DIAS_SEMANA, TEMPO_LABEL, OBJETIVO_LABEL };

// ═══════════════════════════════════════════════════════════════════════════
// V2 — catálogo de divisões, calendário, ranking e Plano B
// ═══════════════════════════════════════════════════════════════════════════

type Regiao = "sup" | "inf" | "push" | "pull";
type TipoSessao = "fb" | "sup" | "inf" | "push" | "pull" | "legs" | "abcA" | "abcB" | "abcC" | "abcdD";

/** Que regiões cada tipo de sessão cansa — usado para dias seguidos e frequência. */
const REGIOES_DA_SESSAO: Record<TipoSessao, Regiao[]> = {
  fb: ["sup", "inf"],
  sup: ["sup"],
  inf: ["inf"],
  push: ["push"],
  pull: ["pull"],
  legs: ["inf"],
  abcA: ["push"], // peito, ombro, tríceps
  abcB: ["pull"], // costas, bíceps
  abcC: ["inf"], // pernas
  abcdD: ["push", "pull"], // ombros e braços
};
const NOME_REGIAO: Record<Regiao, string> = { sup: "Parte superior", inf: "Parte inferior", push: "Empurrar (peito, ombro, tríceps)", pull: "Puxar (costas, bíceps)" };
const sobrepoe = (a: TipoSessao, b: TipoSessao) => {
  const ra = REGIOES_DA_SESSAO[a], rb = REGIOES_DA_SESSAO[b];
  const exp = (r: Regiao[]) => r.flatMap((x) => (x === "sup" ? ["push", "pull"] : [x]));
  return exp(ra).some((x) => exp(rb).includes(x));
};

const NOME_PRIORIDADE: Record<Prioridade, string> = { pernas: "pernas", gluteos: "glúteos", quadriceps: "quadríceps", posteriores: "posteriores de coxa", peito: "peito", costas: "costas", ombros: "ombros", bracos: "braços" };
const REGIAO_DA_PRIORIDADE: Record<Prioridade, Regiao> = { pernas: "inf", gluteos: "inf", quadriceps: "inf", posteriores: "inf", peito: "push", costas: "pull", ombros: "push", bracos: "push" };

/** Minutos [mín, máx] declarados. null = sem teto. */
const TEMPO_MIN: Record<Tempo, [number, number | null]> = { ate30: [25, 30], "30a45": [30, 45], "45a60": [45, 60], "60a75": [60, 75], "75mais": [75, null] };

export interface Split {
  id: string;
  nome: string;
  sessoes: Array<{ nome: string; tipo: TipoSessao }>;
  /** 1 = simples de lembrar e executar; 3 = mais peças para encaixar. */
  complexidade: 1 | 2 | 3;
  /** Duração típica mínima de uma sessão que cumpre o papel dela. */
  tempoMin: number;
  familia: "fullbody" | "dividido";
  /** Funciona bem como sequência A→B que continua de onde parou. */
  sequenciaSimples: boolean;
  descricao: string;
}

const S = (nome: string, tipo: TipoSessao) => ({ nome, tipo });
export const SPLITS: Split[] = [
  { id: "fb2", nome: "Full Body — 2x por semana", sessoes: [S("Treino A", "fb"), S("Treino B", "fb")], complexidade: 1, tempoMin: 40, familia: "fullbody", sequenciaSimples: true, descricao: "corpo inteiro nas duas sessões" },
  { id: "ul2", nome: "Superior / Inferior — 2x por semana", sessoes: [S("Superior", "sup"), S("Inferior", "inf")], complexidade: 1, tempoMin: 40, familia: "dividido", sequenciaSimples: true, descricao: "cada metade do corpo uma vez" },
  { id: "fb3", nome: "Full Body — 3x por semana", sessoes: [S("Treino A", "fb"), S("Treino B", "fb"), S("Treino C", "fb")], complexidade: 1, tempoMin: 35, familia: "fullbody", sequenciaSimples: true, descricao: "corpo inteiro em todas as sessões" },
  { id: "ul3", nome: "Upper / Lower alternado — 3x por semana", sessoes: [S("Superior", "sup"), S("Inferior", "inf"), S("Superior", "sup")], complexidade: 1, tempoMin: 35, familia: "dividido", sequenciaSimples: true, descricao: "superior e inferior alternando; na semana seguinte começa pelo inferior" },
  { id: "ulf3", nome: "Superior / Inferior / Corpo inteiro — 3x por semana", sessoes: [S("Superior", "sup"), S("Inferior", "inf"), S("Corpo inteiro", "fb")], complexidade: 2, tempoMin: 40, familia: "dividido", sequenciaSimples: true, descricao: "uma sessão de cada metade e uma de corpo inteiro" },
  { id: "ppl3", nome: "ABC (Empurrar / Puxar / Pernas) — 3x por semana", sessoes: [S("A · Empurrar", "abcA"), S("B · Puxar", "abcB"), S("C · Pernas", "abcC")], complexidade: 2, tempoMin: 45, familia: "dividido", sequenciaSimples: true, descricao: "cada grupo em uma sessão por semana" },
  { id: "ul4", nome: "Upper / Lower — 4x por semana", sessoes: [S("Superior A", "sup"), S("Inferior A", "inf"), S("Superior B", "sup"), S("Inferior B", "inf")], complexidade: 2, tempoMin: 40, familia: "dividido", sequenciaSimples: true, descricao: "cada metade do corpo duas vezes" },
  { id: "fb4", nome: "Full Body — 4x por semana (volume distribuído)", sessoes: [S("Treino A", "fb"), S("Treino B", "fb"), S("Treino C", "fb"), S("Treino D", "fb")], complexidade: 1, tempoMin: 30, familia: "fullbody", sequenciaSimples: true, descricao: "corpo inteiro com sessões mais curtas" },
  { id: "abcd4", nome: "ABCD — 4x por semana", sessoes: [S("A · Peito", "abcA"), S("B · Costas", "abcB"), S("C · Pernas", "abcC"), S("D · Ombros e braços", "abcdD")], complexidade: 2, tempoMin: 45, familia: "dividido", sequenciaSimples: false, descricao: "cada grupo uma vez por semana" },
  { id: "ul5", nome: "Upper / Lower + sessão extra — 5x por semana", sessoes: [S("Superior A", "sup"), S("Inferior A", "inf"), S("Superior B", "sup"), S("Inferior B", "inf"), S("Corpo inteiro", "fb")], complexidade: 2, tempoMin: 40, familia: "dividido", sequenciaSimples: true, descricao: "upper/lower duas vezes e um corpo inteiro" },
  { id: "pplul5", nome: "Push / Pull / Legs + Upper / Lower — 5x por semana", sessoes: [S("Empurrar", "push"), S("Puxar", "pull"), S("Pernas", "legs"), S("Superior", "sup"), S("Inferior", "inf")], complexidade: 3, tempoMin: 45, familia: "dividido", sequenciaSimples: false, descricao: "um ciclo push/pull/legs e um upper/lower" },
  { id: "ul6", nome: "Upper / Lower — 3 ciclos na semana", sessoes: [S("Superior A", "sup"), S("Inferior A", "inf"), S("Superior B", "sup"), S("Inferior B", "inf"), S("Superior C", "sup"), S("Inferior C", "inf")], complexidade: 2, tempoMin: 35, familia: "dividido", sequenciaSimples: true, descricao: "cada metade três vezes, em sessões curtas" },
  { id: "ppl6", nome: "Push / Pull / Legs — 2x na semana", sessoes: [S("Empurrar A", "push"), S("Puxar A", "pull"), S("Pernas A", "legs"), S("Empurrar B", "push"), S("Puxar B", "pull"), S("Pernas B", "legs")], complexidade: 3, tempoMin: 45, familia: "dividido", sequenciaSimples: false, descricao: "cada grupo duas vezes, em seis dias" },
];

const temDiasSeguidos = (semana: WeekDay[]) => semana.some((d, i) => d.sessao && semana[(i + 1) % 7]?.sessao && i < 6);

/** Dias seguidos (inclui DOM→SEG) em que a sessão repete região. */
function conflitos(dias: number[], split: Split): number {
  let n = 0;
  for (let i = 0; i < dias.length; i++) {
    const j = (i + 1) % dias.length;
    if (j === 0 && dias.length < 2) break;
    const dif = (dias[j] - dias[i] + 7) % 7;
    if (dif === 1 && sobrepoe(split.sessoes[i].tipo, split.sessoes[j % split.sessoes.length].tipo)) n++;
  }
  return n;
}

/** Os dias de um subconjunto, mais espalhados possível (menor maior-sequência). */
function combinacoes(xs: number[], k: number): number[][] {
  if (k === 0) return [[]];
  if (xs.length < k) return [];
  const [h, ...t] = xs;
  return [...combinacoes(t, k - 1).map((c) => [h, ...c]), ...combinacoes(t, k)];
}

/**
 * Coloca as sessões da divisão nos dias reais. Se a pessoa marcou mais dias
 * que sessões, escolhe os que geram menos conflito de recuperação; se marcou
 * menos, usa os que existem (as sessões seguem em sequência).
 */
export function buildWeeklySchedule(split: Split, dias?: number[], consecutivosPadrao = false): WeekDay[] {
  const n = split.sessoes.length;
  let escolhidos: number[];
  if (dias && dias.length > 0) {
    const ord = [...new Set(dias)].sort((x, y) => x - y);
    if (ord.length <= n) escolhidos = ord;
    else {
      const cands = combinacoes(ord, n);
      escolhidos = cands.sort((x, y) => conflitos(x, split) - conflitos(y, split) || seguidos(x) - seguidos(y) || x.join().localeCompare(y.join()))[0];
    }
  } else escolhidos = distribuir(n, consecutivosPadrao);
  return DIAS_SEMANA.map((dia, i) => {
    const pos = escolhidos.indexOf(i);
    return { dia, sessao: pos >= 0 ? split.sessoes[pos % n].nome : null };
  });
}
const seguidos = (d: number[]) => d.filter((x, i) => i > 0 && x === d[i - 1] + 1).length;

/**
 * Ranking transparente. Pontos internos, nunca mostrados ao usuário — viram
 * "Melhor encaixe / Boa alternativa / Possível, mas menos conveniente".
 * Cada regra tem um motivo em palavras, e é o motivo que aparece.
 */
export function rankTrainingSplits(a: RotinaAnswers, sessoes: number): OpcaoRanking[] {
  const exp = a.experiencia;
  const iniciante = exp === "iniciante" || a.objetivo === "voltar";
  const consecutivosPadrao = a.distribuicao === "consecutivos" || a.distribuicao === "fim_de_semana";
  const variavel = !!a.agendaVariavel || (!a.diasSelecionados && a.distribuicao === "variavel");
  const tMax = TEMPO_MIN[a.tempo][1] ?? 120;
  const prios = (a.prioridades ?? []).map((p) => REGIAO_DA_PRIORIDADE[p]);
  const recupera = a.recuperacao ?? "nao_sei";

  const avaliados = SPLITS.filter((sp) => sp.sessoes.length === sessoes).map((sp) => {
    const semana = buildWeeklySchedule(sp, a.diasSelecionados, consecutivosPadrao);
    const dias = semana.map((d, i) => (d.sessao ? i : -1)).filter((i) => i >= 0);
    const conf = variavel ? 0 : conflitos(dias, sp);
    const freq = (r: Regiao) => sp.sessoes.filter((x) => REGIOES_DA_SESSAO[x.tipo].flatMap((y) => (y === "sup" ? ["push", "pull"] : [y])).includes(r === "sup" ? "push" : r)).length;
    const freqMin = Math.min(freq("push"), freq("pull"), freq("inf"));
    let pts = 0;
    const pros: string[] = [], contras: string[] = [];

    pros.push(`cabe nas ${sessoes} sessões que você consegue cumprir`);
    // Frequência por região: 2+ estímulos tende a facilitar distribuir o volume.
    if (freqMin >= 2) { pts += 2; pros.push("cada região é treinada pelo menos duas vezes na semana"); }
    else contras.push("cada região é treinada uma vez por semana, então cada sessão concentra mais trabalho");
    // Recuperação entre dias seguidos.
    if (conf === 0 && temDiasSeguidos(semana) && !variavel) pros.push("funciona com seus dias seguidos: a região de ontem descansa hoje");
    else if (conf === 0 && !variavel) pros.push("deixa espaço para recuperação entre as sessões");
    if (conf > 0) {
      const peso = sp.familia === "fullbody" ? 1 : 2; // corpo inteiro alterna ênfase
      pts -= conf * peso * (recupera === "cansado" ? 2 : 1);
      contras.push(sp.familia === "fullbody"
        ? `em ${conf === 1 ? "um par" : conf + " pares"} de dias seguidos o corpo inteiro trabalha de novo (dá para alternar a ênfase, mas recupera menos)`
        : `em ${conf === 1 ? "um par" : conf + " pares"} de dias seguidos a mesma região treinaria de novo`);
    }
    // Complexidade x momento.
    if (iniciante) { pts += sp.complexidade === 1 ? 3 : sp.complexidade === 2 ? 0 : -3; if (sp.complexidade === 1) pros.push("simples de lembrar e de executar, ideal para construir a base"); else contras.push("tem mais peças para encaixar do que o seu momento pede"); }
    else if (exp === "base") pts += sp.complexidade === 3 ? -1 : 0;
    else if (exp === "avancado" && sp.complexidade === 3) { pts += 1; pros.push("permite organizar mais volume com sessões específicas"); }
    // Tempo por sessão.
    if (tMax < sp.tempoMin) { pts -= 2; contras.push(`costuma pedir sessões de ${sp.tempoMin} min ou mais, acima do que você tem`); }
    else pros.push(`sessões compatíveis com ${TEMPO_LABEL[a.tempo]}`);
    // Prioridade muscular.
    if (prios.length && prios.every((r) => freq(r) >= 2)) { pts += 1; pros.push("passa pela sua prioridade duas vezes na semana"); }
    // Preferência legítima desempata.
    if (a.preferencia === sp.familia) { pts += 2; pros.push(sp.familia === "fullbody" ? "segue sua preferência por treinos de corpo inteiro" : "segue sua preferência por dividir o corpo"); }
    // Agenda que muda: sequência simples sobrevive melhor.
    if (variavel) { if (sp.sequenciaSimples) { pts += 1; pros.push("funciona como sequência: perdeu um dia, continua de onde parou"); } else { pts -= 1; contras.push("depende de uma ordem longa, que se embaralha quando a semana muda"); } }
    // Recuperação ruim ou muito cardio de perna: menos sessões pesadas de perna coladas.
    if ((recupera === "cansado" || a.cardio === "muito") && freq("inf") >= 3) { pts -= 1; contras.push("treina pernas muitas vezes para quem já chega cansado ou faz bastante cardio"); }
    // Prioridade: forma 2x de quase tudo é o padrão razoável; desempate estável.
    return { sp, semana, pts, pros, contras };
  });

  avaliados.sort((x, y) => y.pts - x.pts || SPLITS.indexOf(x.sp) - SPLITS.indexOf(y.sp));
  const topo = avaliados[0].pts;
  return avaliados.slice(0, 3).filter((x, i) => i === 0 || x.pts >= topo - 6).map((x, i) => ({
    id: x.sp.id,
    nome: x.sp.nome,
    rotulo: i === 0 ? "Melhor encaixe" : x.pts >= topo - 2 ? "Boa alternativa" : "Possível, mas menos conveniente",
    semana: x.semana,
    pros: x.pros,
    contras: i === 0 ? [] : x.contras.length ? x.contras : [`também funciona; ${avaliados[0].sp.nome.split(" —")[0]} só encaixou um pouco melhor nas suas respostas`],
  }));
}

/**
 * "Perdi um treino": a sequência continua no próximo dia disponível. Nada
 * de zerar a semana nem dobrar sessão: a última sessão passa para a semana
 * seguinte (ou entra num dia de margem, se houver).
 */
export function buildFallbackPlan(plan: RotinaPlan, perdido: number, diasLivres: number[] = []): { semana: WeekDay[]; texto: string } {
  const dias = plan.semana.map((d, i) => (d.sessao ? i : -1)).filter((i) => i >= 0);
  const idx = dias.indexOf(perdido);
  if (idx < 0) return { semana: plan.semana, texto: "" };
  const restantes = plan.semana.filter((d) => d.sessao).map((d) => d.sessao as string).slice(idx);
  const proximos = [...dias.slice(idx + 1), ...diasLivres.filter((x) => x > perdido && !dias.includes(x))].sort((x, y) => x - y);
  const semana: WeekDay[] = plan.semana.map((d, i) => (i < perdido || (d.sessao && dias.indexOf(i) < idx) ? d : { dia: d.dia, sessao: null }));
  semana[perdido] = { dia: plan.semana[perdido].dia, sessao: "perdeu" };
  proximos.forEach((dia, k) => { if (k < restantes.length) semana[dia] = { dia: DIAS_SEMANA[dia], sessao: restantes[k] }; });
  const sobra = restantes.slice(proximos.length);
  const texto = sobra.length
    ? `A sequência continua no próximo dia disponível. ${sobra.join(" e ")} passa para o começo da semana que vem — sem dobrar treino e sem recomeçar do zero.`
    : "A sequência continua no próximo dia disponível, e a semana fecha completa.";
  return { semana, texto };
}

/** "Esta semana só consigo N": versão temporária, sem trocar de programa. */
export function semanaCurta(plan: RotinaPlan, k: number): string[] {
  const n = plan.sessoesPorSemana;
  if (k >= n) return plan.sequencia;
  if (k <= 2) return Array.from({ length: k }, (_, i) => `Corpo inteiro ${String.fromCharCode(65 + i)}`);
  if (plan.structureId.startsWith("fb")) return plan.sequencia.slice(0, k);
  if (plan.structureId.startsWith("ppl") || plan.structureId === "abcd4") return k >= 4 ? ["Superior", "Inferior", "Superior", "Inferior"].slice(0, k) : ["Superior", "Inferior", "Corpo inteiro"];
  return k === 3 ? ["Superior", "Inferior", "Corpo inteiro"] : plan.sequencia.slice(0, k);
}

/** Dias de treino como texto curto: "SEG Superior A · TER Inferior A". */
export const semanaTexto = (semana: WeekDay[]) => semana.filter((d) => d.sessao).map((d) => `${d.dia} ${d.sessao}`).join("\n");
