import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import ExploradorExercicios from "@/components/mapa/ExploradorExercicios";
import { EXERCICIOS } from "@/lib/treino/exercicios";
import { GRUPO, GRUPOS, exerciciosDoGrupo } from "@/lib/treino/mapa";
import { GRUPOS_INDEXAVEIS } from "@/lib/treino/mapa-editorial";

/**
 * Hub da futura Biblioteca de Exercícios: o Mapa Muscular é a interface.
 * Base única (lib/treino/exercicios.ts), a mesma do Volume e do Substituidor.
 * Filtros (?equipamento=) são estado de interface: a canonical é esta URL.
 */

const CAMINHO = "/exercicios";

export const metadata: Metadata = {
  title: { absolute: "Mapa Muscular: Exercícios Para Cada Músculo | Montinho" },
  description: "Toque no músculo que quer treinar e veja exercícios por equipamento, nível e local de treino. Peito, costas, glúteos, pernas, braços e mais.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: { title: "Mapa Muscular de Exercícios | Montinho", description: "Toque no músculo que você quer treinar e veja os exercícios.", url: `${SITE_URL}${CAMINHO}`, type: "website", images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }] },
};

const appSchema = aplicativoSchema({ nome: "Mapa Muscular de Exercícios", descricao: "Mapa do corpo interativo para encontrar exercícios por músculo, filtrando por equipamento, complexidade e local de treino.", caminho: CAMINHO, categoria: "SportsApplication" });
const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
  { "@type": "ListItem", position: 2, name: "Exercícios", item: `${SITE_URL}${CAMINHO}` },
] };
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

export default function ExerciciosHub() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <section className="pt-12 pb-6 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5"><Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <span className="text-gray-400">Exercícios</span></nav>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#BA9E50" }}>Mapa Muscular de Exercícios</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3" style={h}>Toque no músculo que você quer treinar</h1>
          <p className="text-gray-300 text-lg leading-relaxed">Veja exercícios para cada grupo muscular e filtre pelo equipamento que você tem disponível.</p>
        </div>
      </section>
      <section className="pb-10 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"><ExploradorExercicios placement="hub" /></div>
      </section>
      <section className="py-14 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Exercícios por músculo</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GRUPOS_INDEXAVEIS.map((s) => <li key={s}><Link href={`/exercicios/${s}`} className={ln}>Exercícios para {GRUPO[s].para}</Link> <span className="text-xs text-gray-500">({exerciciosDoGrupo(s).length})</span></li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Como o mapa funciona</h2>
            <p>São {EXERCICIOS.length} exercícios, cada um com o músculo principal, os secundários, o padrão de movimento, o equipamento e a complexidade técnica, classificados à mão. A lista mostra primeiro os exercícios em que o músculo é o principal; dá para incluir os que o treinam como secundário. Não mostramos percentuais de ativação: a participação de cada músculo muda com a técnica, a carga e a pessoa, e números assim passariam uma precisão que não existe.</p>
            <p className="mt-3">É a mesma base do <Link href="/ferramentas/substituidor-de-exercicios" className={ln}>Substituidor de Exercícios</Link> e da <Link href="/ferramentas/calculadora-volume-treino" className={ln}>Calculadora de Volume</Link>: o exercício que você encontra aqui conta do mesmo jeito lá. Para o intervalo entre as séries, use a <Link href="/ferramentas/calculadora-descanso-entre-series" className={ln}>calculadora de descanso</Link>.</p>
          </div>
          <p className="text-gray-400 text-sm">Revisado em 5 de outubro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville. {GRUPOS.length} regiões musculares.</p>
        </div>
      </section>
    </>
  );
}
