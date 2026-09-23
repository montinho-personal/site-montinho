/**
 * O motor da Calculadora de Calorias na Zumba.
 *
 * POR QUE A ZUMBA SAIU DA CALCULADORA DE ATIVIDADES
 *
 * Pelo mesmo critério de futebol e boxe: só sai quem tem uma conta que as
 * outras não têm. Na zumba são duas.
 *
 *  1. AS MÚSICAS. Uma aula de zumba é uma sequência de músicas, umas com
 *     saltos e outras sem. O Compêndio mediu a dança aeróbica nos dois
 *     jeitos — baixo e alto impacto —, e a aula real é uma mistura deles.
 *     A calculadora pergunta quantas músicas tiveram salto e divide o
 *     tempo entre os dois valores medidos. Não é interpolar intensidade:
 *     é somar o tempo de duas atividades que foram medidas.
 *  2. OS QUILOS. A pergunta que mais chega ao `zumba-emagrece` é "zumba
 *     emagrece quantos quilos por semana". A calculadora responde com a
 *     frequência da pessoa, separando o que vem só das aulas do que o
 *     artigo atribui à alimentação.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 *
 * Dança aeróbica de baixo impacto, 5,0 METs, e de alto impacto, 7,3, do
 * Compêndio de Atividades Físicas de 2011. A versão de 2024 foi
 * consultada e as fontes que a citam se contradizem (4,8 e 8,0 numa, 6,5
 * para zumba em grupo noutra). Até alguém conferir a tabela oficial, a
 * ferramenta usa a versão de 2011 e diz isso na página.
 */

import {
  FONTE_ACSM,
  FONTE_HALL,
  KCAL_POR_KG_GORDURA,
  arredondaKcal,
  formataTempo,
  kcalPorMinuto,
  parseNumero,
  type Fonte,
} from "./polichinelo";

export { arredondaKcal, formataTempo, kcalPorMinuto, parseNumero, KCAL_POR_KG_GORDURA, FONTE_HALL };

/* ───────────────────────── Fontes ───────────────────────── */

export const FONTE_COMPENDIO_ZUMBA: Fonte = {
  rotulo:
    "Ainsworth BE, Haskell WL, Herrmann SD, et al. 2011 Compendium of Physical Activities: a second update of codes and MET values. Medicine & Science in Sports & Exercise, 2011",
  rotuloCurto: "Compêndio de Atividades Físicas (2011)",
  url: "https://pubmed.ncbi.nlm.nih.gov/21681120/",
  resumo:
    "lista a dança aeróbica de baixo impacto em 5,0 METs e a de alto impacto, com saltos, em 7,3 METs. A zumba é uma aula de dança aeróbica que alterna as duas.",
};

export const FONTES_ZUMBA: Fonte[] = [FONTE_COMPENDIO_ZUMBA, FONTE_ACSM, FONTE_HALL];

/* ───────────────────────── O impacto ───────────────────────── */

export const MET_BAIXO = 5.0;
export const MET_ALTO = 7.3;

/** Uma música de aula dura, em média, quatro minutos. É só para a pessoa se localizar. */
export const MINUTOS_POR_MUSICA = 4;

export type SaltosId = "nenhuma" | "poucas" | "metade" | "maioria" | "todas";

export interface Saltos {
  id: SaltosId;
  nome: string;
  /** Fração do tempo de aula em músicas com salto. */
  fracao: number;
  /** A frase inteira, porque "com todas das músicas" não é português. */
  frase: string;
}

export const SALTOS: Saltos[] = [
  { id: "nenhuma", nome: "Nenhuma", fracao: 0, frase: "sem nenhuma música com salto" },
  { id: "poucas", nome: "Poucas", fracao: 0.25, frase: "com poucas músicas com salto" },
  { id: "metade", nome: "Metade", fracao: 0.5, frase: "com metade das músicas com salto" },
  { id: "maioria", nome: "A maioria", fracao: 0.75, frase: "com a maioria das músicas com salto" },
  { id: "todas", nome: "Todas", fracao: 1, frase: "com todas as músicas com salto" },
];

export const SALTOS_PADRAO: SaltosId = "metade";

export function saltos(id: SaltosId): Saltos {
  return SALTOS.find((s) => s.id === id) ?? SALTOS[2];
}

/** O MET médio da aula: o tempo de cada tipo de música, somado. */
export function metDaAula(fracaoComSalto: number): number {
  return MET_BAIXO * (1 - fracaoComSalto) + MET_ALTO * fracaoComSalto;
}

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const PESO_PADRAO = 70;
export const MINUTOS_MIN = 10;
export const MINUTOS_MAX = 120;
export const PRESETS_MINUTOS = [30, 45, 60] as const;
export const AULAS_SEMANA = [1, 2, 3, 4, 5] as const;
export const AULAS_PADRAO = 3;

/** A promessa de propaganda que o artigo desmonta. */
export const KCAL_PROPAGANDA = 1000;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const minutosValidos = (m: number | null): m is number => m !== null && m >= MINUTOS_MIN && m <= MINUTOS_MAX;

