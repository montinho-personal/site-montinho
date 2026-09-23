/**
 * O motor da Calculadora de Calorias na Natação.
 *
 * POR QUE A NATAÇÃO SAIU DA CALCULADORA DE ATIVIDADES
 *
 * Pelo mesmo critério das outras cinco: só sai quem tem uma conta que as
 * outras não têm. Na natação são duas.
 *
 *  1. O NADO. O Compêndio mede a piscina por estilo — crawl leve e forte,
 *     costas, peito, borboleta — e a diferença entre eles é enorme: a
 *     borboleta gasta mais que o dobro do crawl leve. A calculadora
 *     coletiva reduzia isso a "leve" e "vigoroso".
 *  2. A BORDA. O artigo `natacao-emagrece` avisa que nadar 40 minutos
 *     parando a cada 50 metros gasta bem menos do que as tabelas sugerem.
 *     A calculadora pergunta o tempo nadando e o tempo parado na borda, em
 *     vez de supor uma fração. O tempo parado vale o de ficar em pé, o
 *     mesmo da lateral do futebol e do intervalo do boxe.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 *
 * Compêndio de Atividades Físicas de 2011, natação (códigos 18xxx). Costas
 * e peito são as entradas "treino ou competição" — o Compêndio também tem
 * entradas recreativas deles, que não foram confirmadas e ficam de fora.
 * Hidroginástica também fica de fora: as fontes divergem entre 4,0 e 5,5.
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

export const FONTE_COMPENDIO_NATACAO: Fonte = {
  rotulo:
    "Ainsworth BE, Haskell WL, Herrmann SD, et al. 2011 Compendium of Physical Activities: a second update of codes and MET values. Medicine & Science in Sports & Exercise, 2011",
  rotuloCurto: "Compêndio de Atividades Físicas (2011)",
  url: "https://pubmed.ncbi.nlm.nih.gov/21681120/",
  resumo:
    "mede a natação por estilo: crawl leve a moderado 5,8 METs, crawl rápido 9,8, costas em treino 9,5, peito em treino 10,3, borboleta 13,8 e natação de lazer, sem contar voltas, 6,0.",
};

export const FONTES_NATACAO: Fonte[] = [FONTE_COMPENDIO_NATACAO, FONTE_ACSM, FONTE_HALL];

/* ───────────────────────── Os nados ───────────────────────── */

export type NadoId = "crawl-leve" | "lazer" | "costas" | "crawl-forte" | "peito" | "borboleta";

export interface Nado {
  id: NadoId;
  nome: string;
  met: number;
  comoReconhecer: string;
}

/** Em ordem de gasto. O teste trava os valores. */
export const NADOS: Nado[] = [
  { id: "crawl-leve", nome: "Crawl leve", met: 5.8, comoReconhecer: "Nado contínuo e confortável, dá para manter sem olhar o relógio." },
  { id: "lazer", nome: "Nado livre, de lazer", met: 6.0, comoReconhecer: "Nadar sem contar voltas: ir, voltar, parar, brincar na água." },
  { id: "costas", nome: "Costas, em treino", met: 9.5, comoReconhecer: "Séries de costas com ritmo, como num treino de equipe." },
  { id: "crawl-forte", nome: "Crawl forte", met: 9.8, comoReconhecer: "Séries rápidas, respiração curta, pouco descanso." },
  { id: "peito", nome: "Peito, em treino", met: 10.3, comoReconhecer: "Séries de peito com ritmo — a pernada gasta mais do que parece." },
  { id: "borboleta", nome: "Borboleta", met: 13.8, comoReconhecer: "O nado mais caro que existe. Poucos sustentam por muitos metros." },
];

export const NADO_PADRAO: NadoId = "crawl-leve";

export function nado(id: NadoId): Nado {
  return NADOS.find((n) => n.id === id) ?? NADOS[0];
}

