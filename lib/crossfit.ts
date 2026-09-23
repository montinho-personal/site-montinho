/**
 * O motor da Calculadora de Calorias no CrossFit.
 *
 * O QUE SÓ O CROSSFIT TEM
 *
 * Uma aula de CrossFit não é uma hora de WOD. Tem aquecimento, uma parte
 * de força ou técnica, o WOD — que costuma durar de 10 a 20 minutos — e o
 * tempo de explicação e montagem de material. O WOD é a parte que todo
 * mundo lembra, e é também a mais curta. A calculadora pergunta cada parte
 * e o formato do WOD, porque AMRAP, EMOM e Tabata têm proporções diferentes
 * de trabalho e pausa dentro do mesmo tempo de relógio.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 *
 * Compêndio de Atividades Físicas de 2011, confirmado por busca pelos
 * códigos, sem valor informado: 02040, treino em circuito vigoroso, com
 * kettlebell, movimento aeróbico e pouco descanso, 8,0 — é o WOD; 02052,
 * musculação vigorosa (levantamento de peso), 5,0 — é a parte de força;
 * 02030, calistenia leve a moderada, 3,5 — é o aquecimento. O resto da
 * aula (explicação, montar material, pausas) vale ficar em pé, 1,3, o mesmo
 * das outras calculadoras do site. O Compêndio não tem uma entrada chamada
 * CrossFit; o treino em circuito vigoroso é a descrição que mais se parece
 * com um WOD.
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

export const FONTE_COMPENDIO_CROSSFIT: Fonte = {
  rotulo:
    "Ainsworth BE, Haskell WL, Herrmann SD, et al. 2011 Compendium of Physical Activities: a second update of codes and MET values. Medicine & Science in Sports & Exercise, 2011",
  rotuloCurto: "Compêndio de Atividades Físicas (2011)",
  url: "https://pubmed.ncbi.nlm.nih.gov/21681120/",
  resumo:
    "mede o treino em circuito vigoroso, com pouco descanso, em 8,0 METs; a musculação vigorosa em 5,0; e a calistenia leve do aquecimento em 3,5.",
};

export const FONTES_CROSSFIT: Fonte[] = [FONTE_COMPENDIO_CROSSFIT, FONTE_ACSM, FONTE_HALL];

/* ───────────────────────── Os METs ───────────────────────── */

/** O WOD: treino em circuito vigoroso, pouco descanso. */
export const MET_WOD = 8.0;
/** A parte de força ou técnica: levantamento de peso vigoroso. */
export const MET_FORCA = 5.0;
/** Aquecimento e mobilidade: calistenia leve a moderada. */
export const MET_AQUECIMENTO = 3.5;
/** Explicação, montagem de material, pausa dentro do EMOM: em pé, parado. */
export const MET_PARADO = 1.3;

/* ───────────────────────── Formatos de WOD ───────────────────────── */

export type FormatoId = "continuo" | "emom" | "tabata";

export interface Formato {
  id: FormatoId;
  nome: string;
  descricao: string;
}

export const FORMATOS: Formato[] = [
  { id: "continuo", nome: "AMRAP ou For time", descricao: "Trabalho sem pausa programada até o relógio acabar ou o treino terminar." },
  { id: "emom", nome: "EMOM", descricao: "Um bloco a cada minuto; o que sobra do minuto é descanso." },
  { id: "tabata", nome: "Tabata", descricao: "20 segundos de esforço e 10 de pausa, em sequência." },
];

/** Fração do tempo do WOD que é trabalho. No EMOM depende de quanto o bloco leva. */
export function fracaoTrabalho(formato: FormatoId, segundosEmom: number): number {
  if (formato === "continuo") return 1;
  if (formato === "tabata") return 20 / 30;
  return segundosEmom / 60;
}

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const AULA_MIN = 20;
export const AULA_MAX = 120;
export const PARTE_MAX = 60;
export const EMOM_MIN = 15;
export const EMOM_MAX = 55;
export const EMOM_PADRAO = 40;
export const VEZES_SEMANA = [1, 2, 3, 4, 5] as const;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const aulaValida = (m: number | null): m is number => m !== null && m >= AULA_MIN && m <= AULA_MAX;
export const parteValida = (m: number | null): m is number => m !== null && m >= 0 && m <= PARTE_MAX;
export const emomValido = (s: number | null): s is number => s !== null && s >= EMOM_MIN && s <= EMOM_MAX;

/* ───────────────────────── O cálculo ───────────────────────── */

export interface Resultado {
  minutosAula: number;
  minutosAquecimento: number;
  minutosForca: number;
  minutosWod: number;
  minutosWodTrabalho: number;
  minutosParado: number;
  kcalAquecimento: number;
  kcalForca: number;
  kcalWod: number;
  kcalParado: number;
  kcal: number;
  kcalLiquida: number;
}

