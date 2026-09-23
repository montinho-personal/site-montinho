/**
 * O motor da Calculadora de Calorias no Spinning.
 *
 * POR QUE O SPINNING SAIU DA CALCULADORA DE ATIVIDADES
 *
 * Pelo mesmo critério de futebol, boxe e zumba: só sai quem tem uma conta
 * que as outras não têm. No spinning é a POTÊNCIA.
 *
 * A bike de spinning mostra watts no visor, e o Compêndio mediu a bicicleta
 * ergométrica por faixa de watts. É a única atividade do site em que a
 * pessoa digita um número que o aparelho mediu, em vez de escolher entre
 * "moderado" e "vigoroso". Quem não tem watts na bike usa a entrada de aula
 * de spinning, que o Compêndio também mediu.
 *
 * E o visor da bike ganha explicação em vez de desconfiança: muitos
 * calculam as calorias pelo trabalho feito nos pedais, em quilojoules. A
 * regra "1 kJ de trabalho ≈ 1 kcal gasta" vale porque o corpo converte em
 * pedalada cerca de um quarto da energia que queima, e 1 kcal são 4,184 kJ
 * — as duas coisas quase se cancelam. A calculadora mostra essa conta ao
 * lado da do Compêndio.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 *
 * Compêndio de Atividades Físicas de 2011, bicicleta ergométrica por faixa
 * de watts (códigos 02011 a 02015 e 02017) e aula de spinning (02019).
 * As faixas não são interpoladas: 100 W e 101 W caem em entradas
 * diferentes porque o Compêndio as mediu assim.
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
import { VISOR_TOLERANCIA_PCT, comparaVisor, leituraVisor, type LeituraVisor } from "./eliptico";

export {
  arredondaKcal,
  formataTempo,
  kcalPorMinuto,
  parseNumero,
  KCAL_POR_KG_GORDURA,
  FONTE_HALL,
  VISOR_TOLERANCIA_PCT,
  comparaVisor,
  leituraVisor,
  type LeituraVisor,
};

/* ───────────────────────── Fontes ───────────────────────── */

export const FONTE_COMPENDIO_SPINNING: Fonte = {
  rotulo:
    "Ainsworth BE, Haskell WL, Herrmann SD, et al. 2011 Compendium of Physical Activities: a second update of codes and MET values. Medicine & Science in Sports & Exercise, 2011",
  rotuloCurto: "Compêndio de Atividades Físicas (2011)",
  url: "https://pubmed.ncbi.nlm.nih.gov/21681120/",
  resumo:
    "mede a bicicleta ergométrica por faixa de potência — de 3,5 METs entre 30 e 50 watts a 14,0 METs entre 201 e 270 watts — e a aula de spinning em 8,5 METs.",
};

export const FONTES_SPINNING: Fonte[] = [FONTE_COMPENDIO_SPINNING, FONTE_ACSM, FONTE_HALL];

/* ───────────────────────── As faixas de watts ───────────────────────── */

export interface Faixa {
  codigo: string;
  de: number;
  ate: number;
  met: number;
  nome: string;
}

/** As seis faixas do Compêndio, em ordem. O teste trava os valores. */
export const FAIXAS: Faixa[] = [
  { codigo: "02011", de: 30, ate: 50, met: 3.5, nome: "muito leve" },
  { codigo: "02017", de: 51, ate: 89, met: 4.8, nome: "leve a moderado" },
  { codigo: "02012", de: 90, ate: 100, met: 6.8, nome: "moderado a vigoroso" },
  { codigo: "02013", de: 101, ate: 160, met: 8.8, nome: "vigoroso" },
  { codigo: "02014", de: 161, ate: 200, met: 11.0, nome: "vigoroso" },
  { codigo: "02015", de: 201, ate: 270, met: 14.0, nome: "muito vigoroso" },
];

export const WATTS_MIN = FAIXAS[0].de;
export const WATTS_MAX = FAIXAS[FAIXAS.length - 1].ate;

/** A faixa de uma potência média. Fora de 30 a 270 W o Compêndio não mediu, e a função devolve null. */
export function faixaDe(watts: number): Faixa | null {
  const w = Math.round(watts);
  return FAIXAS.find((f) => w >= f.de && w <= f.ate) ?? null;
}

