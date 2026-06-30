import { blogPosts } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";

export interface SearchResult {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  score: number;
}

// Pre-compute lightweight index at module load (title + excerpt + tags only)
// Content strip is too expensive to run per-request across 450+ large articles
interface IndexEntry {
  post: BlogPost;
  titleLower: string;
  excerptLower: string;
  categoryLower: string;
  tagsLower: string[];
  faqText: string;
}

const index: IndexEntry[] = blogPosts.map((post) => ({
  post,
  titleLower: (post.title ?? "").toLowerCase(),
  excerptLower: (post.excerpt ?? "").toLowerCase(),
  categoryLower: (post.category ?? "").toLowerCase(),
  tagsLower: (post.tags ?? []).map((t) => (t ?? "").toLowerCase()),
  faqText: (post.faq ?? [])
    .map((f) => `${f.question ?? ""} ${f.answer ?? ""}`)
    .join(" ")
    .toLowerCase(),
}));

function scoreEntry(entry: IndexEntry, query: string, terms: string[]): number {
  const { titleLower, excerptLower, categoryLower, tagsLower, faqText } = entry;
  const queryLower = query.toLowerCase();
  let score = 0;

  // Title — highest weight
  if (titleLower === queryLower) score += 200;
  else if (titleLower.startsWith(queryLower)) score += 120;
  else if (titleLower.includes(queryLower)) score += 90;
  terms.forEach((t) => { if (titleLower.includes(t)) score += 30; });

  // Category
  if (categoryLower.includes(queryLower)) score += 50;
  terms.forEach((t) => { if (categoryLower.includes(t)) score += 20; });

  // Tags
  tagsLower.forEach((tag) => {
    if (tag.includes(queryLower)) score += 45;
    terms.forEach((t) => { if (tag.includes(t)) score += 15; });
  });

  // Excerpt
  if (excerptLower.includes(queryLower)) score += 40;
  terms.forEach((t) => {
    const c = (excerptLower.match(new RegExp(t, "g")) ?? []).length;
    score += Math.min(c * 10, 30);
  });

  // FAQ
  terms.forEach((t) => {
    if (faqText.includes(t)) score += 10;
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
        slug: entry.post.slug,
        title: entry.post.title,
        excerpt: entry.post.excerpt,
        category: entry.post.category,
        date: entry.post.date,
        readTime: entry.post.readTime,
        score,
      });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
