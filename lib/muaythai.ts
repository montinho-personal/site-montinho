/**
 * O motor da Calculadora de Calorias no Muay Thai.
 *
 * A CONTA QUE SÓ O MUAY THAI TEM
 *
 * Uma aula de muay thai mistura duas coisas: técnica (fundamentos, sombra,
 * explicação, repetição devagar) e rounds fortes (manopla, saco em ritmo de
 * luta, sparring). A calculadora pergunta a duração da aula e quantos
 * rounds fortes teve, e trata o resto como técnica. É o mesmo raciocínio do
 * rola no jiu-jitsu, com rounds cronometrados no lugar dos rolas.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 *
 * Compêndio de Atividades Físicas de 2011: 15425 (artes marciais, ritmo
 * lento, iniciante, treino) = 5,3; 15430 (artes marciais, ritmo moderado,
 * que lista nominalmente o muay thai, com jiu-jitsu, judô, caratê e
 * kickboxing) = 10,3. O descanso entre rounds vale ficar em pé, 1,3. Os
 * METs são os mesmos do jiu-jitsu porque o Compêndio mede as artes
 * marciais juntas; importamos de lá para as duas calculadoras nunca
 * divergirem.
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
import { MET_DESCANSO, MET_ROLA, MET_TECNICA } from "./jiujitsu";

export { arredondaKcal, formataTempo, kcalPorMinuto, parseNumero, KCAL_POR_KG_GORDURA, FONTE_HALL, MET_DESCANSO, MET_TECNICA };

/** Round forte (manopla, saco em ritmo de luta, sparring): artes marciais em ritmo de luta. */
export const MET_ROUND = MET_ROLA;

/* ───────────────────────── Fontes ───────────────────────── */

export const FONTE_COMPENDIO_MUAY: Fonte = {
  rotulo:
    "Ainsworth BE, Haskell WL, Herrmann SD, et al. 2011 Compendium of Physical Activities: a second update of codes and MET values. Medicine & Science in Sports & Exercise, 2011",
  rotuloCurto: "Compêndio de Atividades Físicas (2011)",
  url: "https://pubmed.ncbi.nlm.nih.gov/21681120/",
  resumo:
    "mede as artes marciais em ritmo lento de treino em 5,3 METs e em ritmo de luta — muay thai, kickboxing, jiu-jitsu, judô, caratê — em 10,3 METs.",
};

export const FONTES_MUAY: Fonte[] = [FONTE_COMPENDIO_MUAY, FONTE_ACSM, FONTE_HALL];

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const PESO_PADRAO = 70;
export const AULA_MIN = 20;
export const AULA_MAX = 180;
export const ROUNDS_MAX = 20;
export const ROUND_MIN_MIN = 1;
export const ROUND_MIN_MAX = 5;
export const DESCANSO_MAX = 3;
export const PRESETS_AULA = [60, 75, 90] as const;
export const ROUND_PADRAO = 3;
export const DESCANSO_PADRAO = 1;
export const ROUNDS_PADRAO = 5;
export const VEZES_SEMANA = [1, 2, 3, 4, 5] as const;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const aulaValida = (m: number | null): m is number => m !== null && m >= AULA_MIN && m <= AULA_MAX;
export const roundsValidos = (r: number | null): r is number => r !== null && Number.isInteger(r) && r >= 0 && r <= ROUNDS_MAX;
export const roundValido = (m: number | null): m is number => m !== null && m >= ROUND_MIN_MIN && m <= ROUND_MIN_MAX;
export const descansoValido = (m: number | null): m is number => m !== null && m >= 0 && m <= DESCANSO_MAX;

/* ───────────────────────── O cálculo ───────────────────────── */

export interface Resultado {
  minutosAula: number;
  rounds: number;
  minutosRound: number;
  minutosDescanso: number;
  minutosTecnica: number;
  kcalTecnica: number;
  kcalRound: number;
  kcalDescanso: number;
  kcal: number;
  kcalLiquida: number;
}

/** Devolve null quando os rounds e descansos não cabem na aula. */
export function calcula(pesoKg: number, minutosAula: number, rounds: number, minutosPorRound: number, minutosDescanso: number): Resultado | null {
  const minutosRound = rounds * minutosPorRound;
  const descanso = Math.max(0, rounds - 1) * minutosDescanso;
  const minutosTecnica = minutosAula - minutosRound - descanso;
  if (minutosTecnica < 0) return null;
  const kcalTecnica = kcalPorMinuto(MET_TECNICA, pesoKg) * minutosTecnica;
  const kcalRound = kcalPorMinuto(MET_ROUND, pesoKg) * minutosRound;
  const kcalDescanso = kcalPorMinuto(MET_DESCANSO, pesoKg) * descanso;
  const kcal = kcalTecnica + kcalRound + kcalDescanso;
  return {
    minutosAula,
    rounds,
    minutosRound,
    minutosDescanso: descanso,
    minutosTecnica,
    kcalTecnica,
    kcalRound,
    kcalDescanso,
    kcal,
    kcalLiquida: kcal - kcalPorMinuto(1, pesoKg) * minutosAula,
  };
}

