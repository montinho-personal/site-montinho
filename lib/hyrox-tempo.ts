/**
 * O motor da Calculadora de Tempo do Hyrox.
 *
 * A CONTA É SÓ SOMA
 *
 *     tempo final = 8 × pace + tempo das 8 estações + Roxzone
 *
 * Nada aqui é estimativa de fora: os três números são da pessoa. A
 * calculadora existe porque ninguém faz essa soma de cabeça no meio do
 * treino, e porque a soma ao contrário ("que pace preciso para fazer
 * 1h30?") é a pergunta de quem está se preparando.
 *
 * O ÚNICO DADO DE FORA: A ROXZONE
 *
 * Quase ninguém sabe quanto tempo passa na Roxzone, a área de transição
 * entre a corrida e cada estação. Os três atalhos usam a análise do
 * HyroxDataLab com 825 resultados da etapa de Utrecht: 3:41 no total para
 * quem terminou abaixo de 1h10, 5:19 entre 1h20 e 1h30 e 6:58 acima de
 * 1h30. O tamanho da Roxzone muda de um pavilhão para outro, então o
 * campo aceita o valor da própria pessoa.
 */

import { formataPace, parsePace } from "./corrida";
import { ESTACOES, KM_CORRIDA, type Estacao } from "./hyrox";
import type { Fonte } from "./polichinelo";

export { ESTACOES, KM_CORRIDA, formataPace, parsePace };
export type { Estacao };

/* ───────────────────────── Fontes ───────────────────────── */

export const FONTE_ROXZONE: Fonte = {
  rotulo: "HyroxDataLab — RoxZone efficiency analysis (825 resultados, HYROX Utrecht)",
  rotuloCurto: "análise do HyroxDataLab",
  url: "https://hyroxdatalab.com/articles/roxzone-efficiency-analysis",
  resumo: "mede a Roxzone total em 3:41 abaixo de 1h10, 4:33 entre 1h10 e 1h20, 5:19 entre 1h20 e 1h30 e 6:58 acima de 1h30.",
};

export const FONTE_FORMATO: Fonte = {
  rotulo: "HYROX — The Fitness Race (formato oficial e pesos por categoria)",
  rotuloCurto: "site oficial do HYROX",
  url: "https://hyrox.com/the-fitness-race/",
  resumo: "8 trechos de 1 km de corrida, cada um seguido de uma estação, na mesma ordem em todas as provas.",
};

export const FONTES_TEMPO_HYROX: Fonte[] = [FONTE_FORMATO, FONTE_ROXZONE];

/* ───────────────────────── Roxzone ───────────────────────── */

export interface FaixaRoxzone {
  id: string;
  nome: string;
  /** Roxzone total da prova, em segundos. */
  seg: number;
}

export const ROXZONE: FaixaRoxzone[] = [
  { id: "rapida", nome: "Prova abaixo de 1h10", seg: 221 },
  { id: "media", nome: "Entre 1h20 e 1h30", seg: 319 },
  { id: "estreia", nome: "Acima de 1h30", seg: 418 },
];

/* ───────────────────────── Limites ───────────────────────── */

export const PACE_MIN_SEG = 180;
export const PACE_MAX_SEG = 600;
/** Por estação: 1 a 15 minutos. */
export const ESTACAO_MIN_SEG = 60;
export const ESTACAO_MAX_SEG = 900;
/** Roxzone total: até 20 minutos. */
export const ROX_MIN_SEG = 60;
export const ROX_MAX_SEG = 1200;
/** Meta de 45 min a 4 h. */
export const META_MIN_SEG = 45 * 60;
export const META_MAX_SEG = 240 * 60;

export const paceValido = (s: number | null): s is number => s !== null && s >= PACE_MIN_SEG && s <= PACE_MAX_SEG;
export const estacaoValida = (s: number | null): s is number => s !== null && s >= ESTACAO_MIN_SEG && s <= ESTACAO_MAX_SEG;
export const roxValida = (s: number | null): s is number => s !== null && s >= ROX_MIN_SEG && s <= ROX_MAX_SEG;
export const metaValida = (s: number | null): s is number => s !== null && s >= META_MIN_SEG && s <= META_MAX_SEG;

/* ───────────────────────── Leitura e escrita ───────────────────────── */

/** "4:30" ou "4" (minutos) → segundos. Mesma regra do pace. */
export const parseMinSeg = parsePace;

