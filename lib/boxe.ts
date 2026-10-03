/**
 * O motor da Calculadora de Calorias no Boxe.
 *
 * POR QUE O BOXE SAIU DA CALCULADORA DE ATIVIDADES
 *
 * Pelo mesmo critério do futebol: só sai quem tem uma conta que as outras
 * não têm. No boxe são duas.
 *
 *  1. O RITMO DE SOCOS. O Compêndio mediu o saco de pancada em três
 *     cadências — 60, 120 e 180 socos por minuto. É a única atividade do
 *     site em que o próprio praticante consegue MEDIR a intensidade, sem
 *     depender de "moderado" ou "vigoroso": basta contar os socos de dez
 *     segundos.
 *  2. OS ROUNDS. Treino de boxe é contado em rounds, não em minutos: doze
 *     rounds de três com um de descanso. O round é trabalho contínuo, no
 *     ritmo medido; o descanso é descanso.
 *
 * E a pergunta que o artigo inteiro responde — "uma aula queima mesmo
 * 1.000 kcal?" — vira conta: a calculadora compara com o número do
 * relógio e diz quanto tempo seria preciso para chegar às 1.000.
 *
 * A AUDITORIA QUE TROUXE ESTA FERRAMENTA
 *
 * A calculadora de atividades usava 7,8 METs para o saco e 9,3 para o
 * sparring. No Compêndio de 2024, 7,8 é o valor do SPARRING (código
 * 15120), e o saco de pancada geral é 5,8 (código 15110). Os números
 * estavam deslocados uma linha, e o artigo tinha sido escrito em cima
 * deles. Esta ferramenta corrige os dois.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 *
 * MODO AULA: o MET da aula como ela é praticada, com as pausas que ela
 * tem. Não se desconta nada de novo.
 *
 * MODO ROUNDS: o MET da cadência medida é de trabalho contínuo, então o
 * descanso entre rounds entra à parte, como ficar em pé parado (1,3 MET,
 * o mesmo da lateral na calculadora de futebol).
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
import { VISOR_TOLERANCIA_PCT, comparaVisor, leituraVisor, type LeituraVisor } from "./eliptico";

export {
  arredondaKcal,
  formataTempo,
  kcalPorMinuto,
  parseNumero,
  KCAL_POR_KG_GORDURA,
  VISOR_TOLERANCIA_PCT,
  comparaVisor,
  leituraVisor,
  type LeituraVisor,
};

/* ───────────────────────── Fontes ───────────────────────── */

export const FONTE_COMPENDIO_BOXE: Fonte = {
  rotulo:
    "Herrmann SD, Willis EA, Ainsworth BE, et al. 2024 Adult Compendium of Physical Activities. Journal of Sport and Health Science, 2024",
  rotuloCurto: "Compêndio de Atividades Físicas (2024)",
  url: "https://pacompendium.com/sports/",
  resumo:
    "lista o boxe no saco de pancada em 5,8 METs, o sparring em 7,8 METs e o treino de sombra em 5,5 METs, e mede o saco em três cadências: 7,0 METs a 60 socos por minuto, 8,5 a 120 e 10,8 a 180.",
};

export const FONTES_BOXE: Fonte[] = [FONTE_COMPENDIO_BOXE, FONTE_ACSM];

/* ───────────────────────── Modo aula ───────────────────────── */

export type AulaId = "sombra" | "saco" | "sparring";

export interface Aula {
  id: AulaId;
  nome: string;
  met: number;
  comoReconhecer: string;
  origem: string;
}

/**
 * A aula como ela é praticada, com as pausas que ela tem.
 *
 * O teste `scripts/boxe-test.ts` trava estes valores. A ordem é a do
 * gasto, do menor para o maior.
 */
export const AULAS: Aula[] = [
  {
    id: "sombra",
    nome: "Sombra e técnica",
    met: 5.5,
    comoReconhecer: "Fundamentos, deslocamento e golpes no ar, sem saco nem parceiro.",
    origem: "boxe, treino de sombra",
  },
  {
    id: "saco",
    nome: "Saco de pancada",
    met: 5.8,
    comoReconhecer: "A aula mais comum: combinações no saco, com explicação e pausa entre as séries.",
    origem: "boxe, saco de pancada",
  },
  {
    id: "sparring",
    nome: "Sparring",
    met: 7.8,
    comoReconhecer: "Luta com parceiro, em rounds. É o mais intenso e o menos comum.",
    origem: "boxe, sparring",
  },
];

export const AULA_PADRAO: AulaId = "saco";

