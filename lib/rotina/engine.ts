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
  | "nao_saber" | "longos" | "abandono" | "raro";
export type Preferencia = "fullbody" | "dividido" | "tanto_faz";

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

function montarSemana(indices: number[], nomes: string[]): WeekDay[] {
  return DIAS_SEMANA.map((dia, i) => {
    const pos = indices.indexOf(i);
    return { dia, sessao: pos >= 0 ? nomes[pos % nomes.length] : null };
  });
}

const letras = (n: number, base: string) =>
  Array.from({ length: n }, (_, i) => `${base} ${String.fromCharCode(65 + i)}`);

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
  const consecutivos = a.distribuicao === "consecutivos" || a.distribuicao === "fim_de_semana";

  // ------------------------------------------------------------- estrutura
  // A divisão distribui o trabalho; com volume equiparado os resultados são
  // semelhantes (volume_over_split), então preferência e distribuição real
  // dos dias decidem os empates (sdt_adherence, recovery_distribution).
  let structureId: string;
  let structureName: string;
  let nomes: string[];

  const prefereDividido = a.preferencia === "dividido";
  const prefereFB = a.preferencia === "fullbody";
  const experiente = a.experiencia === "intermediario" || a.experiencia === "avancado";

  if (sessoes <= 2) {
    structureId = "fb2";
    structureName = "Full Body — 2x por semana";
    nomes = letras(2, "Treino");
  } else if (sessoes === 3) {
    if (prefereDividido && experiente) {
      structureId = "ulf3";
      structureName = "Superior / Inferior / Corpo inteiro — 3x por semana";
      nomes = ["Superior", "Inferior", "Corpo inteiro"];
    } else {
      structureId = "fb3";
      structureName = "Full Body — 3x por semana";
      nomes = letras(3, "Treino");
    }
  } else if (sessoes === 4) {
    if (prefereFB && !consecutivos) {
      structureId = "fb4";
      structureName = "Full Body — 4x por semana (volume distribuído)";
      nomes = letras(4, "Treino");
    } else {
      // Dias consecutivos favorecem alternar grupamentos (recovery_distribution).
      structureId = "ul4";
      structureName = "Upper / Lower — 4x por semana";
      nomes = ["Superior A", "Inferior A", "Superior B", "Inferior B"];
    }
  } else if (sessoes === 5) {
    if (a.experiencia === "avancado" && prefereDividido) {
      structureId = "pplul5";
      structureName = "Push / Pull / Legs + Upper / Lower — 5x por semana";
      nomes = ["Empurrar", "Puxar", "Pernas", "Superior", "Inferior"];
    } else {
      structureId = "ul5";
      structureName = "Upper / Lower + sessão extra — 5x por semana";
      nomes = ["Superior A", "Inferior A", "Superior B", "Inferior B", "Corpo inteiro"];
    }
  } else {
    if (a.experiencia === "avancado") {
      structureId = "ppl6";
      structureName = "Push / Pull / Legs — 2x na semana";
      nomes = ["Empurrar A", "Puxar A", "Pernas A", "Empurrar B", "Puxar B", "Pernas B"];
    } else {
      structureId = "ul6";
      structureName = "Upper / Lower — 3 ciclos na semana";
      nomes = ["Superior A", "Inferior A", "Superior B", "Inferior B", "Superior C", "Inferior C"];
    }
  }
  if (prefereDividido || prefereFB) evidencia.push("sdt_adherence");
  evidencia.push("volume_over_split");

  // Dias consecutivos com full body: alternar ênfases dentro do corpo inteiro.
  let notaDistribuicao: string | null = null;
  if (consecutivos && structureId.startsWith("fb")) {
    notaDistribuicao =
      "Como seus treinos ficam em dias seguidos, cada sessão de corpo inteiro alterna a ênfase (um dia mais membros superiores, outro mais inferiores). Assim um grupamento descansa enquanto o outro trabalha — sem exigir que sua agenda mude.";
    evidencia.push("recovery_distribution");
  } else if (a.distribuicao === "variavel") {
    notaDistribuicao =
      "Sua agenda varia — então a estrutura não depende de dias fixos. O que importa é completar as sessões da semana, na ordem, nos dias que aparecerem.";
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

  const diasSugeridos = distribuir(sessoes, consecutivos);
  const semana = montarSemana(diasSugeridos, nomes);

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

export function buildRotinaWhatsApp(plan: RotinaPlan, a: RotinaAnswers): string {
  return (
    `Oi, Montinho! Fiz o Treino Para Minha Rotina.\n\n` +
    `Estrutura sugerida: ${plan.structureName}\n` +
    `Disponibilidade: ${a.dias} dias por semana\n` +
    `Tempo por sessão: ${TEMPO_LABEL[a.tempo]}\n` +
    `Objetivo: ${OBJETIVO_LABEL[a.objetivo]}\n\n` +
    `Quero entender como transformar essa estrutura em um treino individualizado.`
  );
}

export { DIAS_SEMANA, TEMPO_LABEL, OBJETIVO_LABEL };
