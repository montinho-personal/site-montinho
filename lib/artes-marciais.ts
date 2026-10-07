/**
 * O motor da Calculadora de Calorias nas Artes Marciais.
 *
 * PARA QUE ELA EXISTE
 *
 * Jiu-jitsu, muay thai e boxe já têm calculadora própria, cada uma com a
 * conta que só aquela luta tem (rolas, rounds, cadência de socos). Esta
 * responde a pergunta de quem pratica outra arte marcial, ou quer comparar:
 * "a mesma aula, em cada modalidade, gasta quanto?". A conta é a mesma em
 * todas: tempo de técnica e tempo de luta (rola, sparring, randori, kumite,
 * combate), cada um com o seu MET.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 *     kcal/min = MET × 3,5 × peso(kg) ÷ 200
 *
 * O Compêndio de Atividades Físicas NÃO mede cada arte marcial em separado.
 * Compêndio de 2011: 15425 (artes marciais, ritmo lento, iniciante,
 * treino) = 5,3; 15430 (artes marciais, ritmo moderado, que cita jiu-jitsu,
 * judô, caratê, kickboxing e muay thai) = 10,3. O taekwondo usa os mesmos
 * dois valores de artes marciais. Importamos esses
 * dois de lib/jiujitsu.ts para as calculadoras nunca divergirem.
 *
 * MMA não tem entrada própria no Compêndio. Como o MMA é uma mistura
 * dessas artes, usa os mesmos dois valores, e a página diz isso.
 *
 * O boxe tem entradas próprias no Compêndio de 2024 (lib/boxe.ts): saco de
 * pancada geral 5,8 (código 15110) como técnica e sparring 7,8 (código
 * 15120) como luta. Lemos de lá.
 *
 * O QUE FICA DE FORA
 *
 * Kung fu, capoeira, tai chi, wrestling: sem valor verificado no site, não
 * entram. Não inventamos MET.
 */

import {
  FONTE_ACSM,
  arredondaKcal,
  formataTempo,
  kcalPorMinuto,
  parseNumero,
  type Fonte,
} from "./polichinelo";
import { MET_ROLA, MET_TECNICA } from "./jiujitsu";
import { FONTE_COMPENDIO_BOXE, aula as aulaBoxe } from "./boxe";

export { arredondaKcal, formataTempo, kcalPorMinuto, parseNumero, MET_ROLA, MET_TECNICA, FONTE_COMPENDIO_BOXE };

/* ───────────────────────── Fontes ───────────────────────── */

export const FONTE_COMPENDIO_ARTES: Fonte = {
  rotulo:
    "Ainsworth BE, Haskell WL, Herrmann SD, et al. 2011 Compendium of Physical Activities: a second update of codes and MET values. Medicine & Science in Sports & Exercise, 2011",
  rotuloCurto: "Compêndio de Atividades Físicas (2011)",
  url: "https://pubmed.ncbi.nlm.nih.gov/21681120/",
  resumo:
    "mede as artes marciais juntas, não cada uma: ritmo lento de treino em 5,3 METs e ritmo de luta — que cita jiu-jitsu, judô, caratê, kickboxing e muay thai — em 10,3 METs.",
};

export const FONTES_ARTES: Fonte[] = [FONTE_COMPENDIO_ARTES, FONTE_COMPENDIO_BOXE, FONTE_ACSM];

/* ───────────────────────── Modalidades ───────────────────────── */

export type ModalidadeId = "jiujitsu" | "muaythai" | "judo" | "karate" | "taekwondo" | "kickboxing" | "mma" | "boxe";

export interface Modalidade {
  id: ModalidadeId;
  nome: string;
  /** Como a parte de luta se chama nessa modalidade. */
  luta: string;
  metTecnica: number;
  metLuta: number;
  /** Calculadora dedicada, quando existe. */
  calculadora?: { href: string; nome: string };
  nota?: string;
}

const SACO = aulaBoxe("saco").met;
const SPARRING = aulaBoxe("sparring").met;

export const MODALIDADES: Modalidade[] = [
  {
    id: "jiujitsu", nome: "Jiu-jitsu", luta: "rola", metTecnica: MET_TECNICA, metLuta: MET_ROLA,
    calculadora: { href: "/ferramentas/calculadora-calorias-jiu-jitsu", nome: "Calculadora de Calorias no Jiu-Jitsu" },
  },
  {
    id: "muaythai", nome: "Muay thai", luta: "sparring", metTecnica: MET_TECNICA, metLuta: MET_ROLA,
    calculadora: { href: "/ferramentas/calculadora-calorias-muay-thai", nome: "Calculadora de Calorias no Muay Thai" },
  },
  { id: "judo", nome: "Judô", luta: "randori", metTecnica: MET_TECNICA, metLuta: MET_ROLA },
  { id: "karate", nome: "Caratê", luta: "kumite", metTecnica: MET_TECNICA, metLuta: MET_ROLA },
  { id: "taekwondo", nome: "Taekwondo", luta: "luta", metTecnica: MET_TECNICA, metLuta: MET_ROLA },
  { id: "kickboxing", nome: "Kickboxing", luta: "sparring", metTecnica: MET_TECNICA, metLuta: MET_ROLA },
  {
    id: "mma", nome: "MMA", luta: "sparring", metTecnica: MET_TECNICA, metLuta: MET_ROLA,
    nota: "O Compêndio não tem uma entrada própria para o MMA. Como ele mistura essas artes, usamos os mesmos valores delas.",
  },
  {
    id: "boxe", nome: "Boxe", luta: "sparring", metTecnica: SACO, metLuta: SPARRING,
    calculadora: { href: "/ferramentas/calculadora-calorias-boxe", nome: "Calculadora de Calorias no Boxe" },
    nota: "O boxe tem medida própria no Compêndio de 2024: saco de pancada como técnica e sparring como luta.",
  },
];

