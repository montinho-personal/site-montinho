/**
 * O motor da Calculadora de Calorias no Futebol.
 *
 * POR QUE O FUTEBOL SAIU DA CALCULADORA DE ATIVIDADES
 *
 * A calculadora de atividades existe porque dez páginas com o mesmo
 * formulário e só o MET trocado seriam doorway pages. Esse argumento
 * continua valendo — e é por isso que o futebol só ganhou página própria
 * quando passou a ter uma conta que as outras nove não têm:
 *
 *  1. O REVEZAMENTO. Pelada de adulto quase nunca é dois times jogando o
 *     tempo todo. São três, quatro times, e quem perde sai. Duas horas na
 *     quadra com quatro times são uma hora de bola rolando e uma hora em
 *     pé na lateral. Nenhuma calculadora genérica pergunta isso, e é o
 *     que mais erra o número de quem joga.
 *  2. O FORMATO. Futsal tem medida própria no Compêndio de 2024, separada
 *     do futebol de campo.
 *  3. A RESENHA. O artigo `futebol-emagrece` diz que o motivo número um de
 *     quem joga há anos e não emagrece é a cerveja depois. A ferramenta
 *     transforma isso em conta: o jogo acrescentou tantas kcal ao dia, o
 *     que dá tantas latas.
 *
 * O `futebol-emagrece` tinha 628 impressões em 90 dias, posição média
 * 5,4 e CTR de 0,3%. A busca chega; o clique não.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 *
 * METs do Compêndio de Atividades Físicas (2024). O tempo parado na
 * lateral usa o MET de ficar em pé parado, também do Compêndio.
 *
 * GOLEIRO NÃO TEM NÚMERO
 *
 * O Compêndio não tem entrada para goleiro. Os estudos de campo mostram
 * que o goleiro percorre cerca de metade da distância do jogador de
 * linha, mas distância não é MET, e esta calculadora não inventa um. Ela
 * diz isso em vez de devolver um número de linha para quem ficou no gol.
 */

import {
  FONTE_ACSM,
  KCAL_POR_KG_GORDURA,
  arredondaKcal,
  formataTempo,
  kcalPorMinuto,
  parseNumero,
  type Fonte,
} from "./polichinelo";

export { arredondaKcal, formataTempo, kcalPorMinuto, parseNumero, KCAL_POR_KG_GORDURA };

/* ───────────────────────── Fontes ───────────────────────── */

export const FONTE_COMPENDIO_FUTEBOL: Fonte = {
  rotulo:
    "Herrmann SD, Willis EA, Ainsworth BE, et al. 2024 Adult Compendium of Physical Activities. Journal of Sport and Health Science, 2024",
  rotuloCurto: "Compêndio de Atividades Físicas (2024)",
  url: "https://pacompendium.com/sports/",
  resumo:
    "lista o futebol casual em 7,0 METs, o futebol competitivo em 10,0 METs e, pela primeira vez, o futsal como atividade própria, em 7,8 METs. Não há entrada para goleiro.",
};

export const FONTES_FUTEBOL: Fonte[] = [FONTE_COMPENDIO_FUTEBOL, FONTE_ACSM];

/* ───────────────────────── Tipos de jogo ───────────────────────── */

export type JogoId = "pelada" | "futsal" | "competitivo";

export interface Jogo {
  id: JogoId;
  nome: string;
  met: number;
  comoReconhecer: string;
  origem: string;
}

/**
 * Os três jogos do Compêndio.
 *
 * Pelada (7,0) e competitivo (10,0) são os mesmos que a calculadora de
 * atividades usava. O futsal (7,8) é entrada nova do Compêndio de 2024.
 * O teste `scripts/futebol-test.ts` trava estes valores.
 */
export const JOGOS: Jogo[] = [
  {
    id: "pelada",
    nome: "Pelada",
    met: 7.0,
    comoReconhecer: "Society ou campo entre amigos: tem trote, bola parada e conversa no meio.",
    origem: "futebol, casual, geral",
  },
  {
    id: "futsal",
    nome: "Futsal",
    met: 7.8,
    comoReconhecer: "Quadra, bola pesada, pouco espaço. A bola quase não para.",
    origem: "futsal",
  },
  {
    id: "competitivo",
    nome: "Competitivo",
    met: 10.0,
    comoReconhecer: "Campeonato ou jogo valendo: ritmo alto do começo ao fim, ninguém anda.",
    origem: "futebol, competitivo",
  },
];

export const JOGO_PADRAO: JogoId = "pelada";

export function jogo(id: JogoId): Jogo {
  return JOGOS.find((j) => j.id === id) ?? JOGOS[0];
}

/** Ficar em pé parado, no Compêndio. É o gasto de quem espera na lateral. */
export const MET_ESPERANDO = 1.3;

/* ───────────────────────── Revezamento ───────────────────────── */

/**
 * Com N times e dois em campo, cada time joga em média 2/N do tempo.
 *
 * "Quem perde sai" não reparte de forma exatamente igual — o time bom
 * fica mais —, mas na média de uma noite é a divisão que sobra. A
 * ferramenta usa a média e diz que é média.
 */
export const TIMES_OPCOES = [2, 3, 4, 5] as const;
export type Times = (typeof TIMES_OPCOES)[number];

export function fracaoEmCampo(times: number): number {
  return times <= 2 ? 1 : 2 / times;
}

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const PESO_PADRAO = 70;
export const MINUTOS_MIN = 10;
export const MINUTOS_MAX = 300;
export const PRESETS_MINUTOS = [60, 90, 120] as const;
export const PELADAS_MAX = 7;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const minutosValidos = (m: number | null): m is number => m !== null && m >= MINUTOS_MIN && m <= MINUTOS_MAX;