/** "1h30", "1:30", "1:30:00" ou "90" → segundos. */
export function parseTempoFinal(texto: string): number | null {
  const t = texto.trim().toLowerCase().replace(/\s/g, "");
  if (!t) return null;
  const hms = t.match(/^(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
  if (hms) {
    const [h, m, s] = [Number(hms[1]), Number(hms[2]), Number(hms[3])];
    return m < 60 && s < 60 ? h * 3600 + m * 60 + s : null;
  }
  const hm = t.match(/^(\d{1,2})(?:h|:)(\d{1,2})(?:min|m)?$/);
  if (hm) {
    const m = Number(hm[2]);
    return m < 60 ? Number(hm[1]) * 3600 + m * 60 : null;
  }
  const so = t.match(/^(\d{1,3})(?:min|m)?$/);
  return so ? Number(so[1]) * 60 : null;
}

/** Segundos → "1:28:40" ou "48:10". */
export function formataTempo(seg: number): string {
  if (!Number.isFinite(seg) || seg < 0) return "—";
  const t = Math.round(seg);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const mm = String(m).padStart(h > 0 ? 2 : 1, "0");
  return h > 0 ? `${h}:${mm}:${String(s).padStart(2, "0")}` : `${mm}:${String(s).padStart(2, "0")}`;
}

/* ───────────────────────── O cálculo ───────────────────────── */

export interface Resultado {
  totalSeg: number;
  corridaSeg: number;
  estacoesSeg: number;
  roxSeg: number;
  /** Tempo de cada estação, na ordem da prova. */
  porEstacao: { estacao: Estacao; seg: number }[];
}

/**
 * `estacoes` aceita um número (média por estação) ou as oito, na ordem.
 */
export function preve(paceSeg: number, estacoes: number | number[], roxSeg: number): Resultado {
  const lista = typeof estacoes === "number" ? ESTACOES.map(() => estacoes) : estacoes;
  const corridaSeg = KM_CORRIDA * paceSeg;
  const estacoesSeg = lista.reduce((s, x) => s + x, 0);
  return {
    totalSeg: corridaSeg + estacoesSeg + roxSeg,
    corridaSeg,
    estacoesSeg,
    roxSeg,
    porEstacao: ESTACOES.map((e, i) => ({ estacao: e, seg: lista[i] })),
  };
}

/**
 * O pace que fecha a meta. Devolve null quando estações e Roxzone sozinhas
 * já passam da meta, ou quando o pace necessário é mais rápido que 3:00.
 */
export function paceParaMeta(metaSeg: number, estacoes: number | number[], roxSeg: number): number | null {
  const est = typeof estacoes === "number" ? estacoes * ESTACOES.length : estacoes.reduce((s, x) => s + x, 0);
  const sobra = metaSeg - est - roxSeg;
  if (sobra <= 0) return null;
  const pace = sobra / KM_CORRIDA;
  return pace >= PACE_MIN_SEG ? pace : null;
}

/* ───────────────────────── Onde estão os minutos ───────────────────────── */

export interface Ganho {
  id: string;
  texto: string;
  seg: number;
}

/**
 * Três mudanças do mesmo tamanho de esforço, para a pessoa ver qual rende
 * mais minuto no tempo dela.
 */
export function ganhos(r: Resultado): Ganho[] {
  const lista: Ganho[] = [
    { id: "pace", texto: "Correr 10 segundos mais rápido em cada km", seg: KM_CORRIDA * 10 },
    { id: "estacoes", texto: "Tirar 20 segundos de cada estação", seg: ESTACOES.length * 20 },
    { id: "roxzone", texto: "Cortar 1 minuto da Roxzone", seg: r.roxSeg - 60 >= ROX_MIN_SEG ? 60 : 0 },
  ];
  return lista.filter((g) => g.seg > 0).sort((a, b) => b.seg - a.seg);
}

/** A estação mais lenta, quando a pessoa detalhou as oito. */
export function maisLenta(r: Resultado): { estacao: Estacao; seg: number } {
  return r.porEstacao.reduce((a, b) => (b.seg > a.seg ? b : a));
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_TEMPO =
  "É a soma do que você informou. No dia da prova, o pace das últimas corridas costuma cair e as estações levam mais tempo do que no treino — teste os números num simulado antes de confiar neles.";

/* ───────────────────────── Artigos ───────────────────────── */

/** Artigos que EMBUTEM a calculadora de tempo, logo depois da primeira seção. */
export const ARTIGOS_COM_CALCULADORA_TEMPO_HYROX: string[] = ["treino-de-hyrox", "estacoes-do-hyrox", "hyrox-em-dupla"];
