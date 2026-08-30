/**
 * O modelo da base nutricional.
 *
 * A decisão estrutural mais importante deste arquivo é o `ValorNutriente`
 * não ser um número.
 *
 * Um número não consegue distinguir quatro coisas que a fonte distingue — e
 * a própria legenda da TACO define as quatro, uma a uma:
 *
 *   0   — analisado, e deu zero.
 *   Tr  — traço. A TACO define: valor arredondado que cai entre 0 e 0,5
 *         (ou 0,05 / 0,005 conforme as casas decimais), ou abaixo do limite
 *         de quantificação do método.
 *   NA  — "não aplicável". O nutriente não faz sentido naquele alimento.
 *   *   — a própria TACO informa que aquela análise está sendo reavaliada.
 *         É o caso do leite de vaca integral, que nesta edição não traz
 *         valor nenhum de macronutriente.
 *   —   — em branco na fonte, que a legenda define como "análises não
 *         solicitadas". O nutriente existe, e ninguém mediu.
 *
 * NA e branco parecem a mesma coisa e não são. "Não aplicável" é uma
 * afirmação sobre o alimento; "não solicitada" é uma afirmação sobre o
 * estudo. Colapsar as duas apaga informação que a fonte teve o cuidado de
 * separar — e guardar qualquer uma delas como `0` faz a tela dizer "0 mg de
 * ferro" para um alimento que tem ferro e não foi medido. É mentira com cara
 * de dado, e é o erro mais comum em tabela nutricional na internet.
 *
 * Por isso o valor carrega o estado, e a camada de exibição é obrigada a
 * decidir o que fazer com cada um dos quatro.
 */

import type { IdFonte } from "./fontes";

/** Unidade canônica do nutriente. Conversão só acontece na exibição. */
export type Unidade = "kcal" | "kJ" | "g" | "mg" | "mcg";

export type EstadoDado =
  /** Analisado e quantificado. `valor` é o número da fonte. */
  | "analisado"
  /** Traço: presente, abaixo do limite de quantificação. `valor` é null. */
  | "traco"
  /** "NA" na fonte: o nutriente não se aplica àquele alimento. */
  | "naoAplicavel"
  /** "*" na fonte: a TACO está reavaliando esta análise. */
  | "emReavaliacao"
  /** Em branco na fonte: análise não solicitada. O dado simplesmente não existe. */
  | "naoDisponivel";

export interface ValorNutriente {
  nutrienteId: string;
  /** Por 100 g de alimento, na unidade canônica. null quando não é número. */
  valorPor100g: number | null;
  unidade: Unidade;
  estado: EstadoDado;
}

/**
 * O preparo faz parte da identidade do alimento, nunca de um campo solto.
 *
 * 100 g de arroz cru e 100 g de arroz cozido são comidas diferentes — o cru
 * tem cerca de três vezes as calorias, porque o cozido é majoritariamente
 * água. Misturar os dois numa busca é o defeito que faz uma tabela
 * nutricional dar resposta errada com número certo.
 */
export type Preparo =
  | "cru"
  | "cozido"
  | "grelhado"
  | "assado"
  | "frito"
  | "refogado"
  | "pronto para consumo";

/**
 * A taxonomia é a da TACO, não uma inventada por mim.
 *
 * Era tentador criar categorias "mais lógicas" — separar aves de carnes,
 * tubérculos de verduras. Mas a fonte agrupa os alimentos de um jeito, e
 * reagrupar significa tomar decisões de classificação que a fonte não tomou:
 * mandioca é tubérculo ou cereal? O reagrupamento vira opinião minha
 * apresentada com a autoridade da UNICAMP.
 *
 * Mantendo os quinze grupos originais, cada alimento continua exatamente
 * onde a tabela o colocou, e a conferência contra a fonte é direta.
 */
export type Categoria =
  | "cereais-e-derivados"
  | "verduras-hortalicas-e-derivados"
  | "frutas-e-derivados"
  | "gorduras-e-oleos"
  | "pescados-e-frutos-do-mar"
  | "carnes-e-derivados"
  | "leite-e-derivados"
  | "bebidas"
  | "ovos-e-derivados"
  | "produtos-acucarados"
  | "miscelaneas"
  | "outros-industrializados"
  | "alimentos-preparados"
  | "leguminosas-e-derivados"
  | "nozes-e-sementes";

/**
 * A medida caseira.
 *
 * Só existe quando há referência documentada para o peso. Uma "concha de
 * feijão" não tem peso universal, e inventar 120 g para ela produz um erro
 * que a pessoa não tem como perceber — ela confia porque o site disse. Sem
 * referência, a ferramenta oferece gramas e só.
 */
export interface Porcao {
  nome: string;
  gramas: number;
  /** De onde veio o peso desta medida. Sem isto, a porção não entra. */
  fonte: string;
}

/**
 * A proveniência. Nenhum alimento existe sem ela.
 *
 * A pergunta que esta estrutura precisa responder, para qualquer número da
 * tela: "qual fonte gerou esse valor, em que edição, e quando isso foi
 * conferido?". Se a resposta não existir, o alimento não publica — é o que
 * o teste de proveniência verifica.
 */
export interface Proveniencia {
  fonte: IdFonte;
  /** O identificador do alimento NA FONTE. Código TACO, fdcId do USDA. */
  idNaFonte: string;
  /** A descrição original, sem tradução nem limpeza. O que a fonte escreveu. */
  descricaoOriginal: string;
  versao: string;
  /** Data em que os valores foram conferidos contra a fonte. */
  verificadoEm: string;
}

export interface Alimento {
  id: string;
  /** Estável, minúsculo, sem acento, com o preparo quando ele muda o valor. */
  slug: string;
  /** O nome como a pessoa lê. Carrega o preparo: "Feijão carioca, cozido". */
  nome: string;
  categoria: Categoria;
  preparo: Preparo;
  /**
   * Como as pessoas realmente escrevem. Alimenta a busca, nunca a exibição.
   * "feijao carioca", "feijão", "carioquinha".
   */
  aliases: string[];
  nutrientes: ValorNutriente[];
  porcoes: Porcao[];
  proveniencia: Proveniencia;
  /**
   * Tem página própria indexável?
   *
   * Nasce false. Vira true quando houver demanda de busca real, dado bom e
   * utilidade — nunca porque o registro existe. É o que separa 500 registros
   * pesquisáveis de 500 páginas fracas no Google.
   */
  indexavel: boolean;
}

/** Um alimento com o valor já escalado para a quantidade pedida. */
export interface ValorEscalado {
  nutrienteId: string;
  /** null quando o estado não é "analisado" — traço e ausente não escalam. */
  valor: number | null;
  unidade: Unidade;
  estado: EstadoDado;
}
