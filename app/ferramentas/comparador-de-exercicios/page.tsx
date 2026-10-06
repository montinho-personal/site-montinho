import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import Comparador from "@/components/comparador/Comparador";
import { EXERCICIO_POR_ID } from "@/lib/treino/exercicios";
import { COMPARAVEIS, EDITORIAL, POPULARES, chavePar } from "@/lib/treino/comparador";

/**
 * Comparador de Exercícios — "qual faz mais sentido para quê?".
 * ?a=…&b=… pré-preenche no navegador; a canonical é sempre esta URL limpa,
 * então nenhum par vira página indexada sozinho. Os pares mais buscados já
 * têm artigo no blog, que é quem ranqueia por eles (sem /comparar/*).
 */

const CAMINHO = "/ferramentas/comparador-de-exercicios";

export const metadata: Metadata = {
  title: { absolute: "Comparador de Exercícios: Veja as Diferenças | Montinho" },
  description: "Compare dois exercícios e veja diferenças em músculos trabalhados, movimento, estabilidade, equipamentos e contexto de treino.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Qual exercício faz mais sentido? | Montinho",
    description: "Compare dois exercícios: o que é igual, o que muda e em que contexto cada um tende a fazer mais sentido.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Comparador de Exercícios",
  descricao: "Compara dois exercícios por músculos principais e secundários, padrão de movimento, estabilidade, complexidade técnica, equipamento e progressão, com conclusão por objetivo.",
  caminho: CAMINHO,
  categoria: "SportsApplication",
});
const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Comparador de Exercícios", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

export default function ComparadorPage() {
  const artigos = POPULARES.map(([a, b]) => ({ a, b, artigo: EDITORIAL[chavePar(a, b)]?.artigo })).filter((x) => x.artigo);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />

      <section className="pt-12 pb-6 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <Link href="/ferramentas" className="hover:text-white">Ferramentas</Link> <span aria-hidden="true">/</span> <span className="text-gray-400">Comparador de Exercícios</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4" style={h}>Comparador de Exercícios</h1>
          <p className="text-gray-300 text-lg leading-relaxed">Compare dois exercícios e veja o que muda em músculos, movimento, estabilidade, equipamentos e contexto de uso. Não existe exercício melhor em tudo: a pergunta certa é qual faz mais sentido para o que você quer.</p>
        </div>
      </section>

      <section className="pb-10 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Comparador />
          <noscript><p className="text-gray-300 mt-4">A ferramenta precisa de JavaScript. As comparações mais buscadas têm artigos próprios, logo abaixo.</p></noscript>
        </div>
      </section>

      <section className="py-14 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Qual é melhor? Melhor para quê</h2>
            <p>Agachamento ou leg press, barra ou halteres, stiff ou mesa flexora: a resposta muda com o objetivo. Para ganhar músculo, exercícios diferentes podem cumprir o mesmo papel. Para ficar mais forte em um movimento, o próprio movimento tende a transferir mais. Por isso o comparador mostra primeiro o que é igual e o que muda, e só depois, se você escolher um objetivo, em que contexto cada um tende a fazer mais sentido.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>O que é comparado</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">Músculos</strong> principais e secundários, sem percentuais: a participação de cada músculo muda com técnica, carga e pessoa.</li>
              <li><strong className="text-white">Movimento</strong>: se é o mesmo, parecido ou diferente (agachamento, dobradiça de quadril, extensão de joelho…).</li>
              <li><strong className="text-white">Estabilidade e técnica</strong>, em baixa, moderada e alta. Mais estabilidade ou mais técnica não quer dizer melhor.</li>
              <li><strong className="text-white">Equipamento, lados e progressão de carga</strong>: o que é preciso, se é um lado por vez e quão fácil é subir a carga.</li>
            </ul>
            <p className="mt-3">A base tem {COMPARAVEIS} exercícios com os nomes usados nas academias brasileiras, a mesma do <Link href="/ferramentas/substituidor-de-exercicios" className={ln}>Substituidor</Link>, do <Link href="/exercicios" className={ln}>Mapa Muscular</Link> e da <Link href="/ferramentas/calculadora-volume-treino" className={ln}>calculadora de volume</Link>. Os pares mais comparados têm observações revisadas uma a uma. A ferramenta não diz se um exercício é seguro para uma dor ou lesão: isso pede avaliação.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Comparações em detalhe</h2>
            <ul className="space-y-2">{artigos.map((x) => <li key={x.artigo}><Link href={`/blog/${x.artigo}`} className={ln}>{EXERCICIO_POR_ID.get(x.a)?.nome} ou {EXERCICIO_POR_ID.get(x.b)?.nome?.toLowerCase()}?</Link></li>)}</ul>
          </div>
          <p className="text-gray-400 text-sm">Revisado em 6 de outubro de 2026 por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville.</p>
        </div>
      </section>
    </>
  );
}