export const MODALIDADE_PADRAO: ModalidadeId = "jiujitsu";

export function modalidade(id: ModalidadeId): Modalidade {
  return MODALIDADES.find((m) => m.id === id) ?? MODALIDADES[0];
}

/* ───────────────────────── Limites ───────────────────────── */

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const PESO_PADRAO = 70;
export const AULA_MIN = 20;
export const AULA_MAX = 180;
export const PRESETS_AULA = [60, 75, 90] as const;
export const LUTA_PADRAO = 15;

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const aulaValida = (m: number | null): m is number => m !== null && m >= AULA_MIN && m <= AULA_MAX;
export const lutaValida = (m: number | null): m is number => m !== null && m >= 0 && m <= AULA_MAX;

/* ───────────────────────── O cálculo ───────────────────────── */

export interface Resultado {
  modalidade: ModalidadeId;
  minutosAula: number;
  minutosLuta: number;
  minutosTecnica: number;
  kcalTecnica: number;
  kcalLuta: number;
  kcal: number;
}

/** Devolve null quando a luta não cabe na aula. */
export function calcula(id: ModalidadeId, pesoKg: number, minutosAula: number, minutosLuta: number): Resultado | null {
  if (minutosLuta < 0 || minutosLuta > minutosAula) return null;
  const m = modalidade(id);
  const minutosTecnica = minutosAula - minutosLuta;
  const kcalTecnica = kcalPorMinuto(m.metTecnica, pesoKg) * minutosTecnica;
  const kcalLuta = kcalPorMinuto(m.metLuta, pesoKg) * minutosLuta;
  return { modalidade: id, minutosAula, minutosLuta, minutosTecnica, kcalTecnica, kcalLuta, kcal: kcalTecnica + kcalLuta };
}

export interface LinhaComparacao {
  modalidade: Modalidade;
  kcal: number;
}

/** A mesma aula (duração e minutos de luta) em cada modalidade. */
export function comparaModalidades(pesoKg: number, minutosAula: number, minutosLuta: number): LinhaComparacao[] {
  return MODALIDADES.map((m) => ({ modalidade: m, kcal: calcula(m.id, pesoKg, minutosAula, minutosLuta)?.kcal ?? 0 }));
}

export interface FaixaHora {
  modalidade: Modalidade;
  tecnica: number;
  luta: number;
}

/** Uma hora inteira só de técnica e uma hora inteira só de luta: as pontas da faixa. */
export function faixaHora(pesoKg: number = PESO_PADRAO): FaixaHora[] {
  return MODALIDADES.map((m) => ({
    modalidade: m,
    tecnica: arredondaKcal(calcula(m.id, pesoKg, 60, 0)!.kcal),
    luta: arredondaKcal(calcula(m.id, pesoKg, 60, 60)!.kcal),
  }));
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_ESTIMATIVA =
  "É uma estimativa. Duas pessoas do mesmo peso gastam diferente na mesma aula: muda com a técnica, o nível e o quanto cada uma relaxa ou trava na luta.";

export const NOTA_TECNICA =
  "O tempo que não é luta conta como técnica: aquecimento, explicação, drill e repetição. Pausas longas paradas gastam menos que isso.";

export const NOTA_SEGURANCA =
  "Luta é esforço perto do máximo. Com alguma condição cardiovascular, ou voltando depois de muito tempo parado, converse com quem acompanha você antes de emendar lutas.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora. Uma ferramenta por artigo.
 * São as notícias de evento de luta (UFC), que não são sobre uma
 * modalidade só: a pergunta do leitor é "e numa aula, quanto eu gastaria?".
 */
export const ARTIGOS_COM_CALCULADORA_ARTES_MARCIAIS: string[] = [
  "ufc-332-natalia-silva",
  "brasileiros-ufc-332",
  "corte-de-peso-ufc",
  "pesagem-ufc-332",
  "resultado-ufc-332",
  "ufc-vegas-124-gabriel-bonfim-sean-brady",
  "resultado-ufc-vegas-124-bonfim-brady",
  "ufc-vegas-122-allen-duncan",
];
