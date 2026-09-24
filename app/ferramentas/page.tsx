import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, blogPosts } from "@/lib/blog";
import { CATEGORIAS, FERRAMENTAS_NO_AR } from "@/lib/ferramentas/catalogo";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import CentralFerramentas from "@/components/ferramentas/central/CentralFerramentas";
import LinkRastreado from "@/components/ferramentas/central/LinkRastreado";
import DoisCaminhos from "@/components/comece/DoisCaminhos";
import FaixaSimuladores from "@/components/simulador/FaixaSimuladores";

/**
 * A Central de Ferramentas.
 *
 * O QUE ESTA PÁGINA É, E O QUE NÃO É
 *
 * É o catálogo: a pessoa chega com uma dúvida ou um objetivo e sai com a
 * ferramenta certa em poucos segundos. Não é o /comece — aquele é o caminho
 * guiado, para quem pensa "me conduza". Daqui se aponta para lá uma vez,
 * num bloco compacto, e não se repete a jornada inteira.
 *
 * O que muda em relação à versão anterior: os trinta e cinco cards grandes,
 * empilhados numa coluna, viraram uma busca, seis filtros por problema, as
 * mais usadas e o catálogo por categoria. Tudo sai de
 * lib/ferramentas/catalogo.ts, inclusive o ItemList do schema — ferramenta
 * nova é uma entrada lá, não um card colado aqui.
 *
 * SEO DO HUB
 *
 * Esta página trabalha os termos amplos ("calculadoras fitness",
 * "ferramentas fitness gratuitas"). Cada ferramenta compete pela própria
 * busca na própria página; aqui não se repete o conteúdo delas.
 */

const CAMINHO = "/ferramentas";
const TOTAL = FERRAMENTAS_NO_AR.length;

export const metadata: Metadata = {
  title: "Calculadoras Fitness Grátis: Dieta, Treino e Suplementos",
  description:
    "Calcule calorias, proteína, macros, creatina, whey, 1RM e o gasto de corrida, caminhada e outras atividades. Ferramentas fitness gratuitas, sem cadastro.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadoras Fitness e Ferramentas Gratuitas | Montinho",
    description: `${TOTAL} ferramentas gratuitas para dieta, treino, emagrecimento, suplementação e cardio. Encontre a certa para a sua dúvida, sem cadastro.`,
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}${CAMINHO}` },
  ],
};

/**
 * CollectionPage com ItemList: a página é uma coleção, e a lista é o que
 * está no ar, na ordem do catálogo. Nada de Review, Rating ou FAQ — não há
 * avaliação de usuário nem perguntas respondidas aqui.
 */
const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Calculadoras Fitness e Ferramentas Gratuitas",
  url: `${SITE_URL}${CAMINHO}`,
  inLanguage: "pt-BR",
  isAccessibleForFree: true,
  mainEntity: {
    "@type": "ItemList",
    name: "Ferramentas gratuitas do Montinho Personal Trainer",
    numberOfItems: TOTAL,
    itemListElement: FERRAMENTAS_NO_AR.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: f.nome,
      url: `${SITE_URL}${f.href}`,
    })),
  },
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const botao = `inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] hover:bg-gray-100 transition-colors ${foco}`;
const botaoSec = `inline-flex items-center justify-center gap-2 border border-white/25 text-white px-6 py-3.5 text-sm font-semibold min-h-[52px] hover:border-white/50 transition-colors ${foco}`;

/**
 * O atalho para os caminhos guiados, passado para dentro da central, que o
 * esconde durante uma busca. Os dois cartões levam direto a /comece/dieta e
 * /comece/treino; o componente é o mesmo da home e dos simuladores.
 */
function CaminhoGuiado() {
  return <DoisCaminhos variante="hub" placement="ferramentas_hub" />;
}

export default function FerramentasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      {/* ── Breadcrumb + Hero ── */}
      <section className="pt-6 pb-10 bg-black border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Você está em" className="text-sm text-gray-500 mb-8">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className={`hover:text-white transition-colors ${foco}`}>
                  Início
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-gray-300" aria-current="page">
                  Ferramentas
                </span>
              </li>
            </ol>
          </nav>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
              Central de ferramentas · gratuitas · sem cadastro
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={h}>
              Calculadoras Fitness e Ferramentas Gratuitas
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Encontre a ferramenta certa para a sua dúvida sobre treino, alimentação, emagrecimento ou suplementação.
            </p>
            <p className="text-gray-500 text-sm mt-3">
              {TOTAL} ferramentas em {CATEGORIAS.length} categorias. O resultado aparece na hora, e o que você digita não sai do seu navegador.
            </p>
          </div>
        </div>
      </section>

      {/* ── Simuladores: antes do catálogo, para quem chega com "quanto tempo até..." ── */}
      <div className="pt-10 bg-black"><FaixaSimuladores /></div>

      {/* ── Busca, filtros, mais usadas e catálogo ── */}
      <section className="py-10 bg-black">
        <CentralFerramentas caminhoGuiado={<CaminhoGuiado />} />
      </section>

      {/* ── Confiança: de onde vem, e o que não faz ── */}
      <section className="py-14 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-white mb-3" style={h}>
              De onde vêm as respostas
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              De três lugares: a prática de acompanhar alunos todos os dias; a evidência científica, com os estudos citados em cada
              ferramenta e artigo, para você conferir; e o trabalho de treinadores que eu estudo e acompanho. Toda calculadora mostra a
              conta e a fonte, em “como calculamos”. Nenhuma fonte entrega fórmula secreta: elas dão direção.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-3" style={h}>
              O que elas não fazem
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Nenhuma conhece sua técnica, sua força atual, seu histórico de lesão ou como você recupera. São ferramentas educativas:
              entregam estimativa e orientação, não prescrição individual. Não substituem médico, fisioterapeuta ou nutricionista, e
              não fazem diagnóstico. Nenhuma pede cadastro, e-mail ou telefone.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA comercial: depois de resolver, e não antes ── */}
      <section className="py-14 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-6 sm:p-8 relative" data-testid="cta-comercial">
            <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
            <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2" style={h}>
              As ferramentas fazem a conta. Eu te ajudo a transformar os números em estratégia.
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-2xl">
              Quando o próximo passo precisa considerar o seu caso de verdade — exercícios, cargas, progressão, correção de execução e
              ajustes ao longo do caminho —, o caminho é o acompanhamento, presencial em Alphaville e região ou online.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <LinkRastreado href="/consultoria" evento="tools_hub_cta_click" params={{ destination: "consultoria" }} className={botao}>
                Conhecer meu acompanhamento <span aria-hidden="true">→</span>
              </LinkRastreado>
              <LinkRastreado
                href={getWhatsAppUrl("Oi, Montinho! Estava na sua central de ferramentas e queria entender como funciona o acompanhamento.")}
                externo
                evento="whatsapp_click"
                params={{ cta_location: "ferramentas_hub", page_type: "ferramentas", lead_channel: "whatsapp" }}
                className={botaoSec}
              >
                Falar com o Montinho
              </LinkRastreado>
            </div>
          </div>
        </div>
      </section>

      {/* ── Institucional, mínimo ── */}
      <section className="pb-14 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
            Prefere ler antes? O{" "}
            <Link href="/blog" className={ln}>
              blog
            </Link>{" "}
            tem {blogPosts.length} conteúdos sobre treino, emagrecimento, exercícios e nutrição, a mesma base que alimenta estas
            ferramentas. Você também pode conhecer{" "}
            <Link href="/minha-historia" className={ln}>
              a história por trás disso tudo
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