export function aula(id: AulaId): Aula {
  return AULAS.find((a) => a.id === id) ?? AULAS[1];
}

/* ───────────────────────── Modo rounds ───────────────────────── */

export type RitmoId = "60" | "120" | "180";

export interface Ritmo {
  id: RitmoId;
  socosPorMinuto: number;
  /** Quantos socos cabem em dez segundos nesse ritmo: é o que a pessoa conta. */
  socosEm10s: number;
  nome: string;
  met: number;
  comoReconhecer: string;
}

/**
 * As três cadências medidas no saco. Não se interpola entre elas: quem
 * conta 15 socos em dez segundos fica no ritmo de 60 ou de 120, e a
 * calculadora diz qual está mais perto.
 */
export const RITMOS: Ritmo[] = [
  { id: "60", socosPorMinuto: 60, socosEm10s: 10, nome: "Cadenciado", met: 7.0, comoReconhecer: "Cerca de 10 socos em 10 segundos. Dá para pensar em cada combinação." },
  { id: "120", socosPorMinuto: 120, socosEm10s: 20, nome: "Forte", met: 8.5, comoReconhecer: "Cerca de 20 socos em 10 segundos. O ritmo de um round puxado." },
  { id: "180", socosPorMinuto: 180, socosEm10s: 30, nome: "Máximo", met: 10.8, comoReconhecer: "Cerca de 30 socos em 10 segundos. Só se sustenta em tiros curtos." },
];

export const RITMO_PADRAO: RitmoId = "120";

export function ritmo(id: RitmoId): Ritmo {
  return RITMOS.find((r) => r.id === id) ?? RITMOS[1];
}

/** O ritmo medido mais próximo de uma contagem de dez segundos. */
export function ritmoPelaContagem(socosEm10s: number): Ritmo {
  return RITMOS.reduce((melhor, r) =>
    Math.abs(r.socosEm10s - socosEm10s) < Math.abs(melhor.socosEm10s - socosEm10s) ? r : melhor,
  );
}

/** Descanso entre rounds: em pé, parado. O mesmo valor da lateral no futebol. */
export const MET_DESCANSO = 1.3;

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const PESO_PADRAO = 70;
export const MINUTOS_MIN = 5;
export const MINUTOS_MAX = 180;
export const ROUNDS_MIN = 1;
export const ROUNDS_MAX = 20;
export const ROUND_MIN_MIN = 1;
export const ROUND_MIN_MAX = 5;
export const DESCANSO_MIN = 0;
export const DESCANSO_MAX = 3;
export const RELOGIO_MIN = 10;
export const RELOGIO_MAX = 3000;
export const PRESETS_MINUTOS = [45, 60, 90] as const;
/** A aula de 12 rounds de 3 com 1 de descanso é o formato de academia. */
export const ROUNDS_PADRAO = 12;
export const ROUND_PADRAO = 3;
export const DESCANSO_PADRAO = 1;

/** A promessa que circula em propaganda de academia e que o artigo desmonta. */
export const KCAL_PROPAGANDA = 1000;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const minutosValidos = (m: number | null): m is number => m !== null && m >= MINUTOS_MIN && m <= MINUTOS_MAX;
export const roundsValidos = (r: number | null): r is number => r !== null && Number.isInteger(r) && r >= ROUNDS_MIN && r <= ROUNDS_MAX;
export const roundValido = (m: number | null): m is number => m !== null && m >= ROUND_MIN_MIN && m <= ROUND_MIN_MAX;
export const descansoValido = (m: number | null): m is number => m !== null && m >= DESCANSO_MIN && m <= DESCANSO_MAX;
export const relogioValido = (k: number | null): k is number => k !== null && k >= RELOGIO_MIN && k <= RELOGIO_MAX;

/* ───────────────────────── O cálculo ───────────────────────── */

export interface Resultado {
  minutosTotais: number;
  minutosAtivos: number;
  minutosDescanso: number;
  kcal: number;
  kcalAtiva: number;
  kcalDescanso: number;
  /** O que o treino acrescentou ao dia: o total menos o que a pessoa gastaria parada. */
  kcalLiquida: number;
  met: number;
}

/** Modo aula: o tempo cheio, no MET da aula como ela é praticada. */
export function deAula(pesoKg: number, minutos: number, met: number): Resultado {
  const kcal = kcalPorMinuto(met, pesoKg) * minutos;
  return {
    minutosTotais: minutos,
    minutosAtivos: minutos,
    minutosDescanso: 0,
    kcal,
    kcalAtiva: kcal,
    kcalDescanso: 0,
    kcalLiquida: kcal - kcalPorMinuto(1, pesoKg) * minutos,
    met,
  };
}

