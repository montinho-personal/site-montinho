import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import PreferredSourceCTA from "@/components/google/PreferredSourceCTA";
import { getBlogPost, getRelatedPosts, getPostCoverImage, blogPosts, SITE_URL } from "@/lib/blog";
import YoutubeShortEmbed from "@/components/ui/YoutubeShortEmbed";
import ArticleReadTracker from "@/components/analytics/ArticleReadTracker";
import ArticleLightbox from "@/components/blog/ArticleLightbox";
import AskEmbed from "@/components/ask/AskEmbed";
import ContextualCTA from "@/components/cta/ContextualCTA";
import { planCTAs } from "@/lib/cta/classify";
import { splitAtNaturalBreak } from "@/lib/cta/placement";
import NotaMetodo from "@/components/filosofia/NotaMetodo";
import { clusterRecebeNota } from "@/lib/filosofia";

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
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;
  const cover = getPostCoverImage(post);
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/blog/${slug}`,
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      authors: [post.author],
      images: [{ url: cover.url, width: cover.width, height: cover.height, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [cover.url],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug, post.category);
  const contentHtml = marked(post.content) as string;
  const cover = getPostCoverImage(post);

  // Plano de CTA: classificação determinística no build, nunca em runtime.
  //
  // FASE 1 (atual): só o CTA do meio é renderizado. O bloco final continua
  // sendo o antigo, igual em todos os artigos, para não alterar de uma vez os
  // 813 links de WhatsApp e de /consultoria que hoje saem dos artigos — e para
  // que exista base de comparação antes de mexer neles.
  //
  // FASE 2: trocar o bloco final por <ContextualCTA cta={cta.end}
  // position="end_article" ...> e remover o bloco fixo abaixo. O plano de
  // cta.end já está calculado e testado; só não está em uso.
  const cta = planCTAs(post, { renderEnd: false });
  // Só divide o HTML se houver um CTA de meio E um ponto de corte editorial
  // seguro. Sem os dois, o artigo fica inteiro e leva só o CTA final.
  const split = cta.mid ? splitAtNaturalBreak(contentHtml) : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    image: [cover.url],
    author: {
      "@type": "Person",
      name: "Montinho",
      url: `${SITE_URL}/minha-historia`,
      jobTitle: "Personal Trainer",
      sameAs: ["https://www.instagram.com/montinhopersonal/"],
    },
    publisher: {
      "@type": "Organization",
      name: "Montinho Personal Trainer",
      url: SITE_URL,
    },
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    url: `${SITE_URL}/blog/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`,
    },
  };

  const faqSchema = post.faq && post.faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${slug}` },
    ],
  };

  return (
    <>
      <ArticleReadTracker articleTitle={post.title} slug={post.slug} category={post.category} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Breadcrumb + Hero */}
      <section className="pt-16 pb-12 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/blog"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Blog
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-400 text-sm">{post.category}</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{post.author}</span>
            <span>·</span>
            <time dateTime={post.date}>
              {new Date(post.date + "T12:00:00").toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{post.readTime} de leitura</span>
            {post.updatedAt && post.updatedAt !== post.date && (
              <>
                <span>·</span>
                <time dateTime={post.updatedAt} className="text-[#BA9E50]">
                  Atualizado em{" "}
                  {new Date(post.updatedAt + "T12:00:00").toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {split && cta.mid ? (
            <>
              <div className="prose-blog" dangerouslySetInnerHTML={{ __html: split.before }} />
              <ContextualCTA
                cta={cta.mid}
                position="mid_article"
                articleSlug={post.slug}
                articleCategory={post.category}
                cluster={cta.cluster}
                stage={cta.stage}
              />
              <div className="prose-blog" dangerouslySetInnerHTML={{ __html: split.after }} />
            </>
          ) : (
            <div className="prose-blog" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          )}
          <ArticleLightbox />

          {/* Video */}
          {post.slug === "como-prevenir-lesoes-no-treino" && (
            <div className="mt-16 pt-10 border-t border-white/10">
              <h2
                className="text-2xl font-bold text-white mb-6"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                5 Dicas para acabar com dores no lombar
              </h2>
              <p className="text-gray-300 leading-relaxed mb-8">
                Além de acompanhar meus alunos presencialmente e online, também compartilho dicas práticas de treino, emagrecimento e hipertrofia. Assista ao vídeo abaixo para conhecer um pouco mais do meu trabalho.
              </p>
              <YoutubeShortEmbed videoId="MrfzaQWFqPs" title="5 Dicas para acabar com dores no lombar — Montinho Personal Trainer" />
            </div>
          )}

          {/* Nota de método: fecha o conteúdo com a filosofia antes de qualquer
              próxima ação. Só em artigos que de fato dão orientação — o
              cluster vem do mesmo classificador que escolhe o CTA. */}
          {clusterRecebeNota(cta.cluster) && <NotaMetodo chave={post.slug} cluster={cta.cluster} />}

          {/* Dedupe: o embed do Pergunte só aparece quando o CTA do meio já
              não leva para lá — senão seriam duas caixas pedindo a mesma ação
              no mesmo artigo. */}
          {cta.mid?.primary.destination !== "ask" && (
            <div className="mt-14">
              <AskEmbed context={{ slug: post.slug, title: post.title, category: post.category }} />
            </div>
          )}

          {/* Author box */}
          <div className="mt-16 pt-8 border-t border-white/10 flex items-start gap-5">
            <div
              className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              aria-hidden="true"
            >
              M
            </div>
            <div>
              <p className="text-white font-semibold mb-1">{post.author}</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Personal Trainer especialista em emagrecimento e transformação corporal. Atendimento presencial em Alphaville (Barueri e Santana de Parnaíba) e online em todo o Brasil.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 pt-10 border-t border-white/10">
            <div className="bg-white/[0.03] border border-white/10 px-8 py-7">
              <h2
                className="text-lg font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Quer transformar seu corpo?
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Se você chegou até aqui, provavelmente está buscando uma forma segura e eficiente de emagrecer ou transformar seu corpo.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Se deseja um acompanhamento individualizado com um{" "}
                <strong className="text-white font-semibold">Personal Trainer em Alphaville</strong>{" "}
                ou uma{" "}
                <strong className="text-white font-semibold">Consultoria Online</strong>,
                estou pronto para ajudar você a conquistar resultados reais, respeitando sua rotina e seus objetivos.
              </p>
              <p className="text-gray-300 text-xs leading-relaxed mb-3">
                Não sabe qual estratégia faz mais sentido para a sua rotina?{" "}
                <Link href="/diagnostico" className="underline underline-offset-2 decoration-1 hover:text-white transition-colors">
                  Faça o Diagnóstico Montinho
                </Link>{" "}
                — gratuito, leva 1–2 minutos.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Para saber mais,{" "}
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold italic underline underline-offset-2 decoration-1 transition-opacity duration-200 hover:opacity-70"
                  style={{ color: "#BA9E50" }}
                >
                  clique aqui
                </a>
                .
              </p>
            </div>
          </div>

          {/* Fontes preferidas do Google.
              Vem DEPOIS do CTA comercial de propósito. Retenção e conversão
              têm objetivos diferentes, e quando disputam o mesmo espaço quem
              perde é a conversão. A hierarquia aqui é visual, não só verbal:
              o CTA comercial é uma caixa; este é uma linha. */}
          <div className="mt-10">
            <PreferredSourceCTA placement="article_end" pageType="article" />
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
              Artigos relacionados
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="border border-white/10 p-6 hover:border-white/30 transition-colors duration-200 group block"
                >
                  <span className="text-xs text-gray-400 tracking-wide uppercase">{rp.category}</span>
                  <h3
                    className="text-white font-semibold mt-2 mb-2 group-hover:text-gray-200 transition-colors"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {rp.title}
                  </h3>
                  <p className="text-gray-400 text-xs">{rp.readTime} de leitura</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