/* ───────────────────────── O cálculo ───────────────────────── */

export interface Resultado {
  minutos: number;
  minutosComSalto: number;
  minutosSemSalto: number;
  met: number;
  /** Gasto bruto da aula. */
  kcal: number;
  /** O que a aula acrescentou ao dia: o bruto menos o que a pessoa gastaria parada. */
  kcalLiquida: number;
}

export function calcula(pesoKg: number, minutos: number, fracaoComSalto: number): Resultado {
  const met = metDaAula(fracaoComSalto);
  const kcal = kcalPorMinuto(met, pesoKg) * minutos;
  return {
    minutos,
    minutosComSalto: minutos * fracaoComSalto,
    minutosSemSalto: minutos * (1 - fracaoComSalto),
    met,
    kcal,
    kcalLiquida: kcal - kcalPorMinuto(1, pesoKg) * minutos,
  };
}

export interface Semana {
  aulas: number;
  kcalLiquida: number;
  /** Gramas de gordura por semana, pela conta linear. Teto, não previsão. */
  gramasSemana: number;
  /** Quilos por mês, pela mesma conta. */
  kgMes: number;
  /** Semanas até 1 kg só com as aulas. */
  semanasPorQuilo: number;
}

export function semana(r: Resultado, aulas: number): Semana {
  const kcalLiquida = r.kcalLiquida * aulas;
  const kgSemana = kcalLiquida / KCAL_POR_KG_GORDURA;
  return {
    aulas,
    kcalLiquida,
    gramasSemana: kgSemana * 1000,
    kgMes: kgSemana * (52 / 12),
    semanasPorQuilo: kgSemana > 0 ? 1 / kgSemana : Infinity,
  };
}

/** Quantas aulas dessa, com esse peso, para chegar às 1.000 kcal da propaganda numa aula só. */
export function minutosAtePropaganda(pesoKg: number, fracaoComSalto: number): number {
  return KCAL_PROPAGANDA / kcalPorMinuto(metDaAula(fracaoComSalto), pesoKg);
}

/* ───────────────────────── Tabelas estáticas ───────────────────────── */

export const PESOS_TABELA = [60, 70, 80, 90, 100, 110] as const;

export interface LinhaPeso {
  peso: number;
  baixo: number;
  metade: number;
  alto: number;
}

/** Uma hora de aula, por peso e por quanto dela teve salto. É o que o artigo publica. */
export function tabelaPorPeso(minutos = 60): LinhaPeso[] {
  return PESOS_TABELA.map((peso) => ({
    peso,
    baixo: arredondaKcal(calcula(peso, minutos, 0).kcal),
    metade: arredondaKcal(calcula(peso, minutos, 0.5).kcal),
    alto: arredondaKcal(calcula(peso, minutos, 1).kcal),
  }));
}

export interface LinhaFrequencia {
  aulas: number;
  gramasSemana: number;
  kgMes: number;
}

/** Aulas de uma hora, metade das músicas com salto, por frequência. */
export function tabelaPorFrequencia(pesoKg: number): LinhaFrequencia[] {
  const r = calcula(pesoKg, 60, 0.5);
  return AULAS_SEMANA.map((aulas) => {
    const s = semana(r, aulas);
    return { aulas, gramasSemana: s.gramasSemana, kgMes: s.kgMes };
  });
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. Duas pessoas do mesmo peso gastam diferente na mesma aula — muda com a amplitude dos movimentos, o condicionamento e o quanto cada uma acompanha a coreografia.";

export const NOTA_SO_AULAS =
  "Esses quilos vêm só das aulas. Os números maiores que circulam — e os do próprio artigo sobre zumba — somam a alimentação em déficit, que é onde está a maior parte do resultado.";

export const NOTA_LINEAR =
  "A conta em quilos é linear e serve como teto: o corpo compensa parte do gasto, e o peso cai mais devagar do que ela sugere.";

export const NOTA_VERSAO =
  "Os valores são do Compêndio de 2011. A versão de 2024 existe, mas as fontes que a citam se contradizem sobre a dança aeróbica, e a calculadora não troca um número conferido por um que ninguém conferiu.";

export const NOTA_SEGURANCA =
  "Se você tem dor no joelho ou no tornozelo, prefira as músicas sem salto — o gasto cai pouco e o impacto cai muito. Com alguma condição cardiovascular, converse com quem acompanha você.";

export const NOTA_SEM_PERDA_LOCALIZADA =
  "Nenhuma coreografia escolhe de onde o corpo tira gordura. A zumba aumenta o gasto da semana; onde a gordura sai primeiro é decidido por genética e hormônio.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora, logo depois da primeira seção —
 * a das calorias de uma aula.
 *
 * O `zumba-emagrece` saiu do registro da calculadora de atividades: a
 * regra da casa é uma ferramenta por artigo.
 */
export const ARTIGOS_COM_CALCULADORA_ZUMBA: string[] = ["zumba-emagrece"];
