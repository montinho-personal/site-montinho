/**
 * Experimento: dar a resposta no título custa ou ganha o clique?
 *   npx tsx scripts/experimento-titulos.ts
 *
 * A PERGUNTA
 *
 * "Quantas Calorias Tem 1 kg de Gordura? São 7.700 kcal" entrega o número na
 * própria SERP. Isso diferencia o resultado de dez títulos vagos — ou resolve
 * a dúvida da pessoa e dispensa o clique? As duas leituras são defensáveis, e
 * nenhuma das duas tem prova neste site.
 *
 * A HIPÓTESE
 *
 * Dar a resposta custa o clique quando a resposta É o produto; ganha o clique
 * quando a resposta é a credencial — prova de que a página tem o dado — e o
 * valor está no que vem depois. Se a hipótese valer, o grupo com ponta solta
 * rende mais.
 *
 * O DESENHO, E O QUE ELE NÃO É
 *
 * Não é teste A/B: a mesma URL não pode ter dois títulos ao mesmo tempo na
 * busca. É comparação entre grupos, no mesmo período, com os seis artigos em
 * que a faixa numérica responde a pergunta inteira. Três recebem ponta solta,
 * três ficam com a resposta fechada.
 *
 * Com seis páginas isso é sinal direcional, não significância estatística — e
 * a leitura tem que ser POR PÁGINA. O agregado não serve: um dos artigos
 * concentra 57% das impressões do grupo e sozinho decidiria a média.
 *
 * COMO LER EM OUTUBRO
 *
 * Exportar Desempenho > Páginas do Search Console e comparar o CTR de cada
 * uma das seis com a linha de base abaixo, que é a exportação de 30/08/2026.
 */

export interface LinhaDeBase {
  /** Impressões em 3 meses até 30/08/2026. */
  impressoes: number;
  cliques: number;
  posicao: number;
}

export interface ArtigoDoExperimento {
  slug: string;
  base: LinhaDeBase;
  /**
   * O título que o artigo TEM hoje. Pinado aqui de propósito: se alguém
   * mexer sem passar por este arquivo, o experimento morre em silêncio e a
   * comparação de outubro vira lixo sem ninguém saber.
   */
  titulo: string;
}

/**
 * Grupo ABERTO — resposta + ponta solta.
 *
 * O de 1 kg de gordura entrou aqui por dois motivos declarados: é o caso em
 * que a resposta fechada mais me parece custar o clique, e é o de maior
 * volume, o que dá o sinal mais rápido. Isso enviesa o agregado a favor da
 * hipótese — motivo a mais para ler por página, e não somado.
 */
export const ABERTO: ArtigoDoExperimento[] = [
  {
    slug: "quantas-calorias-tem-1kg-de-gordura",
    base: { impressoes: 1749, cliques: 1, posicao: 8.6 },
    titulo: "1 kg de Gordura São 7.700 kcal — Mas a Balança Não Obedece",
  },
  {
    slug: "quanto-tempo-de-caminhada-por-dia",
    base: { impressoes: 394, cliques: 0, posicao: 8.9 },
    titulo: "Quanto Tempo de Caminhada por Dia? 30 a 60 Min, com um Porém",
  },
  {
    slug: "quantos-kg-perder-por-mes",
    base: { impressoes: 156, cliques: 0, posicao: 9.0 },
    titulo: "Quantos kg Perder por Mês? 2 a 4 kg — e Quem Pode Mais",
  },
];

/**
 * Grupo FECHADO — a faixa responde e encerra.
 *
 * Estes NÃO são para mexer até a leitura de outubro. Sem eles não há com o
 * que comparar, e o experimento vira só mais uma troca de títulos.
 */
export const FECHADO: ArtigoDoExperimento[] = [
  {
    slug: "quanto-tempo-para-ganhar-massa-muscular",
    base: { impressoes: 306, cliques: 0, posicao: 9.8 },
    titulo: "Quanto Tempo Para Ganhar Massa Muscular? 3 a 6 Meses",
  },
  {
    slug: "quanto-de-cardio-fazer",
    base: { impressoes: 296, cliques: 0, posicao: 9.4 },
    titulo: "Quanto de Cardio Fazer? 150 a 300 Minutos por Semana",
  },
  {
    slug: "quanto-tempo-dura-um-treino",
    base: { impressoes: 151, cliques: 0, posicao: 8.4 },
    titulo: "Quanto Tempo Deve Durar um Treino? 45 a 60 Minutos",
  },
];

/** Data em que os títulos do grupo ABERTO foram ao ar. */
export const INICIO = "2026-09-02";

/** Antes disso não adianta olhar: o Google leva semanas para refletir título novo. */
export const LEITURA_A_PARTIR_DE = "2026-10-01";

if (process.argv[1]?.endsWith("experimento-titulos.ts")) {
  const linha = (a: ArtigoDoExperimento) =>
    `   ${a.slug.padEnd(40)} ${String(a.base.impressoes).padStart(5)} imp  ${String(a.base.cliques).padStart(2)} cl  pos ${a.base.posicao.toFixed(1)}\n      ${a.titulo}`;
  const soma = (g: ArtigoDoExperimento[]) => g.reduce((n, a) => n + a.base.impressoes, 0);

  console.log("EXPERIMENTO DE TÍTULO — resposta fechada x ponta solta");
  console.log(`no ar desde ${INICIO} · ler a partir de ${LEITURA_A_PARTIR_DE}\n`);
  console.log(`GRUPO ABERTO (resposta + ponta solta) — ${soma(ABERTO)} impressões de base`);
  ABERTO.forEach((a) => console.log(linha(a)));
  console.log(`\nGRUPO FECHADO (a faixa responde e encerra) — ${soma(FECHADO)} impressões de base`);
  FECHADO.forEach((a) => console.log(linha(a)));
  console.log(
    "\nLeitura: comparar o CTR de cada página com a sua própria base, e depois\n" +
      "comparar a variação média dos dois grupos. Nunca somar impressões entre\n" +
      "páginas: uma delas concentra 57% do total e engoliria as outras cinco.",
  );
}
