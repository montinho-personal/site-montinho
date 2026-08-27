/**
 * Os bordões do Montinho, num lugar só.
 *
 * Por que isto existe como módulo, e não como texto solto espalhado nas
 * páginas: "é impossível dar errado" é uma afirmação sobre RESULTADO. Escrita
 * sozinha, ela vira a única promessa de um site que passou 813 artigos se
 * recusando a prometer — e a primeira promessa custa toda a credibilidade
 * que as outras 812 construíram.
 *
 * A frase só é verdadeira com a condição colada nela. Não é "você vai
 * conseguir": é "quando existe estratégia adequada à sua realidade e ela é
 * executada por tempo suficiente, o resultado deixa de depender de sorte".
 *
 * Daí a regra que o teste (`scripts/bordoes-test.ts`) obriga em todo o
 * repositório: onde a frase aparecer, a condição aparece junto. Não existe
 * versão nua.
 */

/** Marcadores que caracterizam a condição acompanhando a frase. */
export const MARCADORES_DE_CONDICAO = [
  "quando",
  "fazendo",
  "desde que",
  "dentro de",
  "se você",
  "por tempo suficiente",
] as const;

export const BORDOES = {
  /** Definição curta, para quando alguém pergunta o que é. */
  chalala: "o algo a mais que faz diferença",

  /**
   * A distinção que impede o chalalá de virar "fórmula secreta" — e de
   * contradizer a tese central do site, que é a de que segredo não existe.
   */
  chalalaNaoEhSegredo:
    "Segredo é o que alguém esconde; chalalá é o que você acrescenta de propósito, em cima do que já funciona.",

  /**
   * A frase completa, com a condição embutida. Esta é a forma canônica —
   * qualquer uso mais curto tem de trazer a condição por perto.
   */
  impossivelCompleta:
    "É impossível dar errado quando você faz, por tempo suficiente, aquilo que precisa ser feito — dentro de uma estratégia que realmente cabe na sua vida.",

  /**
   * O que a frase NÃO diz. Aparece junto da definição, porque a leitura
   * errada é previsível e cara: alguém entende "garanto X quilos".
   */
  impossivelNaoEh:
    "Não significa que eu garanto um número na balança ou uma data. Significa que não vamos depender de sorte: a gente monta a estratégia, executa, mede, ajusta e continua.",

  /** As duas frases juntas. Uma fala do extra, a outra da confiança. */
  duplaCompleta:
    "Seu shape merece um chalalá. E fazendo o que precisa ser feito, é impossível dar errado.",
} as const;

/**
 * Um texto que menciona a frase carrega a condição?
 *
 * Usado pelo teste que varre o repositório. Fica aqui, e não no script, para
 * que a regra viva junto do conteúdo que ela protege.
 */
export function temCondicao(texto: string): boolean {
  const t = texto.toLowerCase();
  return MARCADORES_DE_CONDICAO.some((m) => t.includes(m));
}

/** A frase, em qualquer grafia, com ou sem acento. */
export const REGEX_IMPOSSIVEL = /imposs[ií]vel dar errado/i;
