/**
 * Os treinos dos artigos, prontos para a Calculadora de Volume.
 *
 * POR QUE EXISTE
 *
 * No GA4 de setembro de 2026, 35 pessoas viram a calculadora dentro do
 * artigo de upper/lower, 16 começaram e só 2 terminaram. Quem lê sobre
 * upper/lower quer saber se o PRÓPRIO upper/lower está certo, e a
 * calculadora pedia para montar o treino do zero, exercício por exercício.
 * Aqui o treino do artigo vem pronto: a pessoa troca o que é diferente no
 * dela e vê o volume na hora. "Montar" vira "ajustar".
 *
 * Cada modelo é a ficha que o artigo publica, exercício por exercício e
 * série por série. `scripts/volume-modelos-test.ts` confere que todo id
 * existe na base de exercícios e que o artigo ainda publica aquela ficha.
 *
 * Quando o artigo usa um exercício que a base não tem com o mesmo nome, o
 * mapeamento vai com o motivo: "terra romeno" é stiff na base, "crucifixo
 * no cabo" é cross-over, "tríceps corda" é tríceps no pulley, "mergulho no
 * banco" é tríceps no banco.
 */

import type { Dia } from "./musculos";

export type ModeloId = "upper-lower" | "ppl" | "abc";

export interface ExercicioModelo {
  id: string;
  series: number;
}

export interface DiaModelo {
  dia: Dia;
  nome: string;
  itens: ExercicioModelo[];
}

export interface Modelo {
  id: ModeloId;
  nome: string;
  /** Frase curta do botão. */
  rotulo: string;
  /** O artigo que publica a ficha. */
  slug: string;
  dias: DiaModelo[];
}

export const MODELOS: Modelo[] = [
  {
    id: "upper-lower",
    nome: "Upper/Lower 4 dias",
    rotulo: "o Upper/Lower do artigo",
    slug: "treino-upper-lower-superior-inferior",
    dias: [
      {
        dia: "Seg",
        nome: "Upper A",
        itens: [
          { id: "supino-reto-barra", series: 4 },
          { id: "remada-curvada", series: 4 },
          { id: "supino-inclinado-halter", series: 3 },
          { id: "puxada-frente", series: 3 },
          { id: "desenvolvimento-halter", series: 3 },
          { id: "rosca-direta", series: 3 },
          { id: "triceps-pulley", series: 3 },
        ],
      },
      {
        dia: "Ter",
        nome: "Lower A",
        itens: [
          { id: "agachamento-livre", series: 4 },
          { id: "leg-press", series: 3 },
          { id: "cadeira-extensora", series: 3 },
          /* "Levantamento terra romeno" no artigo. */
          { id: "stiff", series: 3 },
          { id: "panturrilha-em-pe", series: 4 },
        ],
      },
      {
        dia: "Qui",
        nome: "Upper B",
        itens: [
          { id: "supino-inclinado-barra", series: 3 },
          { id: "barra-fixa", series: 3 },
          /* "Crucifixo no cabo" no artigo. */
          { id: "cross-over", series: 3 },
          { id: "remada-unilateral", series: 3 },
          { id: "elevacao-lateral", series: 4 },
          { id: "rosca-martelo", series: 3 },
          { id: "triceps-frances", series: 3 },
        ],
      },
      {
        dia: "Sex",
        nome: "Lower B",
        itens: [
          { id: "levantamento-terra", series: 4 },
          { id: "mesa-flexora", series: 3 },
          { id: "hip-thrust", series: 4 },
          { id: "agachamento-bulgaro", series: 3 },
          { id: "panturrilha-sentado", series: 4 },
        ],
      },
    ],
  },
  {
    id: "ppl",
    nome: "Push Pull Legs 3 dias",
    rotulo: "o Push Pull Legs do artigo",
    slug: "push-pull-legs",
    dias: [
      {
        dia: "Seg",
        nome: "Push",
        itens: [
          { id: "supino-reto-barra", series: 4 },
          { id: "supino-inclinado-halter", series: 3 },
          { id: "desenvolvimento-halter", series: 4 },
          { id: "elevacao-lateral", series: 3 },
          /* "Tríceps corda na polia" no artigo. */
          { id: "triceps-pulley", series: 3 },
          /* "Mergulho no banco" no artigo. */
          { id: "triceps-banco", series: 3 },
        ],
      },
      {
        dia: "Qua",
        nome: "Pull",
        itens: [
          { id: "barra-fixa", series: 4 },
          { id: "remada-curvada", series: 4 },
          { id: "remada-unilateral", series: 3 },
          { id: "puxada-frente", series: 3 },
          { id: "rosca-direta", series: 3 },
          { id: "rosca-martelo", series: 2 },
        ],
      },
      {
        dia: "Sex",
        nome: "Legs",
        itens: [
          { id: "agachamento-livre", series: 4 },
          { id: "leg-press", series: 3 },
          { id: "cadeira-extensora", series: 3 },
          { id: "mesa-flexora", series: 3 },
          { id: "stiff", series: 3 },
          { id: "panturrilha-em-pe", series: 4 },
        ],
      },
    ],
  },
  {
    id: "abc",
    nome: "ABC 3 dias",
    rotulo: "o ABC do artigo",
    slug: "como-montar-treino-abc",
    dias: [
      {
        dia: "Seg",
        nome: "A — Peito e tríceps",
        itens: [
          { id: "supino-reto-barra", series: 4 },
          { id: "supino-inclinado-halter", series: 3 },
          { id: "cross-over", series: 3 },
          { id: "triceps-testa", series: 3 },
          /* "Tríceps corda no cabo" no artigo. */
          { id: "triceps-pulley", series: 3 },
          { id: "paralelas-triceps", series: 2 },
        ],
      },
      {
        dia: "Qua",
        nome: "B — Costas e bíceps",
        itens: [
          { id: "barra-fixa", series: 4 },
          { id: "remada-curvada", series: 4 },
          { id: "remada-unilateral", series: 3 },
          { id: "puxada-triangulo", series: 3 },
          { id: "rosca-direta", series: 3 },
          { id: "rosca-concentrada", series: 3 },
        ],
      },
      {
        dia: "Sex",
        nome: "C — Pernas e ombros",
        itens: [
          { id: "agachamento-livre", series: 4 },
          { id: "leg-press-45", series: 4 },
          { id: "cadeira-extensora", series: 3 },
          { id: "mesa-flexora", series: 3 },
          { id: "panturrilha-leg-press", series: 4 },
          { id: "desenvolvimento-halter", series: 3 },
          { id: "elevacao-lateral", series: 3 },
        ],
      },
    ],
  },
];

export const modelo = (id: ModeloId): Modelo => MODELOS.find((m) => m.id === id)!;

/** O modelo que um artigo publica, quando publica. */
export const modeloDoArtigo = (slug: string): Modelo | null => MODELOS.find((m) => m.slug === slug) ?? null;
