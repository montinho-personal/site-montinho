/**
 * O motor da Calculadora de Calorias Subindo Escada.
 *
 * POR QUE A ESCADA SAIU DA CALCULADORA DE ATIVIDADES
 *
 * Pelo mesmo critério das outras: só sai quem tem uma conta que as outras
 * não têm. Na escada são os ANDARES.
 *
 * Ninguém sabe quantos minutos passou na escada — sabe quantos andares
 * subiu. O artigo `subir-escada-emagrece` fala em "três ou quatro subidas
 * de dois andares por dia" e na "regra dos 3 andares", não em minutos. A
 * calculadora coletiva perguntava tempo. Aqui a pessoa informa andares e
 * subidas, e escolhe se desce de escada ou de elevador — descer também
 * conta, e o Compêndio mede.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 *
 * Compêndio de Atividades Físicas de 2011, confirmado por busca pelos
 * códigos, sem valor informado: 17133, subir escada devagar, 4,0; 17134,
 * subir escada rápido, 8,8; 17070, descer escada, 3,5.
 *
 * O TEMPO POR ANDAR É ESTIMATIVA
 *
 * O Compêndio dá gasto por minuto; a pessoa informa andares. A ponte é o
 * tempo de um andar — cerca de 17 degraus e 3 metros. Usamos 18 segundos
 * no passo do dia a dia, 10 no ritmo de treino e 12 descendo. É a parte
 * mais incerta da conta, e a página diz isso.
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

export const FONTE_COMPENDIO_ESCADA: Fonte = {
  rotulo:
    "Ainsworth BE, Haskell WL, Herrmann SD, et al. 2011 Compendium of Physical Activities: a second update of codes and MET values. Medicine & Science in Sports & Exercise, 2011",
  rotuloCurto: "Compêndio de Atividades Físicas (2011)",
  url: "https://pubmed.ncbi.nlm.nih.gov/21681120/",
  resumo:
    "mede subir escada em 4,0 METs no passo do dia a dia e em 8,8 METs em ritmo rápido, e descer escada em 3,5 METs.",
};

export const FONTES_ESCADA: Fonte[] = [FONTE_COMPENDIO_ESCADA, FONTE_ACSM, FONTE_HALL];

/* ───────────────────────── Ritmos ───────────────────────── */

export type RitmoId = "dia" | "treino";

export interface Ritmo {
  id: RitmoId;
  nome: string;
  met: number;
  /** Segundos para subir um andar nesse ritmo. Estimativa. */
  segundosPorAndar: number;
  descricao: string;
}

export const RITMOS: Ritmo[] = [
  { id: "dia", nome: "Passo do dia a dia", met: 4.0, segundosPorAndar: 18, descricao: "Subindo no seu passo, sem pressa — o trajeto de casa ou do trabalho." },
  { id: "treino", nome: "Ritmo de treino", met: 8.8, segundosPorAndar: 10, descricao: "Subida apressada e contínua, feita como exercício. Chega ofegante." },
];

export const ritmo = (id: RitmoId): Ritmo => RITMOS.find((r) => r.id === id)!;

/** Descer escada. */
export const MET_DESCIDA = 3.5;
export const SEGUNDOS_DESCIDA_POR_ANDAR = 12;
/** Altura de um andar, em metros, para a conta de metros subidos. */
export const METROS_POR_ANDAR = 3;

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const ANDARES_MAX = 60;
export const SUBIDAS_MAX = 30;
export const DIAS_SEMANA = [2, 3, 5, 7] as const;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const andaresValidos = (a: number | null): a is number => a !== null && Number.isInteger(a) && a >= 1 && a <= ANDARES_MAX;
export const subidasValidas = (s: number | null): s is number => s !== null && Number.isInteger(s) && s >= 1 && s <= SUBIDAS_MAX;

/* ───────────────────────── Situações do artigo ───────────────────────── */

export interface Situacao {
  id: string;
  nome: string;
  andares: number;
  subidas: number;
  ritmo: RitmoId;
  desceDeEscada: boolean;
}

export const SITUACOES: Situacao[] = [
  /* "Três ou quatro subidas de dois andares por dia", do artigo. */
  { id: "elevador", nome: "Trocar o elevador", andares: 2, subidas: 4, ritmo: "dia", desceDeEscada: true },
  { id: "predio", nome: "Morar no 10º andar", andares: 10, subidas: 1, ritmo: "dia", desceDeEscada: false },
  { id: "treino", nome: "Treino de escada", andares: 5, subidas: 10, ritmo: "treino", desceDeEscada: true },
];

