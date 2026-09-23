/**
 * O motor da Calculadora de Calorias na Dança.
 *
 * POR QUE A DANÇA SAIU DA CALCULADORA DE ATIVIDADES
 *
 * Pelo mesmo critério de futebol, boxe, zumba e spinning: só sai quem tem
 * uma conta que as outras não têm. Na dança é o ESTILO.
 *
 * O artigo `danca-emagrece` se chama "qualquer ritmo vale?" e é
 * organizado por estilo. A calculadora coletiva reduzia isso a "social"
 * e "intensa". Aqui a pessoa escolhe o que dança, e o resultado compara
 * todos os estilos no mesmo tempo e com o mesmo peso — que é a resposta
 * à pergunta do título.
 *
 * O QUE É MEDIDA E O QUE É ENCAIXE
 *
 * O Compêndio de Atividades Físicas não mede forró, funk nem samba no pé.
 * Cada estilo brasileiro entra na entrada medida mais próxima, e a
 * calculadora diz isso ao lado do estilo. O samba é o caso delicado: o
 * Compêndio põe "samba" no salão lento, junto com valsa e tango — é o
 * samba de salão. O samba no pé de carnaval é outra dança, bem mais
 * intensa, e entra como dança de academia, com o aviso de que é encaixe.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 *
 * Compêndio de 2011: salão lento 3,0; ballet ou jazz em aula 5,0; ballet
 * em exercícios de barra 6,3; e os dois valores que a calculadora
 * coletiva já usava, dança social 5,5 e dança vigorosa 7,8.
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

export const FONTE_COMPENDIO_DANCA: Fonte = {
  rotulo:
    "Ainsworth BE, Haskell WL, Herrmann SD, et al. 2011 Compendium of Physical Activities: a second update of codes and MET values. Medicine & Science in Sports & Exercise, 2011",
  rotuloCurto: "Compêndio de Atividades Físicas (2011)",
  url: "https://pubmed.ncbi.nlm.nih.gov/21681120/",
  resumo:
    "mede a dança de salão lenta — onde põe valsa, tango e samba de salão — em 3,0 METs, a aula de ballet ou jazz em 5,0, os exercícios de ballet em 6,3, a dança social em 5,5 e a dança vigorosa em 7,8.",
};

export const FONTES_DANCA: Fonte[] = [FONTE_COMPENDIO_DANCA, FONTE_ACSM, FONTE_HALL];

/* ───────────────────────── Os estilos ───────────────────────── */

export type EstiloId = "salao" | "forro" | "ballet" | "ballet-fitness" | "academia" | "samba";

export interface Estilo {
  id: EstiloId;
  nome: string;
  exemplos: string;
  met: number;
  /** A entrada do Compêndio. */
  origem: string;
  /** Quando o estilo não tem entrada própria: o porquê do encaixe. */
  encaixe: string | null;
}

/**
 * Os estilos, em ordem de gasto. O teste trava os METs.
 *
 * Samba no pé e dança de academia usam a mesma entrada, e isso é dito:
 * duas linhas com o mesmo número é o preço de não inventar um terceiro.
 */
export const ESTILOS: Estilo[] = [
  {
    id: "salao",
    nome: "Salão lento",
    exemplos: "valsa, bolero, tango, samba de gafieira",
    met: 3.0,
    origem: "dança de salão, lenta",
    encaixe: null,
  },
  {
    id: "ballet",
    nome: "Ballet ou jazz",
    exemplos: "aula de técnica, com explicação",
    met: 5.0,
    origem: "ballet, moderno ou jazz, aula",
    encaixe: null,
  },
  {
    id: "forro",
    nome: "Forró e sertanejo",
    exemplos: "forró, sertanejo, salsa, zouk",
    met: 5.5,
    origem: "dança social, esforço moderado",
    encaixe: "O Compêndio não mede forró. Ele entra como dança social: movimento constante, par, sem exaustão.",
  },
  {
    id: "ballet-fitness",
    nome: "Ballet fitness",
    exemplos: "barra, pliés, aula de condicionamento",
    met: 6.3,
    origem: "ballet, exercícios",
    encaixe: null,
  },
  {
    id: "academia",
    nome: "Dança de academia",
    exemplos: "funk, hip hop, fitdance, street",
    met: 7.8,
    origem: "dança geral, esforço vigoroso",
    encaixe: "O Compêndio não mede funk nem hip hop. Eles entram como dança vigorosa: ritmo rápido e contínuo, do tipo que deixa suado.",
  },
  {
    id: "samba",
    nome: "Samba no pé",
    exemplos: "samba de roda, escola de samba, carnaval",
    met: 7.8,
    origem: "dança geral, esforço vigoroso",
    encaixe:
      "O samba que o Compêndio mede é o de salão, a 3,0 METs, junto com valsa e tango. O samba no pé é outra dança, bem mais intensa, e entra como dança vigorosa — o valor mais próximo, não uma medida própria.",
  },
];

