/**
 * O motor da Calculadora de Meta de Peso por Data.
 *
 * POR QUE ESTA FERRAMENTA EXISTE
 *
 * O `quantos-quilos-perder-ate-fim-do-ano` tem 1.104 impressões em 90 dias
 * na posição 5,8, sem ferramenta nenhuma — e a busca dele é sazonal: sobe
 * de outubro a dezembro, que é quando a data fica perto o bastante para a
 * pergunta doer.
 *
 * A PERGUNTA É AO CONTRÁRIO DA HABITUAL
 *
 * Quase toda calculadora de emagrecimento pede a meta e devolve a data:
 * "quero perder 10 kg, quando chego?". A pergunta de outubro é o inverso —
 * a data é fixa, o casamento é dia 15, o réveillon não muda de lugar. O
 * que se quer saber é quanto cabe no tempo que sobrou.
 *
 * Por isso esta ferramenta não canibaliza a Calculadora de Déficit: aquela
 * responde "quanto cortar por dia", esta responde "quanto dá, até lá" — e
 * manda para aquela quando a pessoa quer o passo seguinte.
 *
 * DE ONDE VEM A FAIXA
 *
 * De 0,5% a 1% do peso corporal por semana. É a faixa que a literatura de
 * perda de peso com preservação de massa magra usa, e ela é percentual de
 * propósito: quem pesa 120 kg pode perder 1,2 kg numa semana sem custo
 * maior de músculo do que os 0,6 kg de quem pesa 60. Uma faixa fixa em
 * quilos — "0,5 a 1 kg por semana" — é conservadora demais para quem está
 * pesado e agressiva demais para quem está leve.
 *
 * O QUE A FERRAMENTA SE RECUSA A FAZER
 *
 * Prometer o número. Ela devolve faixa, diz que as primeiras semanas
 * enganam (água e glicogênio saem antes da gordura) e recusa metas que só
 * se alcançariam com perda rápida demais, em vez de fingir que cabem.
 */

import { parseNumero } from "./polichinelo";
import { KCAL_POR_KG_GORDURA } from "./polichinelo";

export { parseNumero, KCAL_POR_KG_GORDURA };

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 35;
export const PESO_MAX = 300;

/** Abaixo de duas semanas não há o que planejar; acima de dois anos, o plano não é este. */
export const SEMANAS_MIN = 2;
export const SEMANAS_MAX = 104;

/** A faixa segura, em fração do peso corporal por semana. */
export const TAXA_MIN = 0.005;
export const TAXA_MAX = 0.01;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;

/** Semanas cheias entre hoje e a data, arredondadas para baixo. */
export function semanasAte(hoje: Date, alvo: Date): number {
  const dias = Math.floor((alvo.getTime() - hoje.getTime()) / 86400000);
  return Math.floor(dias / 7);
}

export const semanasValidas = (s: number): boolean => s >= SEMANAS_MIN && s <= SEMANAS_MAX;

/* ───────────────────────── O cálculo ───────────────────────── */

export interface Faixa {
  min: number;
  max: number;
}

export interface Resultado {
  pesoAtual: number;
  semanas: number;
  /** Quilos que cabem no prazo, na faixa segura. */
  perda: Faixa;
  /** Peso previsto na data. min é o peso mais baixo (perda maior). */
  pesoFinal: Faixa;
  /** Percentual do peso atual. */
  perdaPct: Faixa;
  /** Quilos por semana, na faixa. */
  porSemana: Faixa;
  /** Déficit diário que cada ponta exige, em kcal. */
  deficitDiario: Faixa;
}

export function calcula(pesoAtual: number, semanas: number): Resultado {
  /*
   * A taxa é percentual do peso, e o peso cai ao longo do caminho. Somar
   * "1% do peso inicial × semanas" superestima: aplicar semana a semana é a
   * conta certa, e é a diferença entre prometer 12 kg e entregar 11.
   */
  const acumula = (taxa: number) => {
    let p = pesoAtual;
    for (let i = 0; i < semanas; i++) p -= p * taxa;
    return pesoAtual - p;
  };
  const perdaMin = acumula(TAXA_MIN);
  const perdaMax = acumula(TAXA_MAX);
  const kcal = (kg: number) => (kg * KCAL_POR_KG_GORDURA) / (semanas * 7);
  return {
    pesoAtual,
    semanas,
    perda: { min: perdaMin, max: perdaMax },
    pesoFinal: { min: pesoAtual - perdaMax, max: pesoAtual - perdaMin },
    perdaPct: { min: (perdaMin / pesoAtual) * 100, max: (perdaMax / pesoAtual) * 100 },
    porSemana: { min: perdaMin / semanas, max: perdaMax / semanas },
    deficitDiario: { min: kcal(perdaMin), max: kcal(perdaMax) },
  };
}

