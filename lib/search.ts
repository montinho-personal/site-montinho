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
  excerptLower: string;
  categoryLower: string;
  tagsLower: string[];
  faqText: string;
  contentText: string;
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
  titleLower: (post.title ?? "").toLowerCase(),
  excerptLower: (post.excerpt ?? "").toLowerCase(),
  categoryLower: (post.category ?? "").toLowerCase(),
  tagsLower: (post.tags ?? []).map((t) => (t ?? "").toLowerCase()),
  faqText: (post.faq ?? [])
    .map((f) => `${f.question ?? ""} ${f.answer ?? ""}`)
    .join(" ")
    .toLowerCase(),
  contentText: stripHtml(post.content ?? "").toLowerCase(),
}));

function scoreEntry(entry: IndexEntry, query: string, terms: string[]): number {
  const queryLower = query.toLowerCase();
  let score = 0;

  if (entry.titleLower === queryLower) score += 200;
  else if (entry.titleLower.startsWith(queryLower)) score += 120;
  else if (entry.titleLower.includes(queryLower)) score += 90;
  terms.forEach((t) => { if (entry.titleLower.includes(t)) score += 30; });

  if (entry.categoryLower.includes(queryLower)) score += 50;
  terms.forEach((t) => { if (entry.categoryLower.includes(t)) score += 20; });

  entry.tagsLower.forEach((tag) => {
    if (tag.includes(queryLower)) score += 45;
    terms.forEach((t) => { if (tag.includes(t)) score += 15; });
  });

  if (entry.excerptLower.includes(queryLower)) score += 40;
  terms.forEach((t) => {
    const c = (entry.excerptLower.match(new RegExp(t, "g")) ?? []).length;
    score += Math.min(c * 10, 30);
  });

  terms.forEach((t) => {
    const c = (entry.contentText.match(new RegExp(t, "g")) ?? []).length;
    score += Math.min(c * 2, 20);
  });

  terms.forEach((t) => {
    if (entry.faqText.includes(t)) score += 12;
  });

  return score;
}

export function search(query: string, limit = 20): SearchResult[] {
  const q = query.trim();
  if (q.length < 2) return [];

  const terms = q
    .toLowerCase()
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
