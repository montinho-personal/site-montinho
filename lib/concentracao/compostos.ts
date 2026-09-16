/**
 * Os nomes que as pessoas usam — e só isso.
 *
 * Esta lista NÃO carrega mg, mL, concentração típica, faixa de uso nem
 * qualquer número: se carregasse, escolher um nome preencheria campos por
 * alguém, e preencher campo por alguém em injetável é o começo do erro que a
 * FDA documentou. O seletor existe por uma razão de linguagem, não de
 * matemática: quem chega buscando "calculadora de tirzepatida" precisa ver
 * a própria palavra na tela para saber que está no lugar certo, e a conta
 * que roda é exatamente a mesma para todos os itens desta lista.
 *
 * Por isso o rótulo do resultado é a única coisa que muda. A aritmética é
 * cega ao nome, e continua cega.
 */

export type Composto = { id: string; nome: string };

export const COMPOSTOS: readonly Composto[] = [
  { id: "tirzepatida", nome: "Tirzepatida" },
  { id: "semaglutida", nome: "Semaglutida" },
  { id: "retatrutida", nome: "Retatrutida" },
  { id: "liraglutida", nome: "Liraglutida" },
  { id: "bpc-157", nome: "BPC-157" },
  { id: "tb-500", nome: "TB-500" },
  { id: "ghk-cu", nome: "GHK-Cu" },
  { id: "cjc-1295", nome: "CJC-1295" },
  { id: "ipamorelina", nome: "Ipamorelina" },
  { id: "tesamorelina", nome: "Tesamorelina" },
  { id: "aod-9604", nome: "AOD-9604" },
  /*
   * Insulina está nesta lista para ser BARRADA, não calculada. Antes disso
   * havia uma pergunta separada ("o líquido é insulina?") antes de qualquer
   * campo — um passo a mais para todo mundo por causa de um caso. Aqui a
   * pessoa escolhe o que tem no frasco, e escolher insulina leva ao aviso em
   * vez do resultado. O componente trata este id como saída, não como nome.
   */
  { id: "insulina", nome: "Insulina" },
  { id: "outro", nome: "Outro" },
  { id: "nao-informar", nome: "Prefiro não informar" },
] as const;

/** O nome para usar no texto do resultado, ou null quando não há o que nomear. */
export function nomeDoComposto(id: string | null): string | null {
  if (!id || id === "outro" || id === "nao-informar") return null;
  return COMPOSTOS.find((c) => c.id === id)?.nome ?? null;
}