/** Aula de spinning, quando a bike não mostra watts. */
export const MET_AULA = 8.5;
export const CODIGO_AULA = "02019";

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const PESO_PADRAO = 70;
export const MINUTOS_MIN = 5;
export const MINUTOS_MAX = 180;
export const VISOR_MIN = 1;
export const VISOR_MAX = 5000;
export const PRESETS_MINUTOS = [30, 45, 60] as const;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const minutosValidos = (m: number | null): m is number => m !== null && m >= MINUTOS_MIN && m <= MINUTOS_MAX;
export const wattsNoCompendio = (w: number | null): w is number => w !== null && faixaDe(w) !== null;
export const visorValido = (v: number | null): v is number => v !== null && v >= VISOR_MIN && v <= VISOR_MAX;

/* ───────────────────────── O cálculo ───────────────────────── */

export interface Resultado {
  minutos: number;
  met: number;
  kcal: number;
  kcalLiquida: number;
}

export function calcula(pesoKg: number, minutos: number, met: number): Resultado {
  const kcal = kcalPorMinuto(met, pesoKg) * minutos;
  return { minutos, met, kcal, kcalLiquida: kcal - kcalPorMinuto(1, pesoKg) * minutos };
}

/**
 * O trabalho feito nos pedais, em quilojoules — e, pela regra do ciclismo,
 * aproximadamente as kcal que o corpo gastou. É a conta que muitos visores
 * de bike usam, e não depende do peso.
 */
export function kjDoTrabalho(watts: number, minutos: number): number {
  return (watts * minutos * 60) / 1000;
}

export interface Semana {
  aulas: number;
  kcalLiquida: number;
  kgMes: number;
}

export function semana(r: Resultado, aulas: number): Semana {
  const kcalLiquida = r.kcalLiquida * aulas;
  return { aulas, kcalLiquida, kgMes: (kcalLiquida / KCAL_POR_KG_GORDURA) * (52 / 12) };
}

/* ───────────────────────── Tabelas estáticas ───────────────────────── */

export const PESOS_TABELA = [60, 70, 80, 90, 100] as const;

export interface LinhaFaixa {
  faixa: Faixa;
  kcal70: number;
  kcal90: number;
}

/** Uma aula de 45 minutos em cada faixa de watts, para 70 e 90 kg. É o que o artigo publica. */
export function tabelaPorFaixa(minutos = 45): LinhaFaixa[] {
  return FAIXAS.map((faixa) => ({
    faixa,
    kcal70: arredondaKcal(calcula(70, minutos, faixa.met).kcal),
    kcal90: arredondaKcal(calcula(90, minutos, faixa.met).kcal),
  }));
}

export interface LinhaPeso {
  peso: number;
  aula: number;
}

/** Uma aula de 45 minutos sem watts, por peso. */
export function tabelaPorPeso(minutos = 45): LinhaPeso[] {
  return PESOS_TABELA.map((peso) => ({ peso, aula: arredondaKcal(calcula(peso, minutos, MET_AULA).kcal) }));
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. Duas pessoas do mesmo peso gastam diferente na mesma aula — muda com a carga, a técnica e o condicionamento.";

export const NOTA_FAIXAS =
  "As faixas de watts são as que o Compêndio mediu, e não são interpoladas. Por isso 100 W e 101 W dão números diferentes: caem em entradas diferentes da tabela.";

export const NOTA_KJ =
  "O visor da bike muitas vezes calcula pelo trabalho nos pedais: 1 kJ de trabalho vale mais ou menos 1 kcal gasta, porque o corpo converte em pedalada só cerca de um quarto do que queima. Essa conta não usa o seu peso — a do Compêndio usa.";

export const NOTA_SEGURANCA =
  "Se você sente dor no joelho, confira a altura do banco antes de aumentar a carga. Com alguma condição cardiovascular, converse com quem acompanha você antes das aulas de tiro.";

export const NOTA_SEM_PERDA_LOCALIZADA =
  "Pedalar não afina a coxa. O spinning aumenta o gasto da semana; onde a gordura sai primeiro é decidido por genética e hormônio.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora, logo depois da primeira seção —
 * a das calorias de uma aula.
 *
 * O `spinning-emagrece` saiu do registro da calculadora de atividades: a
 * regra da casa é uma ferramenta por artigo.
 */
export const ARTIGOS_COM_CALCULADORA_SPINNING: string[] = ["spinning-emagrece"];
