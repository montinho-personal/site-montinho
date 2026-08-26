import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import AskMontinho from "@/components/ask/AskMontinho";

export const metadata: Metadata = {
  title: "Pergunte ao Montinho: Tire Suas Dúvidas de Treino",
  description:
    "Assistente inteligente que responde suas dúvidas de musculação, emagrecimento e exercícios buscando nos conteúdos publicados pelo Montinho — com as fontes de cada resposta.",
  alternates: {
    canonical: `${SITE_URL}/pergunte-ao-montinho`,
  },
  openGraph: {
    title: "Pergunte ao Montinho: Tire Suas Dúvidas de Treino",
    description:
      "Assistente inteligente que responde dúvidas de treino buscando nos conteúdos do Montinho — com as fontes de cada resposta.",
    url: `${SITE_URL}/pergunte-ao-montinho`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Pergunte ao Montinho",
  description:
    "Assistente inteligente que busca respostas nos conteúdos publicados pelo Montinho Personal Trainer sobre musculação, emagrecimento e exercícios.",
  url: `${SITE_URL}/pergunte-ao-montinho`,
  author: {
    "@type": "Person",
    name: "Montinho",
    url: `${SITE_URL}/minha-historia`,
    jobTitle: "Personal Trainer",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Pergunte ao Montinho", item: `${SITE_URL}/pergunte-ao-montinho` },
  ],
};

const POPULAR = [
  { slug: "/blog/frequencia-de-treino", title: "Frequência de Treino: Quantas Vezes Por Semana?" },
  { slug: "/blog/como-montar-treino-de-hipertrofia", title: "Como Montar um Treino de Hipertrofia" },
  { slug: "/blog/deficit-calorico-como-calcular", title: "Déficit Calórico: Como Calcular o Seu" },
  { slug: "/blog/primeira-semana-na-academia", title: "Primeira Semana na Academia" },
];

export default function PergunteAoMontinhoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-5">
            Assistente do site
          </p>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Pergunte ao Montinho
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            Pergunte o que quiser sobre musculação, treino e emagrecimento. Cada
            resposta é construída a partir dos mais de 800 conteúdos escritos pelo
            Montinho — a experiência de quem perdeu 40 kg e acompanha alunos todos
            os dias, apoiada na evidência científica e no que as principais
            referências do treinamento de força ensinam.
          </p>
          <p className="text-gray-400 text-base leading-relaxed">
            Você recebe a explicação e vê exatamente quais artigos a embasaram.
          </p>
        </div>
      </section>

      {/* Chat */}
      <section className="py-10 bg-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <AskMontinho />
        </div>
      </section>

      {/* Conteúdo indexável */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2
              className="text-2xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              O que é o Pergunte ao Montinho
            </h2>
            <p className="text-gray-300 leading-relaxed">
              É um assistente inteligente que transforma o acervo do site — centenas
              de artigos sobre treino, emagrecimento, exercícios, nutrição e
              acompanhamento — em respostas diretas. Em vez de procurar artigo por
              artigo, você pergunta com suas palavras e ele busca os trechos mais
              relevantes dos conteúdos do Montinho para montar a resposta, sempre
              mostrando de onde ela veio.
            </p>
          </div>

          <div>
            <h2
              className="text-2xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Que tipo de dúvida ele responde
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Perguntas sobre treino e frequência ("quantas vezes por semana devo
              treinar?"), execução de exercícios ("como fazer remada curvada?"),
              emagrecimento e alimentação ("musculação emagrece?"), e também sobre o
              acompanhamento do Montinho ("atende em Alphaville?", "como funciona a
              consultoria online?"). Quando a base não tem conteúdo suficiente para
              responder com segurança, ele diz isso com honestidade em vez de
              inventar.
            </p>
          </div>

          <div>
            <h2
              className="text-2xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              De onde vêm as respostas — e os limites
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              A fonte é o próprio site: os artigos do{" "}
              <Link href="/blog" className="underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors">
                blog
              </Link>{" "}
              e as páginas de serviço, escritos dentro da filosofia do Montinho —
              resultados reais, sem fórmulas mágicas. O assistente não substitui
              médico, fisioterapeuta ou nutricionista, não faz diagnóstico e não
              prescreve nada: é conteúdo educativo. Para orientação individual, o
              caminho é o{" "}
              <Link href="/consultoria" className="underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors">
                acompanhamento personalizado
              </Link>
              .
            </p>
            <p className="text-gray-300 leading-relaxed mb-3">
              A ferramenta foi criada sobre os conteúdos do{" "}
              <Link href="/minha-historia" className="underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors">
                Montinho, personal trainer em Alphaville
              </Link>{" "}
              que perdeu mais de 40 kg na própria transformação — a mesma
              experiência prática que sustenta cada artigo usado nas respostas.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Cada dica nasce de três lugares: a experiência de quem vive isso na
              prática e acompanha alunos todos os dias; a{" "}
              <strong className="text-white font-semibold">evidência científica</strong>{" "}
              — os estudos estão citados nas referências dos próprios artigos, para
              você conferir; e o trabalho de grandes treinadores do Brasil e do
              mundo que o Montinho estuda e acompanha, entre eles Fabrício
              Pacholok, Leandro Twin, Júlio Balestrin, Coach Rubens e Hany Rambod.
              No fim, nenhuma dessas fontes entrega uma fórmula secreta: elas dão
              direção. A melhor estratégia continua sendo a que se encaixa nas suas
              individualidades e na sua rotina de agora — a que você consegue
              seguir por mais tempo, com mais consistência e melhor progressão.
            </p>
          </div>

          <div>
            <h2
              className="text-2xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Conteúdos mais buscados
            </h2>
            <ul className="space-y-2">
              {POPULAR.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={p.slug}
                    className="text-gray-300 underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
