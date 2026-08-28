/**
 * Âncora de rolagem das ferramentas de várias etapas.
 *
 * O problema que isto resolve: um wizard muda de altura a cada etapa. A
 * tela de resultado é longa; a primeira pergunta é curta. Quando a pessoa
 * rola até o fim do resultado e clica em "recomeçar", o card encolhe, a
 * página inteira encolhe junto — e a rolagem dela, que não se moveu, passa
 * a apontar para o texto editorial DEPOIS da ferramenta. A pessoa clica em
 * um botão da ferramenta e é cuspida em outro lugar da página.
 *
 * A regra é conservadora de propósito: só rolamos quando o topo do card já
 * saiu por cima da janela. Se a ferramenta inteira está visível, mexer na
 * rolagem seria roubar o controle de quem está lendo — e um wizard que
 * pula sozinho a cada clique é tão ruim quanto um que não pula nunca.
 *
 * O header do site é fixo, então o alvo não é o topo absoluto do card: quem
 * usa este helper precisa reservar a folga com `scroll-mt-*` no elemento,
 * senão o título fica escondido atrás do menu.
 */
export function ancoraNoTopo(el: HTMLElement | null): void {
  if (!el || typeof window === "undefined") return;
  const topo = el.getBoundingClientRect().top;
  /**
   * Margem de 8px: um card que começa 2px acima da janela não justifica
   * mover a página debaixo de quem está lendo.
   */
  if (topo >= -8) return;
  try {
    el.scrollIntoView({ block: "start", behavior: "smooth" });
  } catch {
    /* navegador sem scrollIntoView com options: o salto seco resolve. */
    el.scrollIntoView();
  }
}
