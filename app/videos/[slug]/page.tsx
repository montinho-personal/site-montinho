import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/blog";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import { VIDEOS_CANAL, videoPorSlug, videoSchema } from "@/lib/videos";
import WhatsCta from "@/components/lp/WhatsCta";

/**
 * /videos/<slug> — uma página por vídeo do canal do Montinho.
 *
 * O vídeo é o conteúdo principal (é o que o Google exige para mostrar a
 * página com miniatura na busca). Embaixo: o que o Montinho diz, os artigos
 * e a ferramenta que continuam o assunto, a ideia de não se comparar e o
 * WhatsApp.
 */

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return VIDEOS_CANAL.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const v = videoPorSlug(slug);
  if (!v) return {};
  const url = `${SITE_URL}/videos/${v.slug}`;
  return {
    title: v.metaTitle,
    description: v.descricao,
    alternates: { canonical: url },
    openGraph: {
      title: v.titulo,
      description: v.descricao,
      url,
      type: "video.other",
      images: [{ url: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`, width: 480, height: 360 }],
    },
  };
}

export default async function VideoPage({ params }: Props) {
  const { slug } = await params;
  const v = videoPorSlug(slug);
  if (!v) notFound();

  const schema = videoSchema(v, SITE_URL);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Vídeos", item: `${SITE_URL}/videos` },
      { "@type": "ListItem", position: 3, name: v.titulo, item: `${SITE_URL}/videos/${v.slug}` },
    ],
  };
  const outros = VIDEOS_CANAL.filter((o) => o.slug !== v.slug).slice(0, 4);

  return (
    <main className="bg-black min-h-screen pt-28 pb-20 px-4">
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <article className="max-w-2xl mx-auto">
        <nav className="text-sm text-gray-400 mb-4">
          <Link href="/videos" className="underline underline-offset-4 hover:text-white">Vídeos</Link>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">{v.titulo}</h1>

        <div style={{ maxWidth: 360, margin: "0 auto 2rem" }}>
          <div style={{ position: "relative", paddingBottom: "177.78%", height: 0, overflow: "hidden", borderRadius: 12 }}>
            <iframe
              src={`https://www.youtube.com/embed/${v.id}?rel=0`}
              title={`${v.titulo} — Montinho Personal Trainer`}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-3">O que o Montinho diz no vídeo</h2>
        {v.texto.map((p) => (
          <p key={p} className="text-gray-200 leading-relaxed mb-4">{p}</p>
        ))}

        {(v.artigos.length > 0 || v.ferramenta) && (
          <>
            <h2 className="text-xl font-bold text-white mt-8 mb-3">Para ir além</h2>
            <ul className="list-disc pl-5 text-gray-200 space-y-2">
              {v.artigos.map((a) => (
                <li key={a.href}><Link href={a.href} className="underline underline-offset-4 hover:text-white">{a.nome}</Link></li>
              ))}
              {v.ferramenta && (
                <li><Link href={v.ferramenta.href} className="underline underline-offset-4 hover:text-white">{v.ferramenta.nome}</Link> (ferramenta gratuita)</li>
              )}
            </ul>
          </>
        )}

        <div className="border border-white/15 p-5 mt-10 mb-8">
          <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#BA9E50" }}>{FECHAMENTO_COMPARACAO.titulo}</p>
          {FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white leading-relaxed mb-3">{t}</p>)}
          <p className="text-gray-400 text-sm">— Montinho</p>
        </div>

        <WhatsCta
          label="Quero um treino que eu consiga manter"
          message={`Oi, Montinho! Vi o seu vídeo "${v.titulo}" no site e quero saber como funciona o acompanhamento.`}
          sub="Consultoria online ou presencial em Alphaville e região"
          posicao={`video-${v.slug}`}
        />

        <h2 className="text-xl font-bold text-white mt-12 mb-3">Mais vídeos</h2>
        <ul className="text-gray-200 space-y-2">
          {outros.map((o) => (
            <li key={o.slug}><Link href={`/videos/${o.slug}`} className="underline underline-offset-4 hover:text-white">{o.titulo}</Link></li>
          ))}
        </ul>
      </article>
    </main>
  );
}
