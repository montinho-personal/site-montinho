import type { Metadata } from "next";
import { blogPosts, BLOG_CATEGORIES } from "@/lib/blog";
import SectionTitle from "@/components/ui/SectionTitle";
import BlogList from "@/components/blog/BlogList";

export const metadata: Metadata = {
  title: "Blog · Treinamento, Nutrição e Transformação",
  description:
    "Artigos sobre emagrecimento, hipertrofia, saúde, lesões e hábitos. Conteúdo baseado em ciência e experiência prática do Montinho Personal Trainer.",
};

export default function BlogIndex() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle
            eyebrow="Blog"
            title="Conteúdo que transforma"
            subtitle="Artigos práticos sobre treinamento, nutrição e hábitos — escritos por quem viveu e estudou de verdade."
          />
        </div>
      </section>

      <BlogList posts={blogPosts} categories={BLOG_CATEGORIES} />
    </>
  );
}