/* ───────────────────────── O cálculo ───────────────────────── */

export interface Resultado {
  andaresTotais: number;
  metros: number;
  minutosSubindo: number;
  minutosDescendo: number;
  minutosTotais: number;
  kcalSubida: number;
  kcalDescida: number;
  kcal: number;
  kcalLiquida: number;
}

export function calcula(pesoKg: number, r: RitmoId, andares: number, subidas: number, desceDeEscada: boolean): Resultado {
  const rt = ritmo(r);
  const andaresTotais = andares * subidas;
  const minutosSubindo = (andaresTotais * rt.segundosPorAndar) / 60;
  const minutosDescendo = desceDeEscada ? (andaresTotais * SEGUNDOS_DESCIDA_POR_ANDAR) / 60 : 0;
  const minutosTotais = minutosSubindo + minutosDescendo;
  const kcalSubida = kcalPorMinuto(rt.met, pesoKg) * minutosSubindo;
  const kcalDescida = kcalPorMinuto(MET_DESCIDA, pesoKg) * minutosDescendo;
  const kcal = kcalSubida + kcalDescida;
  return {
    andaresTotais,
    metros: andaresTotais * METROS_POR_ANDAR,
    minutosSubindo,
    minutosDescendo,
    minutosTotais,
    kcalSubida,
    kcalDescida,
    kcal,
    kcalLiquida: kcal - kcalPorMinuto(1, pesoKg) * minutosTotais,
  };
}

/** Quanto custa um andar subido nesse ritmo, sem a descida. */
export function kcalPorAndar(pesoKg: number, r: RitmoId): number {
  const rt = ritmo(r);
  return kcalPorMinuto(rt.met, pesoKg) * (rt.segundosPorAndar / 60);
}

/** Gasto líquido por mês, em kcal, e o que isso vira em gordura, como teto. */
export function kcalPorMes(r: Resultado, diasPorSemana: number): number {
  return r.kcalLiquida * diasPorSemana * (52 / 12);
}

export function kgPorMes(r: Resultado, diasPorSemana: number): number {
  return kcalPorMes(r, diasPorSemana) / KCAL_POR_KG_GORDURA;
}

/**
 * Edifício Itália, em São Paulo: 46 andares. Dá escala aos andares do mês
 * sem inventar precisão — é uma comparação, não uma meta.
 */
export const ANDARES_EDIFICIO_ITALIA = 46;

export interface LinhaSituacao {
  situacao: Situacao;
  minutosTotais: number;
  kcal70: number;
  kcal90: number;
}

export function tabelaSituacoes(): LinhaSituacao[] {
  return SITUACOES.map((s) => {
    const a = calcula(70, s.ritmo, s.andares, s.subidas, s.desceDeEscada);
    const b = calcula(90, s.ritmo, s.andares, s.subidas, s.desceDeEscada);
    return { situacao: s, minutosTotais: a.minutosTotais, kcal70: arredondaKcal(a.kcal), kcal90: arredondaKcal(b.kcal) };
  });
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. O tempo de cada andar muda com a altura do degrau, o número de degraus e o passo de cada um — é a parte mais incerta da conta.";

export const NOTA_LINEAR =
  "A conta em quilos é linear e serve como teto: o corpo compensa parte do gasto, e o peso cai mais devagar do que ela sugere.";

export const NOTA_SEM_PERDA_LOCALIZADA =
  "Nenhum exercício escolhe de onde o corpo tira gordura. A escada aumenta o gasto da semana; onde a gordura sai primeiro é decidido por genética e hormônio.";

export const NOTA_SEGURANCA =
  "Com dor no joelho, problema cardíaco ou muito peso a perder, comece por poucos andares no passo do dia a dia e converse com quem acompanha você antes do ritmo de treino.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora, logo depois da primeira seção.
 *
 * O `subir-escada-emagrece` saiu do registro da calculadora de atividades:
 * a regra da casa é uma ferramenta por artigo.
 */
export const ARTIGOS_COM_CALCULADORA_ESCADA: string[] = ["subir-escada-emagrece"];