/**
 * Modo rounds: N rounds no ritmo medido, com descanso entre eles. São
 * N − 1 descansos — depois do último round a sessão acabou.
 */
export function deRounds(pesoKg: number, rounds: number, minutosPorRound: number, minutosDescanso: number, met: number): Resultado {
  const minutosAtivos = rounds * minutosPorRound;
  const descanso = Math.max(0, rounds - 1) * minutosDescanso;
  const kcalAtiva = kcalPorMinuto(met, pesoKg) * minutosAtivos;
  const kcalDescanso = kcalPorMinuto(MET_DESCANSO, pesoKg) * descanso;
  const kcal = kcalAtiva + kcalDescanso;
  const minutosTotais = minutosAtivos + descanso;
  return {
    minutosTotais,
    minutosAtivos,
    minutosDescanso: descanso,
    kcal,
    kcalAtiva,
    kcalDescanso,
    kcalLiquida: kcal - kcalPorMinuto(1, pesoKg) * minutosTotais,
    met,
  };
}

/** Quanto tempo nesse MET seria preciso para chegar às 1.000 kcal da propaganda. */
export function minutosAtePropaganda(pesoKg: number, met: number): number {
  return KCAL_PROPAGANDA / kcalPorMinuto(met, pesoKg);
}

/* ───────────────────────── Tabelas estáticas ───────────────────────── */

export const PESOS_TABELA = [60, 70, 80, 90, 100, 110] as const;

export interface LinhaPeso {
  peso: number;
  sombra: number;
  saco: number;
  sparring: number;
}

/** Uma aula de 60 minutos, por peso e formato. É o que o artigo publica. */
export function tabelaPorPeso(minutos = 60): LinhaPeso[] {
  return PESOS_TABELA.map((peso) => ({
    peso,
    sombra: arredondaKcal(deAula(peso, minutos, aula("sombra").met).kcal),
    saco: arredondaKcal(deAula(peso, minutos, aula("saco").met).kcal),
    sparring: arredondaKcal(deAula(peso, minutos, aula("sparring").met).kcal),
  }));
}

export interface LinhaRitmo {
  ritmo: Ritmo;
  kcal: number;
  minutosTotais: number;
}

/** Doze rounds de três com um de descanso, nos três ritmos. */
export function tabelaPorRitmo(pesoKg: number): LinhaRitmo[] {
  return RITMOS.map((r) => {
    const res = deRounds(pesoKg, ROUNDS_PADRAO, ROUND_PADRAO, DESCANSO_PADRAO, r.met);
    return { ritmo: r, kcal: arredondaKcal(res.kcal), minutosTotais: res.minutosTotais };
  });
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. Duas pessoas do mesmo peso gastam diferente na mesma aula — muda com a técnica, o condicionamento e o quanto cada uma se entrega no round.";

export const NOTA_CADENCIA =
  "Os ritmos são os que o Compêndio mediu no saco, em trabalho contínuo. Por isso, no modo rounds, o descanso entra à parte: no intervalo, o gasto cai para o de ficar em pé.";

export const NOTA_LIQUIDA =
  "O líquido é o que o treino acrescentou ao que você gastaria em casa, parado, no mesmo tempo. É esse número que entra na conta do que você come depois.";

export const NOTA_RELOGIO =
  "Relógio e esteira de academia também estimam: muitos usam a frequência cardíaca, que no boxe sobe por tensão e adrenalina tanto quanto por esforço. Nenhum dos dois números é medição.";

export const NOTA_SEGURANCA =
  "O boxe eleva muito a frequência cardíaca. Se você tem alguma condição cardiovascular ou está voltando depois de muito tempo parado, converse com quem acompanha você antes de treinar em ritmo máximo.";

export const NOTA_SEM_PERDA_LOCALIZADA =
  "Socar não afina braço, e esquiva não seca cintura. O boxe aumenta o gasto do dia; onde a gordura sai primeiro é decidido por genética e hormônio.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora, logo depois da primeira seção —
 * "Quantas calorias uma aula de boxe queima?".
 *
 * O `boxe-emagrece` saiu do registro da calculadora de atividades: a
 * regra da casa é uma ferramenta por artigo.
 */
export const ARTIGOS_COM_CALCULADORA_BOXE: string[] = ["boxe-emagrece", "ufc-332-natalia-silva", "brasileiros-ufc-332", "corte-de-peso-ufc", "pesagem-ufc-332", "resultado-ufc-332"];
