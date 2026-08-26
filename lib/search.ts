import { blogPosts } from "@/lib/blog";

export interface SearchResult {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  score: number;
}

interface IndexEntry {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  titleLower: string;
  slugLower: string;
  excerptLower: string;
  categoryLower: string;
  tagsLower: string[];
  faqText: string;
  contentText: string;
}

/**
 * Minúsculas e sem acento, dos DOIS lados — índice e consulta.
 *
 * Antes, o índice guardava "você" com acento e a consulta chegava
 * normalizada como "voce": palavra acentuada nenhuma casava. Além de furar
 * a busca, isso dava a palavras comuns uma raridade altíssima e falsa
 * ("voce" parecia mais raro que "celular"), o que desequilibrava o
 * Pergunte ao Montinho. Também faz quem digita sem acento achar o artigo.
 */
export function fold(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const index: IndexEntry[] = blogPosts.map((post) => ({
  slug: post.slug,
  title: post.title ?? "",
  excerpt: post.excerpt ?? "",
  category: post.category ?? "",
  date: post.date,
  readTime: post.readTime ?? "",
  titleLower: fold(post.title ?? ""),
  slugLower: fold(post.slug.replace(/-/g, " ")),
  excerptLower: fold(post.excerpt ?? ""),
  categoryLower: fold(post.category ?? ""),
  tagsLower: (post.tags ?? []).map((t) => fold(t ?? "")),
  faqText: fold(
    (post.faq ?? []).map((f) => `${f.question ?? ""} ${f.answer ?? ""}`).join(" ")
  ),
  contentText: fold(stripHtml(post.content ?? "")),
}));

/**
 * Peso do termo pela raridade (IDF).
 *
 * Sem isso, todo termo vale o mesmo: "melhor" — que aparece em centenas de
 * artigos — pesava igual a "divisao". Numa pergunta de três palavras onde duas
 * são genéricas, as genéricas decidiam o ranking e o assunto real sumia.
 *
 * Contado sob demanda e cacheado: cada termo varre o índice uma única vez.
 */
const dfCache = new Map<string, number>();

function idf(term: string): number {
  let df = dfCache.get(term);
  if (df === undefined) {
    df = 0;
    for (const e of index) {
      if (
        e.titleLower.includes(term) || e.slugLower.includes(term) ||
        e.excerptLower.includes(term) || e.categoryLower.includes(term) ||
        e.contentText.includes(term) || e.tagsLower.some((t) => t.includes(term))
      ) df++;
    }
    dfCache.set(term, df);
  }
  // Piso de 0.25 para que um termo comuníssimo ainda conte alguma coisa.
  return Math.max(0.25, Math.log((index.length + 1) / (df + 1)));
}

function scoreEntry(entry: IndexEntry, query: string, terms: string[]): number {
  const queryLower = fold(query);
  let score = 0;

  if (entry.titleLower === queryLower) score += 200;
  else if (entry.titleLower.startsWith(queryLower)) score += 120;
  else if (entry.titleLower.includes(queryLower)) score += 90;
  terms.forEach((t) => { if (entry.titleLower.includes(t)) score += 30 * idf(t); });

  // Slug com hifens convertidos em espaços — cobre variações de palavra
  // que existem na URL mas não no título (ex.: "obesos" vs "obeso")
  if (entry.slugLower.includes(queryLower)) score += 70;
  terms.forEach((t) => { if (entry.slugLower.includes(t)) score += 25 * idf(t); });

  if (entry.categoryLower.includes(queryLower)) score += 50;
  terms.forEach((t) => { if (entry.categoryLower.includes(t)) score += 20 * idf(t); });

  entry.tagsLower.forEach((tag) => {
    if (tag.includes(queryLower)) score += 45;
    terms.forEach((t) => { if (tag.includes(t)) score += 15 * idf(t); });
  });

  if (entry.excerptLower.includes(queryLower)) score += 40;
  terms.forEach((t) => {
    const c = (entry.excerptLower.match(new RegExp(t, "g")) ?? []).length;
    score += Math.min(c * 10, 30) * idf(t);
  });

  terms.forEach((t) => {
    const c = (entry.contentText.match(new RegExp(t, "g")) ?? []).length;
    score += Math.min(c * 2, 20) * idf(t);
  });

  terms.forEach((t) => {
    if (entry.faqText.includes(t)) score += 12 * idf(t);
  });

  return score;
}

/**
 * Raridade do termo no acervo. Quanto maior, mais distintivo — usado pelo
 * Pergunte ao Montinho para saber qual palavra a pergunta realmente trata.
 */
export function termRarity(term: string): number {
  return idf(fold(term));
}

export function search(query: string, limit = 20): SearchResult[] {
  const q = query.trim();
  if (q.length < 2) return [];

  const terms = fold(q)
    .split(/\s+/)
    .filter((t) => t.length >= 2);

  const results: SearchResult[] = [];

  for (const entry of index) {
    const score = scoreEntry(entry, q, terms);
    if (score > 0) {
      results.push({
        slug: entry.slug,
        title: entry.title,
        excerpt: entry.excerpt,
        category: entry.category,
        date: entry.date,
        readTime: entry.readTime,
        score,
      });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