/**
 * Devolve null quando as partes não cabem na aula. O que sobra da aula —
 * explicação, montar material — conta como em pé; a pausa dentro do WOD
 * também.
 */
export function calcula(
  pesoKg: number,
  minutosAula: number,
  aquecimento: number,
  forca: number,
  wod: number,
  formato: FormatoId,
  segundosEmom = EMOM_PADRAO,
): Resultado | null {
  const sobra = minutosAula - aquecimento - forca - wod;
  if (sobra < 0) return null;
  const trabalho = wod * fracaoTrabalho(formato, segundosEmom);
  const pausaWod = wod - trabalho;
  const minutosParado = sobra + pausaWod;
  const kcalAquecimento = kcalPorMinuto(MET_AQUECIMENTO, pesoKg) * aquecimento;
  const kcalForca = kcalPorMinuto(MET_FORCA, pesoKg) * forca;
  const kcalWod = kcalPorMinuto(MET_WOD, pesoKg) * trabalho + kcalPorMinuto(MET_PARADO, pesoKg) * pausaWod;
  const kcalParado = kcalPorMinuto(MET_PARADO, pesoKg) * sobra;
  const kcal = kcalAquecimento + kcalForca + kcalWod + kcalParado;
  return {
    minutosAula,
    minutosAquecimento: aquecimento,
    minutosForca: forca,
    minutosWod: wod,
    minutosWodTrabalho: trabalho,
    minutosParado,
    kcalAquecimento,
    kcalForca,
    kcalWod,
    kcalParado,
    kcal,
    kcalLiquida: kcal - kcalPorMinuto(1, pesoKg) * minutosAula,
  };
}

/** A conta de quem multiplica o MET do WOD pela aula inteira — é a origem das "1.000 kcal". */
export function kcalSeFosseTudoWod(pesoKg: number, minutosAula: number): number {
  return kcalPorMinuto(MET_WOD, pesoKg) * minutosAula;
}

export function kgPorMes(r: Resultado, vezes: number): number {
  return ((r.kcalLiquida * vezes) / KCAL_POR_KG_GORDURA) * (52 / 12);
}

/* ───────────────────────── Aulas do artigo ───────────────────────── */

export interface AulaTipo {
  id: string;
  nome: string;
  aula: number;
  aquecimento: number;
  forca: number;
  wod: number;
  formato: FormatoId;
}

export const AULAS: AulaTipo[] = [
  { id: "tipica", nome: "Aula típica: força + AMRAP de 15", aula: 60, aquecimento: 12, forca: 15, wod: 15, formato: "continuo" },
  { id: "emom", nome: "Força + EMOM de 16", aula: 60, aquecimento: 12, forca: 15, wod: 16, formato: "emom" },
  { id: "longo", nome: "Sem força, WOD longo de 30", aula: 60, aquecimento: 12, forca: 0, wod: 30, formato: "continuo" },
];

export interface LinhaAula {
  aula: AulaTipo;
  kcal70: number;
  kcal90: number;
}

export function tabelaAulas(): LinhaAula[] {
  return AULAS.map((a) => ({
    aula: a,
    kcal70: arredondaKcal(calcula(70, a.aula, a.aquecimento, a.forca, a.wod, a.formato)!.kcal),
    kcal90: arredondaKcal(calcula(90, a.aula, a.aquecimento, a.forca, a.wod, a.formato)!.kcal),
  }));
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. Duas pessoas do mesmo peso gastam diferente no mesmo WOD — muda com a carga, o ritmo e quanto cada uma para entre as repetições.";

export const NOTA_PARTES =
  "O que sobra da aula — explicação, montar e guardar material, a pausa dentro do EMOM — conta como tempo em pé. É por isso que a aula gasta bem menos que uma hora de WOD.";

export const NOTA_LINEAR =
  "A conta em quilos é linear e serve como teto: o corpo compensa parte do gasto, e o peso cai mais devagar do que ela sugere.";

export const NOTA_SEM_PERDA_LOCALIZADA =
  "Nenhum treino escolhe de onde o corpo tira gordura. O CrossFit aumenta o gasto da semana; onde a gordura sai primeiro é decidido por genética e hormônio.";

export const NOTA_SEGURANCA =
  "WOD é esforço alto com carga e cansaço juntos. Voltando de lesão, com alguma condição cardiovascular ou começando agora, escale as cargas e converse com quem acompanha você.";

/* ───────────────────────── Artigos ───────────────────────── */

/** Artigos que EMBUTEM a calculadora, logo depois da primeira seção. */
export const ARTIGOS_COM_CALCULADORA_CROSSFIT: string[] = ["crossfit-emagrece"];
