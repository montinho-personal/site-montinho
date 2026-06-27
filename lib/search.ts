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

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scorePost(post: BlogPost, query: string, terms: string[]): number {
  const titleLower = post.title.toLowerCase();
  const excerptLower = post.excerpt.toLowerCase();
  const categoryLower = post.category.toLowerCase();
  const tagsLower = (post.tags ?? []).map((t) => t.toLowerCase());
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

  // Content (stripped HTML — only computed if query has signal)
  if (score > 0 || terms.length > 0) {
    const contentText = stripHtml(post.content).toLowerCase();
    terms.forEach((t) => {
      const c = (contentText.match(new RegExp(t, "g")) ?? []).length;
      score += Math.min(c * 2, 20);
    });
  }

  // FAQ
  if (post.faq) {
    post.faq.forEach(({ question, answer }) => {
      const qLow = question.toLowerCase();
      const aLow = answer.toLowerCase();
      terms.forEach((t) => {
        if (qLow.includes(t)) score += 15;
        if (aLow.includes(t)) score += 8;
      });
    });
  }

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

  for (const post of blogPosts) {
    const score = scorePost(post, q, terms);
    if (score > 0) {
      results.push({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        date: post.date,
        readTime: post.readTime,
        score,
      });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