/** Parado na borda: em pé, o mesmo valor da lateral do futebol e do intervalo do boxe. */
export const MET_BORDA = 1.3;

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const PESO_PADRAO = 80;
export const MINUTOS_MIN = 5;
export const MINUTOS_MAX = 180;
export const BORDA_MAX = 120;
export const PRESETS_MINUTOS = [30, 45, 60] as const;
export const VEZES_SEMANA = [1, 2, 3, 4] as const;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const minutosValidos = (m: number | null): m is number => m !== null && m >= MINUTOS_MIN && m <= MINUTOS_MAX;
export const bordaValida = (m: number | null): m is number => m !== null && m >= 0 && m <= BORDA_MAX;

/* ───────────────────────── O cálculo ───────────────────────── */

export interface Resultado {
  minutosNadando: number;
  minutosBorda: number;
  met: number;
  kcal: number;
  kcalNadando: number;
  kcalBorda: number;
  kcalLiquida: number;
}

export function calcula(pesoKg: number, minutosNadando: number, met: number, minutosBorda = 0): Resultado {
  const kcalNadando = kcalPorMinuto(met, pesoKg) * minutosNadando;
  const kcalBorda = kcalPorMinuto(MET_BORDA, pesoKg) * minutosBorda;
  const kcal = kcalNadando + kcalBorda;
  return {
    minutosNadando,
    minutosBorda,
    met,
    kcal,
    kcalNadando,
    kcalBorda,
    kcalLiquida: kcal - kcalPorMinuto(1, pesoKg) * (minutosNadando + minutosBorda),
  };
}

export interface LinhaComparacao {
  nado: Nado;
  kcal: number;
}

/** Todos os nados no mesmo tempo nadando e peso, do que gasta mais para o que gasta menos. */
export function comparaNados(pesoKg: number, minutos: number): LinhaComparacao[] {
  return NADOS.map((n) => ({ nado: n, kcal: calcula(pesoKg, minutos, n.met).kcal })).sort((a, b) => b.kcal - a.kcal);
}

export function kgPorMes(r: Resultado, vezes: number): number {
  return ((r.kcalLiquida * vezes) / KCAL_POR_KG_GORDURA) * (52 / 12);
}

/* ───────────────────────── Tabela estática ───────────────────────── */

export interface LinhaTabela {
  nado: Nado;
  kcal70: number;
  kcal80: number;
}

/** Uma hora de cada nado, para 70 e 80 kg. O artigo publica 80 kg. */
export function tabelaNados(minutos = 60): LinhaTabela[] {
  return NADOS.map((n) => ({
    nado: n,
    kcal70: arredondaKcal(calcula(70, minutos, n.met).kcal),
    kcal80: arredondaKcal(calcula(80, minutos, n.met).kcal),
  }));
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. Duas pessoas do mesmo peso gastam diferente no mesmo nado — muda com a técnica: quem nada mal se debate mais e gasta mais por minuto, mas aguenta menos tempo.";

export const NOTA_BORDA =
  "O tempo na borda conta como ficar em pé, parado. É por isso que 40 minutos de piscina com muita parada gastam bem menos do que 40 minutos nadando.";

export const NOTA_LINEAR =
  "A conta em quilos é linear e serve como teto: o corpo compensa parte do gasto — e a fome depois da piscina é famosa por isso.";

export const NOTA_SEM_PERDA_LOCALIZADA =
  "Nenhum nado escolhe de onde o corpo tira gordura. A natação aumenta o gasto da semana; onde a gordura sai primeiro é decidido por genética e hormônio.";

export const NOTA_SEGURANCA =
  "Se você tem dor no ombro, prefira crawl e costas com técnica antes de volume, e evite a borboleta até a dor sumir. Com alguma condição cardiovascular, converse com quem acompanha você.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora, logo depois da primeira seção.
 *
 * O `natacao-emagrece` saiu do registro da calculadora de atividades: a
 * regra da casa é uma ferramenta por artigo.
 */
export const ARTIGOS_COM_CALCULADORA_NATACAO: string[] = ["natacao-emagrece"];
