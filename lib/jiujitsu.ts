/**
 * O motor da Calculadora de Calorias no Jiu-Jitsu.
 *
 * POR QUE O JIU-JITSU SAIU DA CALCULADORA DE ATIVIDADES
 *
 * Pelo mesmo critério das outras: só sai quem tem uma conta que as outras
 * não têm. No jiu-jitsu é o ROLA.
 *
 * Uma aula de jiu-jitsu tem duas atividades muito diferentes: técnica e
 * drill, com explicação e repetição, e o rola, que é luta de verdade. O
 * Compêndio mede as duas em separado — artes marciais em ritmo lento de
 * treino, 5,3 METs, e em ritmo de luta, 10,3. O artigo `jiu-jitsu-emagrece`
 * já organiza as aulas pelo número de rolas. A calculadora pergunta a
 * duração da aula, quantos rolas e de quantos minutos, e trata o resto
 * como técnica.
 *
 * A AUDITORIA QUE VEIO JUNTO
 *
 * A calculadora de atividades dava 7,8 METs à técnica. As entradas de
 * artes marciais do Compêndio são 5,3 e 10,3; o 7,8 não é nenhuma delas.
 * É o mesmo tipo de erro achado no boxe, onde o saco estava com o valor
 * do sparring.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 *
 * Compêndio de Atividades Físicas de 2011: 15425 (artes marciais, ritmo
 * lento, iniciante, treino) = 5,3; 15430 (artes marciais, ritmo moderado,
 * incluindo jiu-jitsu, judô, caratê e muay thai) = 10,3. O descanso entre
 * rolas vale ficar em pé, 1,3 — o mesmo da lateral no futebol, do
 * intervalo no boxe e da borda na natação.
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

export const FONTE_COMPENDIO_JIU: Fonte = {
  rotulo:
    "Ainsworth BE, Haskell WL, Herrmann SD, et al. 2011 Compendium of Physical Activities: a second update of codes and MET values. Medicine & Science in Sports & Exercise, 2011",
  rotuloCurto: "Compêndio de Atividades Físicas (2011)",
  url: "https://pubmed.ncbi.nlm.nih.gov/21681120/",
  resumo:
    "mede as artes marciais em ritmo lento de treino em 5,3 METs e em ritmo de luta — jiu-jitsu, judô, caratê, muay thai — em 10,3 METs.",
};

export const FONTES_JIU: Fonte[] = [FONTE_COMPENDIO_JIU, FONTE_ACSM, FONTE_HALL];

/* ───────────────────────── Os METs ───────────────────────── */

/** Técnica, drill e aquecimento: artes marciais em ritmo lento de treino. */
export const MET_TECNICA = 5.3;
/** Rola: artes marciais em ritmo de luta. */
export const MET_ROLA = 10.3;
/** Descanso entre rolas: em pé, parado. */
export const MET_DESCANSO = 1.3;

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const PESO_PADRAO = 70;
export const AULA_MIN = 20;
export const AULA_MAX = 180;
export const ROLAS_MAX = 15;
export const ROLA_MIN_MIN = 2;
export const ROLA_MIN_MAX = 10;
export const DESCANSO_MAX = 5;
export const PRESETS_AULA = [60, 75, 90] as const;
export const ROLA_PADRAO = 6;
export const DESCANSO_PADRAO = 1;
export const VEZES_SEMANA = [1, 2, 3, 4, 5] as const;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const aulaValida = (m: number | null): m is number => m !== null && m >= AULA_MIN && m <= AULA_MAX;
export const rolasValidos = (r: number | null): r is number => r !== null && Number.isInteger(r) && r >= 0 && r <= ROLAS_MAX;
export const rolaValido = (m: number | null): m is number => m !== null && m >= ROLA_MIN_MIN && m <= ROLA_MIN_MAX;
export const descansoValido = (m: number | null): m is number => m !== null && m >= 0 && m <= DESCANSO_MAX;

/* ───────────────────────── O cálculo ───────────────────────── */

export interface Resultado {
  minutosAula: number;
  rolas: number;
  minutosRola: number;
  minutosDescanso: number;
  minutosTecnica: number;
  kcalTecnica: number;
  kcalRola: number;
  kcalDescanso: number;
  kcal: number;
  kcalLiquida: number;
}

/**
 * Quanto tempo dos rolas e descansos cabe na aula. Devolve null quando os
 * rolas não cabem — 10 rolas de 6 minutos não cabem numa aula de 45.
 */
