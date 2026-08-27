/**
 * Onde cortar o HTML do artigo para encaixar o CTA do meio.
 *
 * Não usamos "50% do scroll". Cortamos numa transição editorial real: sempre
 * imediatamente ANTES de um <h2>, que é onde um assunto termina e outro
 * começa. Assim o CTA nunca cai entre um heading e a explicação dele, nem
 * no meio de um raciocínio.
 */

/** H2 que nunca devem receber CTA logo antes. */
const H2_PROIBIDOS = /refer[êe]ncias|perguntas\s+frequentes|faq|conclus[ãa]o|resumo|leia\s+tamb[ée]m/i;

/** Blocos visuais que não podem ser separados do que vem antes deles. */
const BLOCO_VISUAL = /<figure|<iframe|yt-embed|yt-caption|<table|<img/i;

export interface SplitResult {
  before: string;
  after: string;
}

/**
 * Divide o HTML renderizado em duas partes, com o ponto de corte no <h2>
 * mais próximo do meio que seja seguro.
 *
 * Retorna null quando não existe ponto seguro — nesse caso o artigo fica
 * só com o CTA final, o que é melhor do que um encaixe ruim.
 */
export function splitAtNaturalBreak(html: string): SplitResult | null {
  const idx: number[] = [];
  const re = /<h2[\s>]/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) idx.push(m.index);

  // Precisa de pelo menos 3 seções para haver um "meio" de verdade.
  if (idx.length < 3) return null;

  // Nunca antes do primeiro h2 (quebraria a introdução) nem antes do último
  // (ficaria colado no CTA final).
  const candidatos = idx.slice(1, -1).filter((pos) => {
    // O texto do próprio h2 não pode ser de uma seção de fechamento.
    const heading = html.slice(pos, pos + 220);
    if (H2_PROIBIDOS.test(heading)) return false;

    // Os 500 caracteres anteriores não podem conter vídeo, tabela, imagem ou
    // infográfico: o CTA ficaria entre o elemento e sua legenda.
    if (BLOCO_VISUAL.test(html.slice(Math.max(0, pos - 500), pos))) return false;

    return true;
  });

  if (candidatos.length === 0) return null;

  const alvo = html.length * 0.55;
  const corte = candidatos.reduce((best, pos) =>
    Math.abs(pos - alvo) < Math.abs(best - alvo) ? pos : best
  );

  // Corte perto demais das pontas não vale a pena.
  if (corte < html.length * 0.25 || corte > html.length * 0.8) return null;

  return { before: html.slice(0, corte), after: html.slice(corte) };
}

/**
 * Corta o artigo logo depois da primeira seção — antes do segundo <h2>.
 *
 * Existe para a calculadora de proteína: o pedido é que ela apareça cedo,
 * depois da resposta direta e antes da explicação longa, sem obrigar o
 * leitor a atravessar duas mil palavras até a ferramenta. Não reaproveita o
 * splitAtNaturalBreak porque a intenção é oposta: lá o corte busca o meio
 * editorial; aqui, o começo.
 */
export function splitAtPrimeiraSecao(html: string): SplitResult | null {
  const idx: number[] = [];
  const re = /<h2[\s>]/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) idx.push(m.index);
  if (idx.length < 2) return null;
  return { before: html.slice(0, idx[1]), after: html.slice(idx[1]) };
}
