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
 * ENCERRADO EM 21/09/2026, ANTES DA LEITURA DE OUTUBRO
 *
 * O experimento comparava duas variações DENTRO de um formato que estava
 * perdendo feio para um terceiro. Nos mesmos 19 dias, com posição
 * equivalente, o acervo mostrou isto:
 *
 *   treino-upper-lower-superior-inferior   1.536 imp   22 cl   1,43%   pos 8,7
 *   smart-fit-vs-bluefit                   1.123 imp   12 cl   1,07%   pos 8,0
 *   hipertrofia-natural-limite               579 imp    6 cl   1,04%   pos 8,0
 *
 *   polichinelo-emagrece                   2.919 imp    3 cl   0,10%   pos 7,8
 *   crossover-vs-crucifixo                 2.066 imp    6 cl   0,29%   pos 8,3
 *   cardio-ou-musculacao-mounjaro            607 imp    0 cl   0,00%   pos 7,9
 *
 * O que separa os dois blocos não é ponta solta contra resposta fechada. É
 * título que diz o que a pessoa vai encontrar contra título que promete uma
 * revelação. Dez a quinze vezes de diferença, na mesma posição.
 *
 * A LEITURA PARCIAL, PELO QUE VALE
 *
 * 19 dias no ar (02/09 a 20/09), CTR do período:
 *
 *   ABERTO    1 kg de gordura        801 imp   2 cl   0,25%
 *             caminhada por dia      253 imp   0 cl   0,00%
 *             kg por mês              41 imp   0 cl   0,00%
 *             ------------------------------------------- 1.095 imp   0,18%
 *
 *   FECHADO   quanto de cardio        73 imp   1 cl   1,37%
 *             quanto dura um treino   95 imp   0 cl   0,00%
 *             tempo para ganhar massa  —  (abaixo do corte da exportação)
 *             ------------------------------------------- 168 imp   0,60%
 *
 * Direcional CONTRA a hipótese, e fraco: 168 impressões no grupo de
 * controle não decidem nada sozinhas. O que decide é o bloco de cima.
 *
 * O QUE FOI FEITO
 *
 * Os três títulos do grupo ABERTO foram reescritos no estilo descritivo em
 * 21/09/2026 — que é, por coincidência útil, o estilo em que o grupo FECHADO
 * já estava. Os três do FECHADO ficaram como estavam. As linhas de base
 * continuam aqui: se alguém quiser refazer a pergunta um dia, o ponto de
 * partida está registrado.
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
 * Os títulos abaixo são os que FICARAM no lugar dos de ponta solta, em
 * 21/09/2026. Os originais, para registro, eram:
 *
 *   1 kg de Gordura São 7.700 kcal — Mas a Balança Não Obedece
 *   Quanto Tempo de Caminhada por Dia? 30 a 60 Min, com um Porém
 *   Quantos kg Perder por Mês? 2 a 4 kg — e Quem Pode Mais
 */
export const ABERTO: ArtigoDoExperimento[] = [
  {
    slug: "quantas-calorias-tem-1kg-de-gordura",
    base: { impressoes: 1749, cliques: 1, posicao: 8.6 },
    titulo: "Quantas Calorias Tem 1 kg de Gordura? São 7.700 kcal",
  },
  {
    slug: "quanto-tempo-de-caminhada-por-dia",
    base: { impressoes: 394, cliques: 0, posicao: 8.9 },
    titulo: "Quanto Tempo de Caminhada por Dia? 30 a 60 Minutos",
  },
  {
    slug: "quantos-kg-perder-por-mes",
    base: { impressoes: 156, cliques: 0, posicao: 9.0 },
    titulo: "Quantos kg Perder por Mês? O Seguro é 2 a 4 kg",
  },
];

/**
 * Grupo FECHADO — a faixa responde e encerra.
 *
 * Estes já estavam no formato que o acervo mostra vencendo: pergunta +
 * resposta específica. Por isso continuaram intactos no encerramento.
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

/**
 * Data em que o experimento foi encerrado, antes da leitura prevista. O
 * motivo está no cabeçalho. Enquanto isto estiver preenchido, os títulos
 * aqui são histórico: continuam pinados para que ninguém os mexa por
 * engano, mas não há mais dois braços a comparar.
 */
export const ENCERRADO_EM = "2026-09-21";

/** Antes disso não adianta olhar: o Google leva semanas para refletir título novo. */
export const LEITURA_A_PARTIR_DE = "2026-10-01";

if (process.argv[1]?.endsWith("experimento-titulos.ts")) {
  const linha = (a: ArtigoDoExperimento) =>
    `   ${a.slug.padEnd(40)} ${String(a.base.impressoes).padStart(5)} imp  ${String(a.base.cliques).padStart(2)} cl  pos ${a.base.posicao.toFixed(1)}\n      ${a.titulo}`;
  const soma = (g: ArtigoDoExperimento[]) => g.reduce((n, a) => n + a.base.impressoes, 0);

  console.log("EXPERIMENTO DE TÍTULO — resposta fechada x ponta solta");
  console.log(`no ar de ${INICIO} a ${ENCERRADO_EM} · ENCERRADO antes da leitura de ${LEITURA_A_PARTIR_DE}`);
  console.log("motivo no cabeçalho deste arquivo: os dois braços perdiam para um terceiro formato\n");
  console.log(`GRUPO ABERTO (resposta + ponta solta) — ${soma(ABERTO)} impressões de base`);
  ABERTO.forEach((a) => console.log(linha(a)));
  console.log(`\nGRUPO FECHADO (a faixa responde e encerra) — ${soma(FECHADO)} impressões de base`);
  FECHADO.forEach((a) => console.log(linha(a)));
  console.log(
    "\nOs títulos acima são os que estão NO AR hoje. No grupo ABERTO eles já são\n" +
      "os substitutos descritivos de 21/09; os originais de ponta solta estão\n" +
      "registrados no comentário do grupo. As bases continuam aqui para quem\n" +
      "quiser refazer a pergunta com mais volume.",
  );
}