export type Veredito = "cabe" | "apertado" | "nao-cabe";

/**
 * A meta que a pessoa tem na cabeça cabe no prazo?
 *
 * "apertado" é a faixa entre o teto seguro e uma vez e meia ele: dá para
 * chegar perto, mas o custo em massa magra sobe. Acima disso a resposta é
 * não — e dizer não aqui é mais útil que devolver um plano que não se
 * cumpre.
 */
export function avalia(r: Resultado, metaKg: number): Veredito {
  if (metaKg <= r.perda.max) return "cabe";
  if (metaKg <= r.perda.max * 1.5) return "apertado";
  return "nao-cabe";
}

/** Em quantas semanas a meta caberia com folga, no teto seguro. */
export function semanasPara(pesoAtual: number, metaKg: number): number {
  let p = pesoAtual;
  let s = 0;
  while (pesoAtual - p < metaKg && s < SEMANAS_MAX * 2) {
    p -= p * TAXA_MAX;
    s++;
  }
  return s;
}

/* ───────────────────────── Datas ───────────────────────── */

/** O fim do ano corrente, que é o alvo da busca sazonal. */
export function fimDoAno(hoje: Date): Date {
  return new Date(hoje.getFullYear(), 11, 31);
}

export function formataData(d: Date): string {
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

/** "2026-12-31" → Date local, sem o deslocamento de fuso que o construtor de string produz. */
export function parseData(iso: string): Date | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function paraISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* ───────────────────────── Formatação ───────────────────────── */

export function formataKg(kg: number): string {
  return `${kg.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`;
}

export function formataFaixaKg(f: Faixa): string {
  const n = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return `${n(f.min)} a ${n(f.max)} kg`;
}

export function formataSemanas(s: number): string {
  return `${s} ${s === 1 ? "semana" : "semanas"}`;
}

/* ───────────────────────── Tabela estática ───────────────────────── */

export const SEMANAS_TABELA = [4, 8, 12, 16, 24] as const;
export const PESOS_TABELA = [60, 70, 80, 90, 100, 120] as const;

export interface LinhaPeso {
  peso: number;
  perda: Faixa;
}

/** Uma linha por peso, para um prazo fixo. */
export function tabelaPorPeso(semanas: number): LinhaPeso[] {
  return PESOS_TABELA.map((peso) => ({ peso, perda: calcula(peso, semanas).perda }));
}

export interface LinhaPrazo {
  semanas: number;
  perda: Faixa;
}

/** Uma linha por prazo, para um peso fixo. */
export function tabelaPorPrazo(peso: number): LinhaPrazo[] {
  return SEMANAS_TABELA.map((semanas) => ({ semanas, perda: calcula(peso, semanas).perda }));
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_PRIMEIRAS_SEMANAS =
  "As primeiras duas semanas costumam enganar: sai água e glicogênio junto, e a balança desce mais rápido do que a gordura some. O contrário também vale — uma semana sem mexer o ponteiro não quer dizer que nada aconteceu.";

export const NOTA_FAIXA_PERCENTUAL =
  "A faixa é percentual do peso, não um número fixo de quilos: quem pesa 120 kg pode perder mais por semana que quem pesa 60, sem custo maior de músculo.";

export const NOTA_MUSCULO =
  "Perder mais rápido que essa faixa quase sempre significa perder mais músculo junto — e músculo perdido é metabolismo perdido, o que torna o peso mais fácil de voltar.";

export const NOTA_ESTIMATIVA =
  "É uma projeção, não uma promessa. O corpo não desce em linha reta, e semanas de platô fazem parte de qualquer processo que dá certo.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora.
 *
 * O `quantos-quilos-perder-ate-fim-do-ano` é o dono da pergunta. Os outros
 * dois têm a mesma estrutura de prazo — uma data que não se move e um
 * corpo que precisa caber nela —, e nenhum dos três pertencia a outra
 * ferramenta. Os artigos de "quanto cortar" continuam com a Calculadora de
 * Déficit: são a pergunta seguinte, não a mesma.
 */
export const ARTIGOS_COM_CALCULADORA_META: string[] = [
  "quantos-quilos-perder-ate-fim-do-ano",
  "como-emagrecer-para-casamento",
  "quanto-tempo-para-emagrecer",
];