/** Quanto um round forte a mais soma, trocando técnica por round e descanso na mesma aula. */
export function kcalPorRoundExtra(pesoKg: number, minutosPorRound: number, minutosDescanso: number): number {
  return (
    kcalPorMinuto(MET_ROUND - MET_TECNICA, pesoKg) * minutosPorRound +
    kcalPorMinuto(MET_DESCANSO - MET_TECNICA, pesoKg) * minutosDescanso
  );
}

/** Abaixo disso, "um round a mais soma X kcal" engana (o descanso gasta menos que a técnica). */
export const ROUND_EXTRA_MINIMO = 5;

export function kgPorMes(r: Resultado, vezes: number): number {
  return ((r.kcalLiquida * vezes) / KCAL_POR_KG_GORDURA) * (52 / 12);
}

/** Uma hora inteira em ritmo de luta, sem pausa: o teto teórico, não uma aula real. */
export function horaSemParar(pesoKg: number): number {
  return kcalPorMinuto(MET_ROUND, pesoKg) * 60;
}

/* ───────────────────────── Cenários ───────────────────────── */

export interface Cenario {
  id: string;
  nome: string;
  minutosAula: number;
  rounds: number;
}

/** Rounds de 3 minutos com 1 de descanso. */
export const CENARIOS: Cenario[] = [
  { id: "tecnica", nome: "Aula técnica, para iniciantes, com 2 rounds fortes", minutosAula: 60, rounds: 2 },
  { id: "tipica", nome: "Aula típica, com 5 rounds de manopla ou saco", minutosAula: 60, rounds: 5 },
  { id: "intensa", nome: "Aula intensa, com 10 rounds e sparring", minutosAula: 75, rounds: 10 },
];

export interface LinhaCenario {
  cenario: Cenario;
  kcal70: number;
  kcal90: number;
}

export function tabelaCenarios(): LinhaCenario[] {
  return CENARIOS.map((c) => ({
    cenario: c,
    kcal70: arredondaKcal(calcula(70, c.minutosAula, c.rounds, ROUND_PADRAO, DESCANSO_PADRAO)!.kcal),
    kcal90: arredondaKcal(calcula(90, c.minutosAula, c.rounds, ROUND_PADRAO, DESCANSO_PADRAO)!.kcal),
  }));
}

export const PESOS_TABELA = [60, 70, 80, 90, 100] as const;

export interface LinhaHora {
  peso: number;
  tecnica: number;
  tipica: number;
  semParar: number;
}

/** Uma hora de muay thai, por peso: só técnica, aula típica (5 rounds) e o teto sem parar. */
export function tabelaHora(): LinhaHora[] {
  return PESOS_TABELA.map((p) => ({
    peso: p,
    tecnica: arredondaKcal(calcula(p, 60, 0, ROUND_PADRAO, DESCANSO_PADRAO)!.kcal),
    tipica: arredondaKcal(calcula(p, 60, ROUNDS_PADRAO, ROUND_PADRAO, DESCANSO_PADRAO)!.kcal),
    semParar: arredondaKcal(horaSemParar(p)),
  }));
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. Duas pessoas do mesmo peso gastam diferente no mesmo round: muda com a técnica, a força de cada chute e o quanto cada uma relaxa ou trava.";

export const NOTA_TECNICA =
  "O tempo que não é round forte nem descanso conta como técnica: aquecimento, sombra, explicação e repetição devagar. É por isso que a aula com mais rounds gasta mais, mesmo tendo a mesma duração.";

export const NOTA_LINEAR =
  "A conta em quilos é linear e serve como teto: o corpo compensa parte do gasto, e o peso cai mais devagar do que ela sugere.";

export const NOTA_SEM_PERDA_LOCALIZADA =
  "Nenhum treino escolhe de onde o corpo tira gordura. O muay thai aumenta o gasto da semana; onde a gordura sai primeiro é decidido por genética e hormônio.";

export const NOTA_SEGURANCA =
  "Round forte é esforço perto do máximo. Com alguma condição cardiovascular, ou voltando depois de muito tempo parado, converse com quem acompanha você antes de emendar rounds.";

/* ───────────────────────── Artigos ───────────────────────── */

/** Artigos que EMBUTEM a calculadora. Uma ferramenta por artigo. */
export const ARTIGOS_COM_CALCULADORA_MUAY: string[] = ["muay-thai-emagrece"];
