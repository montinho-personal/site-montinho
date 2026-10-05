import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/blog";
import FAQ from "@/components/ui/FAQ";
import Substituidor from "@/components/substituidor/Substituidor";
import { PAGINAS_SUBSTITUIR, paginaPorSlug } from "@/lib/treino/substituir-seo";
import { NOME_TIER, substitui } from "@/lib/treino/substituicoes";

/**
 * Páginas editoriais "O que fazer no lugar de X?" — só para trocas com
 * demanda real e revisão (lib/treino/substituir-seo.ts). A lista de
 * alternativas sai do mesmo motor da ferramenta, renderizada no servidor.
 */

export const dynamicParams = false;
export function generateStaticParams() {
  return PAGINAS_SUBSTITUIR.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = paginaPorSlug(slug);
  if (!p) return {};
  const url = `${SITE_URL}/substituir/${p.slug}`;
  return {
    title: { absolute: p.title },
    description: p.description,
    alternates: { canonical: url },
    robots: p.isIndexable ? undefined : { index: false, follow: true },
    openGraph: { title: p.title, description: p.description, url, type: "article", images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }] },
  };
}

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

export default async function SubstituirPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = paginaPorSlug(slug);
  if (!p) notFound();
  const res = substitui({ exercicioId: p.exercicioId, motivo: p.exemplo.motivo, equipamentos: p.exemplo.equipamentos })!;
  const url = `${SITE_URL}/substituir/${p.slug}`;
  const schemas = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Substituidor de Exercícios", item: `${SITE_URL}/ferramentas/substituidor-de-exercicios` },
      { "@type": "ListItem", position: 3, name: p.h1, item: url },
    ] },
    { "@context": "https://schema.org", "@type": "Article", headline: p.h1, description: p.description, mainEntityOfPage: url, inLanguage: "pt-BR", dateModified: "2026-10-05", author: { "@type": "Person", name: "Montinho", url: `${SITE_URL}/minha-historia` } },
  ];

  return (
    <>
      {schemas.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
      <section className="pt-12 pb-6 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <Link href="/ferramentas/substituidor-de-exercicios" className="hover:text-white">Substituidor de Exercícios</Link> <span aria-hidden="true">/</span> <span className="text-gray-400">{p.nomeExercicio}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4" style={h}>{p.h1}</h1>
          <p className="text-gray-300 text-lg leading-relaxed">{p.respostaDireta}</p>
        </div>
      </section>

      <section className="pb-10 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Substituidor inicialId={p.exercicioId} placement={`substituir-${p.slug}`} />
        </div>
      </section>

      <section className="py-14 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Melhores alternativas</h2>
            <p className="mb-4 text-sm text-gray-400">Exemplo para quem está {p.exemplo.rotulo}. Na ferramenta acima, ajuste o motivo e os seus equipamentos.</p>
            <ol className="space-y-4 list-decimal pl-5">
              {res.proximas.slice(0, 4).map((a) => (
                <li key={a.ex.id}>
                  <strong className="text-white">{a.ex.nome}</strong> <span className="text-xs" style={{ color: "#BA9E50" }}>· {NOME_TIER[a.tier]}</span>
                  <p className="text-sm mt-1"><span className="text-white">Preserva:</span> {a.preserva.join("; ")}.</p>
                  <p className="text-sm"><span className="text-white">Muda:</span> {a.muda.length ? a.muda.join("; ") : "pouca coisa"}.</p>
                </li>
              ))}
            </ol>
          </div>
          {res.mesmoMusculo.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-3" style={h}>Qual opção é mais parecida?</h2>
              <p>As primeiras da lista preservam o músculo E o movimento do {p.nomeExercicio}. Já {res.mesmoMusculo.map((a) => a.ex.nome.toLowerCase()).join(", ")} treinam o mesmo músculo com outra função: complementam o treino, mas não fazem o mesmo papel.</p>
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Como escolher?</h2>
            <ul className="list-disc pl-5 space-y-1">{p.comoEscolher.map((x) => <li key={x}>{x}</li>)}</ul>
            <p className="mt-3 text-sm">A carga do exercício novo não precisa ser igual: comece mais leve e ajuste pelas repetições.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Quando não trocar?</h2>
            <p>{p.quandoNaoTrocar}</p>
            {p.artigo && <p className="mt-3">Leia também: <Link href={p.artigo.href} className={ln}>{p.artigo.texto}</Link>.</p>}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas comuns</h2>
            <FAQ itens={p.faq} placement={`substituir-${p.slug}`} />
          </div>
          <p className="text-gray-400 text-sm">Revisado em 5 de outubro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville. Conteúdo educativo; não substitui avaliação individual.</p>
        </div>
      </section>
    </>
  );
}
