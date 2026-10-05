import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import Substituidor from "@/components/substituidor/Substituidor";
import { EXERCICIOS } from "@/lib/treino/exercicios";
import { PAGINAS_SUBSTITUIR } from "@/lib/treino/substituir-seo";

/**
 * Substituidor de Exercícios — "Qual exercício posso fazer no lugar?".
 * ?exercicio=… pré-seleciona no navegador; a canonical é sempre esta URL limpa.
 */

const CAMINHO = "/ferramentas/substituidor-de-exercicios";

export const metadata: Metadata = {
  title: { absolute: "Substituidor de Exercícios: O Que Fazer no Lugar? | Montinho" },
  description: "Escolha um exercício e veja alternativas de acordo com músculo, movimento e equipamentos disponíveis, com o que cada opção preserva e o que muda.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Qual exercício posso fazer no lugar? | Montinho",
    description: "Alternativas que preservam o objetivo do exercício, com o que você tem disponível.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Substituidor de Exercícios",
  descricao: "Sugere exercícios alternativos que preservam músculo, padrão de movimento e função, filtrando pelos equipamentos disponíveis e pelo motivo da troca.",
  caminho: CAMINHO,
  categoria: "SportsApplication",
});
const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Substituidor de Exercícios", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

export default function SubstituidorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />

      <section className="pt-12 pb-6 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <Link href="/ferramentas" className="hover:text-white">Ferramentas</Link> <span aria-hidden="true">/</span> <span className="text-gray-400">Substituidor de Exercícios</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4" style={h}>Qual exercício posso fazer no lugar?</h1>
          <p className="text-gray-300 text-lg leading-relaxed">Escolha o exercício que quer substituir, diga o motivo e veja alternativas que preservam o objetivo do seu treino, com base nos músculos, no padrão de movimento e nos equipamentos que você tem.</p>
        </div>
      </section>

      <section className="pb-10 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Substituidor />
          <noscript><p className="text-gray-300 mt-4">A ferramenta precisa de JavaScript. As trocas mais buscadas têm páginas próprias, logo abaixo.</p></noscript>
        </div>
      </section>

      <section className="py-14 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Mesmo músculo não é o mesmo exercício</h2>
            <p>Leg press e cadeira extensora treinam quadríceps, mas um é agachamento e o outro é extensão de joelho. Mesa flexora e stiff treinam posteriores, mas um flexiona o joelho e o outro dobra o quadril. Por isso o Substituidor procura primeiro o que preserva o músculo E o movimento, e só depois mostra outras formas de treinar o mesmo músculo, separadas e com o aviso de que mudam a função.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Como as alternativas são escolhidas</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">Músculo principal e padrão de movimento</strong> pesam mais: são o que o exercício fazia no seu treino.</li>
              <li><strong className="text-white">Equipamento</strong> é filtro: o que você não tem não aparece.</li>
              <li><strong className="text-white">O motivo da troca</strong> muda a ordem: em casa sobem peso corporal e elástico; com desconforto, opções que mudam apoio, posição ou equipamento; para quem não consegue executar bem, as mais simples.</li>
              <li><strong className="text-white">Estabilidade e técnica</strong> entram como diferença, e cada alternativa diz o que preserva e o que muda.</li>
            </ul>
            <p className="mt-3">A base tem {EXERCICIOS.length} exercícios com os nomes usados nas academias brasileiras, a mesma usada pela <Link href="/ferramentas/calculadora-volume-treino" className={ln}>calculadora de volume</Link>. As relações dos exercícios mais trocados foram revisadas uma a uma.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Antes de trocar</h2>
            <p>Você não precisa trocar um exercício só porque já faz há algumas semanas: se ele continua confortável e progredindo, pode ficar. Quando trocar, não use a carga antiga como referência; máquinas e exercícios diferentes não se comparam em quilos. E se um exercício causa dor persistente, esta ferramenta não substitui uma avaliação.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Trocas mais buscadas</h2>
            <ul className="space-y-2">{PAGINAS_SUBSTITUIR.filter((p) => p.isIndexable).map((p) => <li key={p.slug}><Link href={`/substituir/${p.slug}`} className={ln}>{p.h1}</Link></li>)}</ul>
          </div>
          <p className="text-gray-400 text-sm">Revisado em 5 de outubro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville.</p>
        </div>
      </section>
    </>
  );
}