export const ESTILO_PADRAO: EstiloId = "forro";

export function estilo(id: EstiloId): Estilo {
  return ESTILOS.find((e) => e.id === id) ?? ESTILOS[2];
}

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const PESO_PADRAO = 70;
export const MINUTOS_MIN = 10;
export const MINUTOS_MAX = 300;
export const PRESETS_MINUTOS = [30, 60, 120] as const;
export const VEZES_SEMANA = [1, 2, 3, 4] as const;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const minutosValidos = (m: number | null): m is number => m !== null && m >= MINUTOS_MIN && m <= MINUTOS_MAX;

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

export interface LinhaComparacao {
  estilo: Estilo;
  kcal: number;
}

/** Todos os estilos no mesmo tempo e peso, do que gasta mais para o que gasta menos. */
export function comparaEstilos(pesoKg: number, minutos: number): LinhaComparacao[] {
  return ESTILOS.map((e) => ({ estilo: e, kcal: calcula(pesoKg, minutos, e.met).kcal })).sort((a, b) => b.kcal - a.kcal);
}

export function kgPorMes(r: Resultado, vezes: number): number {
  return ((r.kcalLiquida * vezes) / KCAL_POR_KG_GORDURA) * (52 / 12);
}

/* ───────────────────────── Tabela estática ───────────────────────── */

export interface LinhaTabela {
  estilo: Estilo;
  kcal70: number;
  kcal90: number;
}

/** Uma hora de cada estilo, para 70 e 90 kg. É o que o artigo publica. */
export function tabelaEstilos(minutos = 60): LinhaTabela[] {
  return ESTILOS.map((e) => ({
    estilo: e,
    kcal70: arredondaKcal(calcula(70, minutos, e.met).kcal),
    kcal90: arredondaKcal(calcula(90, minutos, e.met).kcal),
  }));
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. Duas pessoas do mesmo peso gastam diferente no mesmo ritmo — muda com a amplitude, a técnica e o quanto cada uma para entre as músicas.";

export const NOTA_NOITE =
  "Numa noite de baile, conte o tempo dançando, não o tempo no salão. Entre uma música e outra, o gasto cai para o de ficar em pé.";

export const NOTA_LINEAR =
  "A conta em quilos é linear e serve como teto: o corpo compensa parte do gasto, e o peso cai mais devagar do que ela sugere.";

export const NOTA_SEM_PERDA_LOCALIZADA =
  "Nenhum ritmo escolhe de onde o corpo tira gordura. Dançar aumenta o gasto da semana; onde a gordura sai primeiro é decidido por genética e hormônio.";

export const NOTA_SEGURANCA =
  "Se você tem dor no joelho ou no tornozelo, prefira ritmos sem salto e sem giro brusco. Com alguma condição cardiovascular, converse com quem acompanha você.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora, logo depois da primeira seção — a das
 * calorias por ritmo.
 *
 * O `danca-emagrece` saiu do registro da calculadora de atividades: a regra
 * da casa é uma ferramenta por artigo.
 */
export const ARTIGOS_COM_CALCULADORA_DANCA: string[] = ["danca-emagrece"];
