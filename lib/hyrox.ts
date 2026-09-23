/**
 * O motor da Calculadora de Calorias no Hyrox.
 *
 * O QUE SÓ O HYROX TEM
 *
 * A prova é sempre a mesma: oito corridas de 1 km, cada uma seguida de uma
 * estação. O que muda de uma pessoa para outra é o tempo. Então a conta
 * parte do tempo final e do ritmo de corrida: a corrida são 8 km no ritmo
 * informado, e o resto do tempo é estação. Ninguém sabe quantos minutos
 * passou no remo, mas todo mundo sabe o tempo final e o pace.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 *
 * A corrida usa a equação de corrida da ACSM, a mesma da Calculadora de
 * Corrida do site (lib/corrida.ts), para que os dois números batam. As
 * estações usam o Compêndio de Atividades Físicas de 2011:
 *
 *   - SkiErg: aparelho de esqui, 6,8 METs (02080), confirmado por busca
 *     pelo código, sem valor informado;
 *   - remo: remo ergométrico a 100 W, esforço moderado, 8,5 METs (02073).
 *     As buscas pelo código do remo devolveram valores inconsistentes
 *     entre entradas vizinhas; este valor foi CONFIRMADO PELO DONO DO SITE
 *     antes de ir ao ar;
 *   - as outras seis (trenó, burpee, carregamento, avanço, wall ball):
 *     treino em circuito vigoroso, 8,0 METs (02040), a mesma entrada do
 *     WOD na calculadora de CrossFit. O Compêndio não mede trenó nem wall
 *     ball em separado.
 *
 * O TEMPO DE CADA ESTAÇÃO É ESTIMATIVA
 *
 * O tempo de estação é dividido igualmente entre as oito. Na prova real o
 * trenó e o wall ball costumam levar mais que o carregamento; como as seis
 * estações de força usam o mesmo MET, a divisão só afeta o peso do SkiErg
 * e do remo, que é pequeno.
 */

import {
  FONTE_ACSM,
  FONTE_HALL,
  arredondaKcal,
  formataTempo,
  kcalPorMinuto,
  parseNumero,
  type Fonte,
} from "./polichinelo";
import { FONTE_ACSM_CORRIDA, metCorrida, parsePace, formataPace, VELOCIDADE_MIN_CORRIDA } from "./corrida";

export { arredondaKcal, formataTempo, kcalPorMinuto, parseNumero, parsePace, formataPace, FONTE_HALL };

/* ───────────────────────── Fontes ───────────────────────── */

export const FONTE_COMPENDIO_HYROX: Fonte = {
  rotulo:
    "Ainsworth BE, Haskell WL, Herrmann SD, et al. 2011 Compendium of Physical Activities: a second update of codes and MET values. Medicine & Science in Sports & Exercise, 2011",
  rotuloCurto: "Compêndio de Atividades Físicas (2011)",
  url: "https://pubmed.ncbi.nlm.nih.gov/21681120/",
  resumo:
    "mede o aparelho de esqui em 6,8 METs, o remo ergométrico em esforço moderado em 8,5 e o treino em circuito vigoroso em 8,0.",
};

export const FONTES_HYROX: Fonte[] = [FONTE_ACSM_CORRIDA, FONTE_COMPENDIO_HYROX, FONTE_ACSM, FONTE_HALL];

/* ───────────────────────── A prova ───────────────────────── */

export const KM_CORRIDA = 8;

export interface Estacao {
  id: string;
  nome: string;
  distancia: string;
  met: number;
}

/** As oito estações, na ordem da prova. */
export const ESTACOES: Estacao[] = [
  { id: "ski", nome: "SkiErg", distancia: "1.000 m", met: 6.8 },
  { id: "sled-push", nome: "Sled push (empurrar o trenó)", distancia: "50 m", met: 8.0 },
  { id: "sled-pull", nome: "Sled pull (puxar o trenó)", distancia: "50 m", met: 8.0 },
  { id: "burpee", nome: "Burpee broad jump", distancia: "80 m", met: 8.0 },
  { id: "remo", nome: "Remo", distancia: "1.000 m", met: 8.5 },
  { id: "farmers", nome: "Farmers carry (carregamento)", distancia: "200 m", met: 8.0 },
  { id: "lunges", nome: "Sandbag lunges (avanço com saco)", distancia: "100 m", met: 8.0 },
  { id: "wallball", nome: "Wall balls", distancia: "100 repetições", met: 8.0 },
];

