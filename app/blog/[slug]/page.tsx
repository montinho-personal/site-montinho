import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, getRelatedPosts, blogPosts } from "@/lib/blog";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Artigo não encontrado" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug, post.category);

  return (
    <>
      {/* Hero */}
      <section className="pt-16 pb-12 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/blog"
              className="text-gray-500 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Blog
            </Link>
            <span className="text-gray-700">/</span>
            <span className="text-gray-500 text-sm">{post.category}</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{post.author}</span>
            <span>·</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{post.readTime} de leitura</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="text-gray-300 leading-relaxed space-y-5 blog-content"
            style={{
              fontSize: "1.0625rem",
              lineHeight: "1.75",
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author box */}
          <div className="mt-16 pt-8 border-t border-white/10 flex items-start gap-5">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              M
            </div>
            <div>
              <p className="text-white font-semibold mb-1">{post.author}</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Personal Trainer especialista em emagrecimento e transformação corporal. Atendimento presencial em Alphaville e online em todo o Brasil.
              </p>
            </div>
          </div>

          {/* CTA inline */}
          <div className="mt-12 bg-white/5 border border-white/10 p-8 text-center">
            <p
              className="text-white text-xl font-bold mb-3"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Quer aplicar isso na prática?
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Entre em contato e vamos montar um plano específico para a sua realidade.
            </p>
            <a
              href={getWhatsAppUrl(`Olá! Li o artigo "${post.title}" e quero saber mais sobre como você pode me ajudar.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Falar com Montinho
            </a>
          </div>
        </div>
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-xl font-bold text-white mb-8"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Leia também
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="border border-white/10 p-6 hover:border-white/30 transition-colors duration-200 group block"
                >
                  <span className="text-xs text-gray-500 tracking-wide uppercase">{rp.category}</span>
                  <h3
                    className="text-white font-semibold mt-2 mb-2 group-hover:text-gray-200 transition-colors"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {rp.title}
                  </h3>
                  <p className="text-gray-500 text-xs">{rp.readTime} de leitura</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
