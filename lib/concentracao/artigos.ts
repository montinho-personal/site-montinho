/**
 * Onde o conversor de mg/mL aparece no acervo.
 *
 * SÓ A VARIANTE DE LINK, e isso é decisão, não economia. A ferramenta tem
 * três passos e uma seringa desenhada; embutida no meio de um artigo sobre
 * treino ela roubaria a leitura. Pior: uma seringa dentro de um texto sobre
 * um medicamento específico dá a impressão de que o artigo está ensinando a
 * medir AQUELE medicamento — e a ferramenta é, de propósito, agnóstica à
 * substância. Um link no fim pega quem terminou de ler e ficou com a dúvida.
 *
 * O CRITÉRIO DA LISTA: artigos de quem JÁ ESTÁ USANDO, que é quem tem o
 * frasco na mão e a seringa na gaveta. Os comparativos (retatrutida ou
 * ozempic, retatrutida ou wegovy) ficam de fora: ali o leitor ainda está
 * escolhendo, não medindo.
 *
 * O QUE O CONVITE NÃO PODE PROMETER: ensinar a preparar o frasco. A
 * ferramenta não ensina reconstituição, não escolhe diluente e não diz
 * quanto usar. Ela explica o que cada marca da seringa vale em volume e
 * quanta substância existe nesse volume. O texto do convite diz isso com
 * todas as letras, e scripts/concentracao-test.ts reprova se ele prometer
 * mais do que a ferramenta entrega.
 */
export const ARTIGOS_COM_LINK_CONCENTRACAO: string[] = [
  "musculacao-durante-uso-de-mounjaro",
  "como-voltar-a-treinar-apos-comecar-mounjaro",
  "por-quanto-tempo-tomar-mounjaro",
  "como-evitar-perder-massa-muscular-mounjaro",
  "musculacao-durante-uso-de-retatrutida",
  "como-potencializar-resultados-retatrutida",
  "como-montar-treino-retatrutida",
  "como-evitar-perder-massa-muscular-retatrutida",
];
