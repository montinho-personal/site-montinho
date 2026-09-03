/**
 * Edição segura de um artigo dentro de lib/blog.ts.
 *
 * POR QUE ISTO EXISTE
 *
 * Os 837 artigos moram num arquivo só, de 5 MB, como template literals. Isso
 * torna qualquer edição por texto perigosa de um jeito específico e silencioso:
 *
 *   const k = s.indexOf("`,\n  },", inicioDoArtigo);   // ERRADO
 *
 * parece que acha o fim do artigo, mas só acha o fim de um artigo QUE NÃO TEM
 * CAMPO DEPOIS DO content. Nos que têm faq ou faqSchema depois, o índice pula
 * para o próximo artigo que casar — em 03/09/2026 isso enfiou uma seção de
 * referências dentro de hip-dips-musculacao e, numa tentativa anterior, dentro
 * do corpo da função getPostCoverImage. As duas vezes o TypeScript compilou.
 *
 * A única forma correta é procurar a CRASE QUE FECHA o template literal,
 * pulando crase escapada. É o que este arquivo faz, e é por isso que a rotina
 * diária é obrigada a passar por aqui em vez de fazer replace na mão.
 */

/** Índice da crase que abre o content do artigo (logo após "content: `"). */
export function inicioDoContent(fonte: string, slug: string): number {
  const i = fonte.indexOf(`slug: "${slug}"`);
  if (i < 0) throw new Error(`slug não encontrado em lib/blog.ts: ${slug}`);
  const j = fonte.indexOf("content: `", i);
  if (j < 0) throw new Error(`artigo sem campo content: ${slug}`);
  return j + "content: `".length;
}

/** Índice da crase que FECHA o content — pulando crase escapada. */
export function fechoDoContent(fonte: string, slug: string): number {
  let k = inicioDoContent(fonte, slug);
  for (;;) {
    k = fonte.indexOf("`", k);
    if (k < 0) throw new Error(`template literal sem fecho: ${slug}`);
    if (fonte[k - 1] !== "\\") return k;
    k += 1;
  }
}

export function conteudoDoArtigo(fonte: string, slug: string): string {
  return fonte.slice(inicioDoContent(fonte, slug), fechoDoContent(fonte, slug));
}

/**
 * Acrescenta um bloco no fim do content do artigo.
 *
 * O bloco não pode conter crase nem ${, que fechariam ou interpolariam o
 * template literal — os dois casos viram erro aqui, não bug depois.
 */
export function acrescentaNoFim(fonte: string, slug: string, bloco: string): string {
  if (bloco.includes("`")) throw new Error("bloco com crase fecharia o template literal");
  if (bloco.includes("${")) throw new Error("bloco com ${ seria interpolado pelo TypeScript");
  const k = fechoDoContent(fonte, slug);
  return fonte.slice(0, k) + bloco + fonte.slice(k);
}

/**
 * Substitui um trecho DENTRO do content de um artigo específico.
 *
 * A diferença para `fonte.replace(a, b)` é que este erra alto quando o trecho
 * não é único dentro daquele artigo, em vez de silenciosamente acertar a
 * primeira ocorrência do arquivo inteiro — que pode estar em outro artigo.
 */
export function substituiNoArtigo(fonte: string, slug: string, de: string, para: string): string {
  const ini = inicioDoContent(fonte, slug);
  const fim = fechoDoContent(fonte, slug);
  const corpo = fonte.slice(ini, fim);
  const n = corpo.split(de).length - 1;
  if (n === 0) throw new Error(`trecho não existe em ${slug}: ${de.slice(0, 60)}`);
  if (n > 1) throw new Error(`trecho aparece ${n}× em ${slug}, seria ambíguo: ${de.slice(0, 60)}`);
  return fonte.slice(0, ini) + corpo.replace(de, para) + fonte.slice(fim);
}
