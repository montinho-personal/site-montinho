/**
 * O catálogo de nutrientes.
 *
 * A ordem aqui é a ordem da tela, e ela responde à pergunta que a pessoa
 * chegou fazendo: energia, proteína, carboidrato, gordura, fibra. Esses
 * cinco formam o card principal; o resto fica atrás de "ver tabela
 * completa", porque quem procurou "quanto de proteína tem feijão" não quer
 * conhecer o teor de cobre antes de ter a resposta.
 *
 * `prioridade` 1 = card principal. 2 = tabela completa.
 */

import type { Unidade } from "./tipos";

export interface Nutriente {
  id: string;
  nome: string;
  /** Nome curto, para cabeçalho de tabela e comparador. */
  curto: string;
  unidade: Unidade;
  prioridade: 1 | 2;
  /** Explicação em uma frase, sem moralizar a comida. */
  nota?: string;
}

export const NUTRIENTES: Nutriente[] = [
  { id: "energia", nome: "Energia", curto: "Calorias", unidade: "kcal", prioridade: 1 },
  { id: "proteina", nome: "Proteína", curto: "Proteína", unidade: "g", prioridade: 1 },
  { id: "carboidrato", nome: "Carboidrato", curto: "Carboidratos", unidade: "g", prioridade: 1 },
  { id: "lipideos", nome: "Gorduras totais", curto: "Gorduras", unidade: "g", prioridade: 1 },
  { id: "fibra", nome: "Fibra alimentar", curto: "Fibras", unidade: "g", prioridade: 1 },

  { id: "energia-kj", nome: "Energia", curto: "Energia (kJ)", unidade: "kJ", prioridade: 2 },
  {
    id: "umidade",
    nome: "Umidade",
    curto: "Umidade",
    unidade: "g",
    prioridade: 2,
    nota: "Quanto do alimento é água. É o que explica por que 100 g de arroz cru e 100 g de arroz cozido têm valores tão diferentes.",
  },
  { id: "colesterol", nome: "Colesterol", curto: "Colesterol", unidade: "mg", prioridade: 2 },
  { id: "cinzas", nome: "Cinzas", curto: "Cinzas", unidade: "g", prioridade: 2,
    nota: "Resíduo mineral total obtido na análise. Aparece na tabela original e é mantido por fidelidade à fonte." },

  { id: "calcio", nome: "Cálcio", curto: "Cálcio", unidade: "mg", prioridade: 2 },
  { id: "magnesio", nome: "Magnésio", curto: "Magnésio", unidade: "mg", prioridade: 2 },
  { id: "manganes", nome: "Manganês", curto: "Manganês", unidade: "mg", prioridade: 2 },
  { id: "fosforo", nome: "Fósforo", curto: "Fósforo", unidade: "mg", prioridade: 2 },
  { id: "ferro", nome: "Ferro", curto: "Ferro", unidade: "mg", prioridade: 2 },
  { id: "sodio", nome: "Sódio", curto: "Sódio", unidade: "mg", prioridade: 2 },
  { id: "potassio", nome: "Potássio", curto: "Potássio", unidade: "mg", prioridade: 2 },
  { id: "cobre", nome: "Cobre", curto: "Cobre", unidade: "mg", prioridade: 2 },
  { id: "zinco", nome: "Zinco", curto: "Zinco", unidade: "mg", prioridade: 2 },

  { id: "retinol", nome: "Retinol", curto: "Retinol", unidade: "mcg", prioridade: 2 },
  { id: "vitamina-a-re", nome: "Vitamina A (RE)", curto: "Vit. A (RE)", unidade: "mcg", prioridade: 2 },
  { id: "vitamina-a-rae", nome: "Vitamina A (RAE)", curto: "Vit. A (RAE)", unidade: "mcg", prioridade: 2 },
  { id: "tiamina", nome: "Tiamina (B1)", curto: "Tiamina", unidade: "mg", prioridade: 2 },
  { id: "riboflavina", nome: "Riboflavina (B2)", curto: "Riboflavina", unidade: "mg", prioridade: 2 },
  { id: "piridoxina", nome: "Piridoxina (B6)", curto: "Piridoxina", unidade: "mg", prioridade: 2 },
  { id: "niacina", nome: "Niacina (B3)", curto: "Niacina", unidade: "mg", prioridade: 2 },
  { id: "vitamina-c", nome: "Vitamina C", curto: "Vitamina C", unidade: "mg", prioridade: 2 },
];

export const NUTRIENTE_POR_ID = new Map(NUTRIENTES.map((n) => [n.id, n]));

/** Os cinco do card principal, na ordem em que aparecem. */
export const PRINCIPAIS = NUTRIENTES.filter((n) => n.prioridade === 1).map((n) => n.id);

/**
 * Como a TACO explica o traço, na letra da própria legenda.
 *
 * Vale a pena mostrar isso ao lado da tabela: sem a definição, "tr" parece
 * uma fuga da fonte, quando na verdade é uma decisão metodológica precisa.
 */
export const DEFINICAO_TRACO =
  "A TACO adota traço quando o valor arredondado cai entre zero e meio da menor casa decimal usada, ou quando fica abaixo do limite de quantificação do método de análise.";

export const DEFINICAO_BRANCO =
  "Um campo vazio na TACO significa que a análise daquele nutriente não foi solicitada para aquele alimento — não que o nutriente seja zero.";

export const DEFINICAO_REAVALIACAO =
  "Um asterisco na TACO indica que aquela análise está sendo reavaliada — a fonte não publica valor nesta edição. É o caso do leite de vaca integral.";

export const DEFINICAO_NA =
  "\"NA\" na TACO marca nutriente não aplicável ao alimento.";