/* ───────────────────────── O cálculo ───────────────────────── */

/** Uma lata de cerveja comum, 350 ml. O mesmo número dos artigos de álcool do site. */
export const KCAL_LATA = 150;

export interface Resultado {
  minutosNoLocal: number;
  minutosEmCampo: number;
  minutosEsperando: number;
  /** Gasto total do tempo no local: jogo mais espera. Inclui o repouso. */
  kcal: number;
  kcalEmCampo: number;
  kcalEsperando: number;
  /** O que o jogo acrescentou ao dia: o total menos o que a pessoa gastaria parada. */
  kcalLiquida: number;
  /** A kcal líquida em latas de cerveja comum. */
  latas: number;
  met: number;
}

export function calcula(pesoKg: number, minutosNoLocal: number, met: number, times: number): Resultado {
  const minutosEmCampo = minutosNoLocal * fracaoEmCampo(times);
  const minutosEsperando = minutosNoLocal - minutosEmCampo;
  const kcalEmCampo = kcalPorMinuto(met, pesoKg) * minutosEmCampo;
  const kcalEsperando = kcalPorMinuto(MET_ESPERANDO, pesoKg) * minutosEsperando;
  const kcal = kcalEmCampo + kcalEsperando;
  const kcalLiquida = kcal - kcalPorMinuto(1, pesoKg) * minutosNoLocal;
  return {
    minutosNoLocal,
    minutosEmCampo,
    minutosEsperando,
    kcal,
    kcalEmCampo,
    kcalEsperando,
    kcalLiquida,
    latas: kcalLiquida / KCAL_LATA,
    met,
  };
}

/** Latas em meias unidades: "3", "3 e meia". Mais precisão que isso é ruído. */
export function formataLatas(latas: number): string {
  const meias = Math.round(latas * 2) / 2;
  if (meias < 0.5) return "menos de meia lata";
  const inteiras = Math.floor(meias);
  const temMeia = meias - inteiras > 0;
  if (inteiras === 0) return "meia lata";
  const base = `${inteiras} ${inteiras === 1 ? "lata" : "latas"}`;
  return temMeia ? `${base} e meia` : base;
}

export interface Semana {
  peladas: number;
  kcalLiquida: number;
  /** Gramas de gordura, pela conta linear. É teto, não previsão. */
  gramasGordura: number;
}

export function semana(r: Resultado, peladas: number): Semana {
  const kcalLiquida = r.kcalLiquida * peladas;
  return { peladas, kcalLiquida, gramasGordura: (kcalLiquida / KCAL_POR_KG_GORDURA) * 1000 };
}

/* ───────────────────────── Tabelas estáticas ───────────────────────── */

export const PESOS_TABELA = [60, 70, 80, 90, 100, 110] as const;

export interface LinhaPeso {
  peso: number;
  pelada: number;
  futsal: number;
  competitivo: number;
}

/** Uma hora de bola rolando, sem revezamento. É o número que o artigo publica. */
export function tabelaPorPeso(minutos = 60): LinhaPeso[] {
  return PESOS_TABELA.map((peso) => ({
    peso,
    pelada: arredondaKcal(calcula(peso, minutos, jogo("pelada").met, 2).kcal),
    futsal: arredondaKcal(calcula(peso, minutos, jogo("futsal").met, 2).kcal),
    competitivo: arredondaKcal(calcula(peso, minutos, jogo("competitivo").met, 2).kcal),
  }));
}

export interface LinhaRevezamento {
  times: number;
  minutosEmCampo: number;
  kcal: number;
  latas: number;
}

/** Duas horas de quadra, pelada, com dois a cinco times. */
export function tabelaRevezamento(pesoKg: number, minutosNoLocal = 120): LinhaRevezamento[] {
  return TIMES_OPCOES.map((times) => {
    const r = calcula(pesoKg, minutosNoLocal, jogo("pelada").met, times);
    return { times, minutosEmCampo: r.minutosEmCampo, kcal: arredondaKcal(r.kcal), latas: r.latas };
  });
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. Duas pessoas do mesmo peso gastam diferente no mesmo jogo — muda com a posição, o condicionamento e o quanto cada uma corre de verdade.";

export const NOTA_REVEZAMENTO_MEDIA =
  "O revezamento usa a média, como se cada time jogasse uma fatia igual da noite. Na prática, quem ganha fica mais em campo e quem perde fica mais na lateral.";

export const NOTA_GOLEIRO =
  "O Compêndio de Atividades Físicas não tem medida para goleiro, e esta calculadora não inventa uma. O goleiro percorre cerca de metade da distância do jogador de linha, com poucos piques curtos — o gasto fica bem abaixo do que ela mostraria para a linha.";

export const NOTA_LIQUIDA =
  "As latas saem do gasto líquido: o que o jogo acrescentou ao que você gastaria em casa, parado. É a conta honesta para comparar com o que se come e bebe depois.";

export const NOTA_SEMANA =
  "A conta em gramas é linear e serve como teto: o corpo compensa parte do gasto, e o peso cai mais devagar do que ela sugere.";

export const NOTA_SEGURANCA =
  "Se você voltou a jogar depois de muito tempo parado ou tem alguma condição cardiovascular, aqueça antes do primeiro pique e converse com quem acompanha você.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora, logo depois da primeira seção —
 * "Quantas calorias uma pelada queima de verdade".
 *
 * O `futebol-emagrece` saiu do registro da calculadora de atividades: a
 * regra da casa é uma ferramenta por artigo.
 */
export const ARTIGOS_COM_CALCULADORA_FUTEBOL: string[] = ["futebol-emagrece"];

export const formataKcal = (kcal: number) => `${arredondaKcal(kcal).toLocaleString("pt-BR")} kcal`;
