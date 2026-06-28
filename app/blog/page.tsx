import type { Metadata } from "next";
import { blogPosts, BLOG_CATEGORIES, SITE_URL } from "@/lib/blog";
import SectionTitle from "@/components/ui/SectionTitle";
import BlogList from "@/components/blog/BlogList";
import SearchBar from "@/components/search/SearchBar";

const sortedPosts = blogPosts
  .map((post, index) => ({ post, index }))
  .sort((a, b) => {
    const dateDiff = new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    return dateDiff !== 0 ? dateDiff : b.index - a.index;
  })
  .map(({ post }) => post);

export const metadata: Metadata = {
  title: "Blog · Treinamento, Nutrição e Transformação",
  description:
    "Artigos sobre emagrecimento, hipertrofia, saúde, lesões e hábitos. Conteúdo baseado em ciência e experiência prática do Montinho Personal Trainer em Alphaville.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog — Treinamento, Nutrição e Transformação | Montinho PT",
    description:
      "Artigos sobre emagrecimento, hipertrofia, saúde, lesões e hábitos baseados em ciência e experiência prática.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

export default function BlogIndex() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle
            eyebrow="Blog"
            title="Conteúdo que transforma"
            subtitle="Artigos práticos sobre treinamento, nutrição e hábitos — escritos por quem viveu e estudou de verdade."
          />
          <div className="mt-8 max-w-xl mx-auto text-left">
            <SearchBar />
          </div>
        </div>
      </section>

      <BlogList posts={sortedPosts} categories={BLOG_CATEGORIES} />
    </>
  );
}