export function calcula(pesoKg: number, minutosAula: number, rolas: number, minutosPorRola: number, minutosDescanso: number): Resultado | null {
  const minutosRola = rolas * minutosPorRola;
  const descanso = Math.max(0, rolas - 1) * minutosDescanso;
  const minutosTecnica = minutosAula - minutosRola - descanso;
  if (minutosTecnica < 0) return null;
  const kcalTecnica = kcalPorMinuto(MET_TECNICA, pesoKg) * minutosTecnica;
  const kcalRola = kcalPorMinuto(MET_ROLA, pesoKg) * minutosRola;
  const kcalDescanso = kcalPorMinuto(MET_DESCANSO, pesoKg) * descanso;
  const kcal = kcalTecnica + kcalRola + kcalDescanso;
  return {
    minutosAula,
    rolas,
    minutosRola,
    minutosDescanso: descanso,
    minutosTecnica,
    kcalTecnica,
    kcalRola,
    kcalDescanso,
    kcal,
    kcalLiquida: kcal - kcalPorMinuto(1, pesoKg) * minutosAula,
  };
}

/**
 * Quanto um rola a mais acrescenta, trocando tempo de técnica por tempo
 * de rola e descanso na mesma aula.
 */
export function kcalPorRolaExtra(pesoKg: number, minutosPorRola: number, minutosDescanso: number): number {
  return (
    kcalPorMinuto(MET_ROLA - MET_TECNICA, pesoKg) * minutosPorRola +
    kcalPorMinuto(MET_DESCANSO - MET_TECNICA, pesoKg) * minutosDescanso
  );
}

/**
 * Abaixo disso, dizer "um rola a mais soma X kcal" engana: com rolas curtos
 * e descanso longo, o descanso gasta menos que a técnica que ele substitui,
 * e um rola a mais pode até reduzir o total. A auditoria achou a frase
 * dizendo "soma só cerca de −12 kcal".
 */
export const ROLA_EXTRA_MINIMO = 5;

export function kgPorMes(r: Resultado, vezes: number): number {
  return ((r.kcalLiquida * vezes) / KCAL_POR_KG_GORDURA) * (52 / 12);
}

/* ───────────────────────── Cenários do artigo ───────────────────────── */

export interface Cenario {
  id: string;
  nome: string;
  minutosAula: number;
  rolas: number;
}

/** Os três tipos de aula que o artigo descreve, com rolas de 6 minutos e 1 de descanso. */
export const CENARIOS: Cenario[] = [
  { id: "tecnica", nome: "Aula com muita técnica e um rola", minutosAula: 60, rolas: 1 },
  { id: "tipica", nome: "Aula típica, com quatro rolas", minutosAula: 75, rolas: 4 },
  { id: "competicao", nome: "Aula de competição, oito rolas", minutosAula: 90, rolas: 8 },
];

export interface LinhaCenario {
  cenario: Cenario;
  kcal70: number;
  kcal90: number;
}

export function tabelaCenarios(): LinhaCenario[] {
  return CENARIOS.map((c) => ({
    cenario: c,
    kcal70: arredondaKcal(calcula(70, c.minutosAula, c.rolas, ROLA_PADRAO, DESCANSO_PADRAO)!.kcal),
    kcal90: arredondaKcal(calcula(90, c.minutosAula, c.rolas, ROLA_PADRAO, DESCANSO_PADRAO)!.kcal),
  }));
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. Duas pessoas do mesmo peso gastam diferente no mesmo rola — muda com o jogo, a técnica e o quanto cada uma trava ou relaxa.";

export const NOTA_TECNICA =
  "O tempo que não é rola nem descanso conta como técnica e drill, com explicação e repetição. É por isso que a aula com mais rolas gasta mais, mesmo tendo a mesma duração.";

export const NOTA_LINEAR =
  "A conta em quilos é linear e serve como teto: o corpo compensa parte do gasto, e o peso cai mais devagar do que ela sugere.";

export const NOTA_SEM_PERDA_LOCALIZADA =
  "Nenhum treino escolhe de onde o corpo tira gordura. O jiu-jitsu aumenta o gasto da semana; onde a gordura sai primeiro é decidido por genética e hormônio.";

export const NOTA_SEGURANCA =
  "Rola é esforço máximo em rounds. Com alguma condição cardiovascular, ou voltando depois de muito tempo parado, converse com quem acompanha você antes de emendar rolas.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora, logo depois da primeira seção.
 *
 * O `jiu-jitsu-emagrece` saiu do registro da calculadora de atividades: a
 * regra da casa é uma ferramenta por artigo.
 */
export const ARTIGOS_COM_CALCULADORA_JIU: string[] = ["jiu-jitsu-emagrece", "treino-de-lutador-mma", "academias-de-jiu-jitsu-em-barueri"];