/** MET médio das estações, com o tempo dividido igualmente entre as oito. */
export const MET_ESTACOES = ESTACOES.reduce((s, e) => s + e.met, 0) / ESTACOES.length;

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
/** Recorde mundial perto de 53 min; abaixo de 45 é erro de digitação. */
export const TEMPO_MIN = 45;
export const TEMPO_MAX = 240;
/** Pace da corrida dentro da prova: de 3:00 a 10:00 por km. */
export const PACE_MIN_SEG = 180;
export const PACE_MAX_SEG = 600;
/** Pelo menos 1 minuto por estação. */
export const MIN_ESTACOES = 8;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const tempoValido = (m: number | null): m is number => m !== null && m >= TEMPO_MIN && m <= TEMPO_MAX;
export const paceValido = (s: number | null): s is number => s !== null && s >= PACE_MIN_SEG && s <= PACE_MAX_SEG;

/** "1:25" ou "1h25" ou "85" → minutos. */
export function parseTempoProva(texto: string): number | null {
  const t = texto.trim().toLowerCase().replace(/\s/g, "");
  if (!t) return null;
  const hm = t.match(/^(\d{1,2})(?:h|:)(\d{1,2})(?:min|m)?$/);
  if (hm) {
    const m = Number(hm[2]);
    return m < 60 ? Number(hm[1]) * 60 + m : null;
  }
  const n = parseNumero(t.replace(/min|m$/, ""));
  return n !== null && Number.isFinite(n) ? n : null;
}

/* ───────────────────────── O cálculo ───────────────────────── */

export interface Resultado {
  minutosTotais: number;
  minutosCorrida: number;
  minutosEstacoes: number;
  metCorrida: number;
  kcalCorrida: number;
  kcalEstacoes: number;
  kcalPorEstacao: { estacao: Estacao; kcal: number }[];
  kcal: number;
  kcalLiquida: number;
}

/**
 * Devolve null quando a corrida sozinha não deixa tempo para as estações —
 * 8 km a 7:00 não cabem numa prova de 60 minutos.
 */
export function calcula(pesoKg: number, minutosTotais: number, paceSegPorKm: number): Resultado | null {
  const minutosCorrida = (KM_CORRIDA * paceSegPorKm) / 60;
  const minutosEstacoes = minutosTotais - minutosCorrida;
  if (minutosEstacoes < MIN_ESTACOES) return null;
  const velocidade = 3600 / paceSegPorKm;
  const met = metCorrida(Math.max(velocidade, VELOCIDADE_MIN_CORRIDA));
  const kcalCorrida = kcalPorMinuto(met, pesoKg) * minutosCorrida;
  const porEstacao = minutosEstacoes / ESTACOES.length;
  const kcalPorEstacao = ESTACOES.map((e) => ({ estacao: e, kcal: kcalPorMinuto(e.met, pesoKg) * porEstacao }));
  const kcalEstacoes = kcalPorEstacao.reduce((s, x) => s + x.kcal, 0);
  const kcal = kcalCorrida + kcalEstacoes;
  return {
    minutosTotais,
    minutosCorrida,
    minutosEstacoes,
    metCorrida: met,
    kcalCorrida,
    kcalEstacoes,
    kcalPorEstacao,
    kcal,
    kcalLiquida: kcal - kcalPorMinuto(1, pesoKg) * minutosTotais,
  };
}

/* ───────────────────────── Provas do artigo ───────────────────────── */

export interface Prova {
  id: string;
  nome: string;
  minutos: number;
  paceSeg: number;
}

export const PROVAS: Prova[] = [
  { id: "rapida", nome: "Prova forte", minutos: 70, paceSeg: 300 },
  { id: "media", nome: "Prova média", minutos: 90, paceSeg: 360 },
  { id: "estreia", nome: "Primeira prova", minutos: 115, paceSeg: 420 },
];

export interface LinhaProva {
  prova: Prova;
  kcal70: number;
  kcal90: number;
  fracaoCorrida: number;
}

export function tabelaProvas(): LinhaProva[] {
  return PROVAS.map((p) => {
    const a = calcula(70, p.minutos, p.paceSeg)!;
    return {
      prova: p,
      kcal70: arredondaKcal(a.kcal),
      kcal90: arredondaKcal(calcula(90, p.minutos, p.paceSeg)!.kcal),
      fracaoCorrida: a.minutosCorrida / a.minutosTotais,
    };
  });
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. O tempo de cada estação muda com a categoria, a carga e a técnica — e o tempo na Roxzone, entre a corrida e a estação, entra junto com as estações.";

export const NOTA_PROVA =
  "Uma prova não emagrece ninguém — é um dia. O que emagrece é o treino das semanas antes dela, somado a uma alimentação em ordem.";

export const NOTA_SEGURANCA =
  "Hyrox é uma hora ou mais de esforço alto com carga. Com alguma condição cardiovascular, dor articular ou pouca base de corrida, faça a primeira prova em dupla e converse com quem acompanha você.";

/* ───────────────────────── Artigos ───────────────────────── */

/** Artigos que EMBUTEM a calculadora, logo depois da primeira seção. */
export const ARTIGOS_COM_CALCULADORA_HYROX: string[] = ["hyrox-o-que-e"];
