/**
 * O modelo da base nutricional.
 *
 * A decisão estrutural mais importante deste arquivo é o `ValorNutriente`
 * não ser um número.
 *
 * Um número não consegue distinguir três coisas que a fonte distingue:
 *
 *   0   — analisado, e deu zero. O óleo tem zero proteína, de verdade.
 *   tr  — traço. Presente, abaixo do limite de quantificação do método.
 *   —   — não analisado. A fonte não mediu isso nesse alimento.
 *
 * Guardar os três como `0` faz a tela dizer "0 mg de ferro" para um alimento
 * que provavelmente tem ferro e simplesmente não foi medido. É mentira com
 * cara de dado, e é o erro mais comum em tabela nutricional na internet.
 * Por isso o valor carrega o estado, e a camada de exibição é obrigada a
 * decidir o que fazer com cada um.
 */

import type { IdFonte } from "./fontes";

/** Unidade canônica do nutriente. Conversão só acontece na exibição. */
export type Unidade = "kcal" | "kJ" | "g" | "mg" | "mcg";

export type EstadoDado =
  /** Analisado e quantificado. `valor` é o número da fonte. */
  | "analisado"
  /** Traço: presente, abaixo do limite de quantificação. `valor` é null. */
  | "traco"
  /** Não analisado / não informado pela fonte. `valor` é null. */
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

export type Categoria =
  | "carnes"
  | "aves"
  | "peixes"
  | "ovos"
  | "leites-e-derivados"
  | "cereais"
  | "arroz-e-massas"
  | "leguminosas"
  | "frutas"
  | "verduras-e-legumes"
  | "tuberculos"
  | "oleaginosas"
  | "oleos-e-gorduras"
  | "bebidas"
  | "outros";

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
