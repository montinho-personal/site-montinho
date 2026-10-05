import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/blog";
import ExploradorExercicios from "@/components/mapa/ExploradorExercicios";
import { ARTIGO_DO_EXERCICIO, EQUIP_CASA, GRUPO, GRUPOS, exerciciosDoGrupo, filtra, type GrupoSlug } from "@/lib/treino/mapa";
import { EDITORIAL } from "@/lib/treino/mapa-editorial";

export const dynamicParams = false;
export function generateStaticParams() { return GRUPOS.map((g) => ({ grupo: g.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ grupo: string }> }): Promise<Metadata> {
  const { grupo } = await params;
  const e = EDITORIAL[grupo as GrupoSlug];
  if (!e) return {};
  const url = `${SITE_URL}/exercicios/${grupo}`;
  return {
    title: { absolute: e.title }, description: e.description,
    alternates: { canonical: url },
    robots: e.isIndexable ? undefined : { index: false, follow: true },
    openGraph: { title: e.title, description: e.description, url, type: "article", images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }] },
  };
}

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

function ListaNomes({ itens }: { itens: { id: string; nome: string }[] }) {
  if (!itens.length) return <p className="text-sm text-gray-500">Nenhum na base para este grupo.</p>;
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1">
      {itens.map((e) => <li key={e.id}>{ARTIGO_DO_EXERCICIO[e.id] ? <Link href={`/blog/${ARTIGO_DO_EXERCICIO[e.id]}`} className={ln}>{e.nome}</Link> : e.nome}</li>)}
    </ul>
  );
}

export default async function GrupoPage({ params }: { params: Promise<{ grupo: string }> }) {
  const { grupo } = await params;
  const g = GRUPO[grupo as GrupoSlug];
  const e = EDITORIAL[grupo as GrupoSlug];
  if (!g || !e) notFound();
  const todos = exerciciosDoGrupo(g.slug);
  const compostos = todos.filter((x) => x.categoria === "composto");
  const isoladores = todos.filter((x) => x.categoria === "isolado");
  const halteres = filtra(todos, { equipamentos: ["halter", "banco"] });
  const casa = filtra(todos, { equipamentos: EQUIP_CASA });
  const url = `${SITE_URL}/exercicios/${g.slug}`;
  const trilha = [{ name: "Home", item: SITE_URL }, { name: "Exercícios", item: `${SITE_URL}/exercicios` }, ...(g.pai ? [{ name: GRUPO[g.pai].nome, item: `${SITE_URL}/exercicios/${g.pai}` }] : []), { name: g.nome, item: url }];
  const schemas = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: trilha.map((t, i) => ({ "@type": "ListItem", position: i + 1, ...t })) },
    { "@context": "https://schema.org", "@type": "Article", headline: e.h1, description: e.description, mainEntityOfPage: url, inLanguage: "pt-BR", dateModified: "2026-10-05", author: { "@type": "Person", name: "Montinho", url: `${SITE_URL}/minha-historia` } },
  ];

  return (
    <>
      {schemas.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
      <section className="pt-12 pb-6 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <Link href="/exercicios" className="hover:text-white">Exercícios</Link>
            {g.pai && <> <span aria-hidden="true">/</span> <Link href={`/exercicios/${g.pai}`} className="hover:text-white">{GRUPO[g.pai].nome}</Link></>}
            {" "}<span aria-hidden="true">/</span> <span className="text-gray-400">{g.nome}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3" style={h}>{e.h1}</h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">{e.resposta}</p>
        </div>
      </section>
      <section className="pb-10 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"><ExploradorExercicios inicial={g.slug} placement={`grupo-${g.slug}`} /></div>
      </section>
      <section className="py-14 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-gray-300 leading-relaxed">
          <div><h2 className="text-2xl font-bold text-white mb-3" style={h}>Como escolher exercícios para {g.para}?</h2><p>{e.comoEscolher}</p><p className="mt-3">Não existe um único exercício universalmente melhor: a seleção depende do equipamento, do conforto, da capacidade de progredir e do resto do treino.</p></div>
          {!g.porPadrao && <div><h2 className="text-2xl font-bold text-white mb-3" style={h}>Exercícios compostos para {g.para}</h2><ListaNomes itens={compostos} /></div>}
          {!g.porPadrao && <div><h2 className="text-2xl font-bold text-white mb-3" style={h}>Exercícios isoladores</h2><ListaNomes itens={isoladores} /></div>}
          <div><h2 className="text-2xl font-bold text-white mb-3" style={h}>Exercícios para {g.para} com halteres</h2><ListaNomes itens={halteres} /></div>
          <div><h2 className="text-2xl font-bold text-white mb-3" style={h}>Exercícios para {g.para} em casa</h2><p className="mb-2">{e.emCasa}</p><ListaNomes itens={casa} /></div>
          {e.extras?.map((x) => <div key={x.h2}><h2 className="text-2xl font-bold text-white mb-3" style={h}>{x.h2}</h2><p>{x.p}</p></div>)}
          <div><h2 className="text-2xl font-bold text-white mb-3" style={h}>Quantos exercícios colocar no treino?</h2><p>Para a maioria das pessoas, 1 a 3 exercícios por grupo muscular em cada treino bastam; o que mais pesa é o total de séries na semana e a progressão. A <Link href="/ferramentas/calculadora-volume-treino" className={ln}>calculadora de volume</Link> mostra quantas séries semanais você faz para cada músculo, e a <Link href="/ferramentas/calculadora-descanso-entre-series" className={ln}>calculadora de descanso</Link>, quanto esperar entre elas. Sem um aparelho? O <Link href="/ferramentas/substituidor-de-exercicios" className={ln}>Substituidor</Link> sugere alternativas.</p></div>
          {e.artigos.length > 0 && <div><h2 className="text-2xl font-bold text-white mb-3" style={h}>Artigos relacionados</h2><ul className="space-y-1">{e.artigos.map((a) => <li key={a.slug}><Link href={`/blog/${a.slug}`} className={ln}>{a.texto}</Link></li>)}</ul></div>}
          <p className="text-gray-400 text-sm">Revisado em 5 de outubro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville. Classificação por anatomia funcional e padrão de movimento, sem percentuais de ativação.</p>
        </div>
      </section>
    </>
  );
}
