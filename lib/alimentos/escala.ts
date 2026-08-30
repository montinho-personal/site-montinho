/**
 * A conta e o arredondamento.
 *
 * Duas regras separadas que costumam ser confundidas numa só:
 *
 * 1. Calcular com precisão total. 37.499999999 é o valor correto em ponto
 *    flutuante e não deve ser "corrigido" durante a conta.
 * 2. Arredondar só na hora de mostrar, e nunca além do que o dado original
 *    suporta. A TACO publica proteína com uma casa decimal; exibir 37,52 g
 *    inventa uma precisão que a análise laboratorial não tem.
 *
 * Arredondar cedo, no meio da conta, é o que produz somas que não fecham.
 */

import type { EstadoDado, Unidade, ValorEscalado, ValorNutriente } from "./tipos";

/**
 * Limites da quantidade que a pessoa digita.
 *
 * O teto de 5 kg não é uma opinião sobre quanto alguém come: é o ponto em
 * que um número deixa de ser quantidade e vira erro de digitação, e onde
 * mostrar o resultado com naturalidade seria dar credibilidade ao engano.
 */
export const GRAMAS_MIN = 1;
export const GRAMAS_MAX = 5000;
export const GRAMAS_PADRAO = 100;

/**
 * Lê a quantidade digitada.
 *
 * Aceita vírgula e ponto, porque o brasileiro digita "100,5" e o teclado do
 * celular oferece ponto. Devolve null para tudo que não vira número válido —
 * vazio, texto, negativo, zero, Infinity — e é esse null que impede NaN de
 * chegar na tela: quem chama nunca recebe um número em que não pode confiar.
 */
export function leGramas(texto: string): number | null {
  const limpo = texto.trim().replace(",", ".");
  if (limpo === "") return null;
  /* Number("") é 0 e Number(" ") é 0: o teste de vazio precisa vir antes. */
  const n = Number(limpo);
  if (!Number.isFinite(n)) return null;
  if (n < GRAMAS_MIN || n > GRAMAS_MAX) return null;
  return n;
}

/**
 * A fórmula, isolada de propósito: valor_por_100g × gramas ÷ 100.
 *
 * Traço e "não disponível" não escalam. Metade de um traço continua sendo um
 * traço, e a metade de um dado que não existe continua não existindo — devolver
 * 0 aqui seria fabricar o número que o modelo de dados foi feito para evitar.
 */
export function escalaValor(v: ValorNutriente, gramas: number): ValorEscalado {
  if (v.estado !== "analisado" || v.valorPor100g === null) {
    return { nutrienteId: v.nutrienteId, valor: null, unidade: v.unidade, estado: v.estado };
  }
  return {
    nutrienteId: v.nutrienteId,
    valor: (v.valorPor100g * gramas) / 100,
    unidade: v.unidade,
    estado: "analisado",
  };
}

export function escalaTodos(vs: ValorNutriente[], gramas: number): ValorEscalado[] {
  return vs.map((v) => escalaValor(v, gramas));
}

/** Casas decimais por unidade — a precisão que a fonte sustenta, e nada além. */
const CASAS: Record<Unidade, number> = {
  kcal: 0,
  kJ: 0,
  g: 1,
  mg: 1,
  mcg: 1,
};

/**
 * O número como ele aparece na tela, já com vírgula decimal.
 *
 * `toFixed` resolve o 37.499999999 e a notação científica de uma vez: sem
 * ele, um micronutriente pequeno o bastante sai como "1.2e-7" no meio de uma
 * tabela de comida.
 *
 * O -0 é tratado à parte porque `(-0).toFixed(1)` devolve "-0.0", e um
 * "-0,0 g" numa tabela nutricional só faz a pessoa desconfiar do site
 * inteiro.
 */
export function formataNumero(valor: number, unidade: Unidade): string {
  const casas = CASAS[unidade];
  const arredondado = Object.is(valor, -0) ? 0 : valor;
  return arredondado.toFixed(casas).replace(".", ",");
}

/** O símbolo de cada estado não-numérico, com o significado dito por extenso. */
export const SIMBOLO_TRACO = "tr";
export const SIMBOLO_INDISPONIVEL = "—";

export const EXPLICA_ESTADO: Record<EstadoDado, string> = {
  analisado: "Valor analisado e informado pela fonte.",
  traco: "Traço: presente em quantidade pequena demais para a fonte quantificar.",
  naoDisponivel: "A fonte não analisou este nutriente neste alimento.",
};

/**
 * O valor pronto para a tela: número com unidade, ou o símbolo do estado.
 *
 * É a única função que a interface deve usar para mostrar nutriente. Ela
 * existe para que nenhuma tela precise decidir sozinha o que fazer com um
 * traço — e é assim que "0" nunca aparece no lugar de "não medido".
 */
export function formataValor(v: ValorEscalado): string {
  if (v.estado === "traco") return SIMBOLO_TRACO;
  if (v.estado === "naoDisponivel" || v.valor === null) return SIMBOLO_INDISPONIVEL;
  return `${formataNumero(v.valor, v.unidade)} ${v.unidade}`;
}

/**
 * "Quanto desse alimento dá X g de proteína?"
 *
 * Equivalência matemática, não recomendação de porção — e o texto que
 * acompanha na tela precisa dizer isso, porque a conta sozinha soa como
 * prescrição.
 *
 * Devolve null quando o alimento não tem o nutriente, tem zero dele, ou o
 * resultado passa do teto: "você precisaria de 8 kg de alface" é uma conta
 * correta e uma resposta inútil.
 */
export function gramasPara(
  valorPor100g: number | null,
  estado: EstadoDado,
  alvo: number,
): number | null {
  if (estado !== "analisado" || valorPor100g === null || valorPor100g <= 0) return null;
  if (!Number.isFinite(alvo) || alvo <= 0) return null;
  const g = (alvo / valorPor100g) * 100;
  if (!Number.isFinite(g) || g > GRAMAS_MAX) return null;
  return g;
}
